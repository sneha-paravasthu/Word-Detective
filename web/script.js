console.log("Word Detective is ready!");
async function startGame() {
  await loadCustomWords();
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".features").style.display = "none";

  document.getElementById("gameScreen").style.display = "block";
}
// Open the Find a Word screen
function findWord() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("findWordScreen").style.display = "block";
}
// Open the Word Hints screen
function getHints() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("hintsScreen").style.display = "block";
}
// Open the Guess the Word screen
function playGuessingGame() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("guessScreen").style.display = "block";

  startNewRound();
}
// Search for a word

async function searchWord() {
  const word = document.getElementById("searchInput").value.trim();
  const result = document.getElementById("searchResult");

  if (word === "") {
    result.textContent = "Please enter a word!";
    result.style.color = "#ff6b6b";
    return;
  }

  result.textContent = "Searching...";

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: word }),
    });

    const data = await response.json();

    result.textContent = data.message;
    result.style.color = data.found ? "green" : "#ff6b6b";
  } catch (error) {
    result.textContent = "Unable to connect to the server!";
    result.style.color = "#ff6b6b";
  }
}

// Return to the game menu
function goBack() {
  document.getElementById("findWordScreen").style.display = "none";
  document.getElementById("hintsScreen").style.display = "none";
  document.getElementById("guessScreen").style.display = "none";
  document.getElementById("categoriesScreen").style.display = "none";
  document.getElementById("addWordScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
}
// Show word suggestions while typing

async function showHints() {
  const input = document.getElementById("hintInput").value.toLowerCase().trim();
  const results = document.getElementById("hintResults");

  results.innerHTML = "";

  if (input === "") {
    results.innerHTML = "<p>Start typing to see suggestions!</p>";
    return;
  }

  results.innerHTML = "<p>Finding suggestions...</p>";

  try {
    const response = await fetch("/api/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefix: input }),
    });

    const data = await response.json();

    results.innerHTML = "";

    if (!response.ok || data.suggestions.length === 0) {
      results.innerHTML = "<p>No matching words found.</p>";
      return;
    }

    data.suggestions.forEach((word) => {
      const item = document.createElement("div");
      item.className = "hint-item";
      item.textContent = "🔤 " + word;
      results.appendChild(item);
    });
  } catch (error) {
    results.innerHTML = "<p>Unable to connect to the server!</p>";
  }
}

// Guessing game data

const mysteryWords = [
  // 🍎 Fruits
  {
    word: "apple",
    clue: "I am a red or green fruit. Doctors are often associated with me!",
  },
  { word: "banana", clue: "I am a long, yellow fruit that monkeys love." },
  { word: "mango", clue: "I am known as the king of fruits." },
  { word: "orange", clue: "I am a citrus fruit and my name is also a colour." },
  { word: "grapes", clue: "I grow in bunches and can be used to make juice." },
  { word: "pineapple", clue: "I have a spiky crown and a rough outer skin." },
  {
    word: "strawberry",
    clue: "I am a red fruit with tiny seeds outside.",
  },
  { word: "watermelon", clue: "I am large, green outside and red inside." },
  { word: "papaya", clue: "I have orange flesh and black seeds." },
  {
    word: "kiwi",
    clue: "I am a small fruit with fuzzy brown skin and green flesh.",
  },
  { word: "peach", clue: "I have soft fuzzy skin and a large stone inside." },
  {
    word: "pear",
    clue: "I am shaped like a teardrop and often come in green, yellow, or red!",
  },
  { word: "cherry", clue: "I am a small red fruit that often has a stem." },
  { word: "guava", clue: "I am a tropical fruit with white or pink flesh." },
  { word: "pomegranate", clue: "I contain hundreds of juicy red seeds." },

  // 🐶 Animals
  { word: "tiger", clue: "I am a big cat with black stripes and orange fur." },
  {
    word: "elephant",
    clue: "I am the largest land animal and have a long trunk.",
  },
  { word: "rabbit", clue: "I have long ears and love eating carrots." },
  {
    word: "dolphin",
    clue: "I am an intelligent sea mammal that loves jumping.",
  },
  {
    word: "penguin",
    clue: "I am a flightless bird that lives in cold regions.",
  },
  { word: "lion", clue: "I am called the king of the jungle." },

  // 💻 Technology
  {
    word: "computer",
    clue: "I help you work, study, play games and browse the internet.",
  },
  { word: "keyboard", clue: "You use me to type letters and numbers." },
  { word: "internet", clue: "I connect people and devices around the world." },
  {
    word: "software",
    clue: "I am a set of programs that tells a computer what to do.",
  },
  {
    word: "robot",
    clue: "I am a machine that can perform tasks automatically.",
  },
  {
    word: "laptop",
    clue: "I am a portable computer that you can carry around.",
  },
];
// Load custom words and clues from the server
async function loadCustomWords() {
  try {
    const response = await fetch("/api/custom-words");
    const data = await response.json();

    if (data.success && Array.isArray(data.words)) {
      data.words.forEach((item) => {
        const alreadyExists = mysteryWords.some(
          (word) => word.word === item.word,
        );

        if (!alreadyExists) {
          mysteryWords.push({
            word: item.word,
            clue: item.clue,
          });
        }
      });
    }

    console.log("Guessing game words:", mysteryWords);
  } catch (error) {
    console.error("Unable to load custom words:", error);
  }
}
// Game variables
let currentWord = "";
let attemptsLeft = 3;
let score = 0;

// Start a new guessing round
function startNewRound() {
  const randomIndex = Math.floor(Math.random() * mysteryWords.length);

  currentWord = mysteryWords[randomIndex].word;

  document.getElementById("gameClue").textContent =
    mysteryWords[randomIndex].clue;

  attemptsLeft = 3;

  document.getElementById("attempts").textContent = attemptsLeft;
  document.getElementById("score").textContent = score;

  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").disabled = false;
  document.getElementById("guessResult").textContent = "";
}
// Check the player's guess

function checkGuess() {
  const answer = document
    .getElementById("guessInput")
    .value.trim()
    .toLowerCase();

  const result = document.getElementById("guessResult");

  if (attemptsLeft <= 0) {
    result.textContent = "😢 Game over! Start a new round.";
    return;
  }

  if (answer === "") {
    result.textContent = "⚠️ Please enter your guess!";
    result.style.color = "#ff6b6b";
    return;
  }

  if (answer === currentWord) {
    score += 10;

    result.textContent = "🎉 Correct! +10 points! Next word coming up...";
    result.style.color = "green";

    document.getElementById("guessInput").disabled = true;

    document.getElementById("score").textContent = score;

    setTimeout(function () {
      startNewRound();
    }, 2000);
  } else {
    // End the game if the score is less than 2
    if (score < 2) {
      attemptsLeft = 0;

      result.textContent =
        "😢 Game over! You don't have enough points to continue. The word was " +
        currentWord +
        ".";

      result.style.color = "#ff6b6b";
      document.getElementById("guessInput").disabled = true;
    } else {
      score -= 2;
      attemptsLeft = Math.max(0, attemptsLeft - 1);

      if (attemptsLeft > 0) {
        result.textContent = "❌ Wrong guess! -2 points. Try again!";
      } else {
        result.textContent =
          "😢 Game over! The word was " + currentWord + ". -2 points.";
        document.getElementById("guessInput").disabled = true;
      }

      result.style.color = "#ff6b6b";
    }
  }

  document.getElementById("attempts").textContent = attemptsLeft;
  document.getElementById("score").textContent = score;
}

// Open the Categories screen
async function showCategories() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("categoriesScreen").style.display = "block";

  const categoryOptions = document.getElementById("categoryOptions");

  categoryOptions.innerHTML = "<p>Loading categories...</p>";

  try {
    const response = await fetch("/api/categories");
    const data = await response.json();

    categoryOptions.innerHTML = "";

    if (!response.ok || data.categories.length === 0) {
      categoryOptions.innerHTML = "<p>No categories found!</p>";
      return;
    }

    data.categories.forEach((category) => {
      const button = document.createElement("button");

      button.textContent = "📖 " + category;
      button.onclick = () => showCategoryWords(category);

      categoryOptions.appendChild(button);
    });
  } catch (error) {
    categoryOptions.innerHTML = "<p>Unable to load categories.</p>";
    console.error(error);
  }
}

// Category word data
const categoryWords = {
  fruits: ["Apple", "Banana", "Mango", "Orange", "Grapes"],
  animals: ["Dog", "Cat", "Lion", "Elephant", "Tiger"],
  technology: ["Computer", "Keyboard", "Internet", "Software", "Robot"],
};

// Display words from the selected category
function showCategoryWords(category) {
  const results = document.getElementById("categoryResults");

  results.innerHTML = "";

  categoryWords[category].forEach((word) => {
    const item = document.createElement("div");

    item.className = "category-word";
    item.textContent = word;

    results.appendChild(item);
  });
}
function showAddWord() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("addWordScreen").style.display = "block";
}

async function addNewWord() {
  const word = document.getElementById("newWordInput").value.trim();
  const category = document.getElementById("newCategoryInput").value.trim();
  const clue = document.getElementById("newWordClue").value.trim();
  const result = document.getElementById("addWordResult");

  if (word === "" || category === "" || clue === "") {
    result.textContent = "Please enter a word, category and clue!";
    result.style.color = "#ff6b6b";
    return;
  }

  result.textContent = "Adding word...";

  try {
    const response = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, category, clue }),
    });

    const data = await response.json();

    result.textContent = data.message;
    result.style.color = data.success ? "green" : "#ff6b6b";

    if (data.success) {
      document.getElementById("newWordInput").value = "";
      document.getElementById("newCategoryInput").value = "";
      document.getElementById("newWordClue").value = "";
    }
  } catch (error) {
    result.textContent = "Unable to connect to the server!";
    result.style.color = "#ff6b6b";
  }
}

async function showCategories() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("categoriesScreen").style.display = "block";

  const categoryOptions = document.getElementById("categoryOptions");

  categoryOptions.innerHTML = "<p>Loading categories...</p>";

  try {
    const response = await fetch("/api/categories");
    const data = await response.json();

    categoryOptions.innerHTML = "";

    if (data.categories.length === 0) {
      categoryOptions.innerHTML = "<p>No categories found!</p>";
      return;
    }

    data.categories.forEach((category) => {
      const button = document.createElement("button");

      button.textContent = "📖 " + category;
      button.onclick = () => showCategoryWords(category);

      categoryOptions.appendChild(button);
    });
  } catch (error) {
    categoryOptions.innerHTML = "<p>Unable to load categories.</p>";
    console.error(error);
  }
}
async function showCategoryWords(category) {
  const categoryResults = document.getElementById("categoryResults");

  categoryResults.innerHTML = "<p>Loading words...</p>";

  try {
    const response = await fetch("/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category }),
    });

    const data = await response.json();

    if (!response.ok) {
      categoryResults.innerHTML = "<p>Unable to load words.</p>";
      return;
    }

    if (data.words.length === 0) {
      categoryResults.innerHTML = "<p>No words found in this category!</p>";
      return;
    }

    categoryResults.innerHTML = `
            <h3>📚 Words in ${category}</h3>
            <div class="word-list">
                ${data.words.map((word) => `<span class="word-item">${word}</span>`).join("")}
            </div>
        `;
  } catch (error) {
    categoryResults.innerHTML = "<p>Something went wrong!</p>";
    console.error(error);
  }
}
