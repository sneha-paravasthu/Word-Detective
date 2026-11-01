console.log("Word Detective is ready!");
function startGame() {
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
  {
    word: "apple",
    clue: "I am a red or green fruit.",
  },
  {
    word: "banana",
    clue: "I am a long yellow fruit.",
  },
  {
    word: "mango",
    clue: "I am known as the king of fruits.",
  },
  {
    word: "orange",
    clue: "I am a citrus fruit.",
  },
  {
    word: "grapes",
    clue: "I grow in bunches.",
  },
];

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

  if (answer === "") {
    result.textContent = "⚠️ Please enter your guess!";
    result.style.color = "#ff6b6b";
    return;
  }

  if (answer === currentWord) {
    score += 10;

    result.textContent = "🎉 Excellent! You guessed correctly! +10 points!";
    result.style.color = "green";

    document.getElementById("score").textContent = score;

    document.getElementById("guessInput").disabled = true;
  } else {
    attemptsLeft--;

    document.getElementById("attempts").textContent = attemptsLeft;

    if (attemptsLeft > 0) {
      result.textContent =
        "❌ Not quite! Try again. " + attemptsLeft + " attempts left.";
      result.style.color = "#ff6b6b";
    } else {
      result.textContent = "😢 Game over! The word was " + currentWord + ".";
      result.style.color = "#ff6b6b";

      document.getElementById("guessInput").disabled = true;
    }
  }
}
// Open the Categories screen
function showCategories() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("categoriesScreen").style.display = "block";
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
  const result = document.getElementById("addWordResult");

  if (word === "" || category === "") {
    result.textContent = "Please enter both a word and category!";
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
      body: JSON.stringify({ word, category }),
    });

    const data = await response.json();

    result.textContent = data.message;
    result.style.color = data.success ? "green" : "#ff6b6b";

    if (data.success) {
      document.getElementById("newWordInput").value = "";
      document.getElementById("newCategoryInput").value = "";
    }
  } catch (error) {
    result.textContent = "Unable to connect to the server!";
    result.style.color = "#ff6b6b";
  }
}
