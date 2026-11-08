const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const readline = require("readline");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "web")));

// Start the C bridge
const bridge = spawn(path.join(__dirname, "backend", "bridge.exe"));

const rl = readline.createInterface({
  input: bridge.stdout,
});

let bridgeReady = false;
let pendingRequest = null;
let commandQueue = Promise.resolve();

const readyPromise = new Promise((resolve, reject) => {
  bridge.once("error", reject);

  rl.on("line", (line) => {
    if (!bridgeReady) {
      if (line === "BRIDGE_READY") {
        bridgeReady = true;
        console.log("C bridge connected successfully!");
        resolve();
      }
      return;
    }

    if (pendingRequest) {
      if (pendingRequest.type === "single") {
        // Resolve single-line responses immediately
        const finish = pendingRequest.resolve;
        pendingRequest = null;
        finish(line.trim());
      } else {
        // Handle multi-line responses
        const doneMarkers = {
          suggest: "SUGGEST_DONE",
          categories: "CATEGORY_DONE",
          words: "WORDS_DONE",
        };

        if (line === doneMarkers[pendingRequest.type]) {
          const finish = pendingRequest.resolve;
          const results = pendingRequest.lines;
          pendingRequest = null;
          finish(results);
        } else {
          const cleanedLine = line.trim();

          if (
            cleanedLine !== "" &&
            !cleanedLine.endsWith(":") &&
            cleanedLine !== "No suggestions found!" &&
            cleanedLine !== "Invalid prefix!" &&
            cleanedLine !== "No categories available!" &&
            cleanedLine !== "No words found in this category!"
          ) {
            pendingRequest.lines.push(cleanedLine.replace(/^\-\s*/, ""));
          }
        }
      }
    }
  });
});

bridge.stderr.on("data", (data) => {
  console.error("C bridge:", data.toString());
});

bridge.on("exit", (code) => {
  console.log("C bridge exited with code:", code);
});

function sendToBridge(command, type = "single") {
  const task = commandQueue.then(async () => {
    await readyPromise;

    return new Promise((resolve, reject) => {
      pendingRequest = {
        resolve,
        reject,
        type,
        lines: [],
      };

      bridge.stdin.write(command + "\n", (error) => {
        if (error) {
          pendingRequest = null;
          reject(error);
        }
      });
    });
  });

  commandQueue = task.catch(() => {});
  return task;
}

// Search for a word using the C Trie
app.post("/api/search", async (req, res) => {
  const word = req.body.word;

  if (typeof word !== "string" || !/^[a-zA-Z]+$/.test(word)) {
    return res.status(400).json({
      message: "Please enter a valid word.",
    });
  }

  try {
    const result = await sendToBridge(`SEARCH ${word}`);

    res.json({
      found: result === "FOUND",
      message:
        result === "FOUND"
          ? "Word found in the C dictionary!"
          : "Word not found!",
    });
  } catch (error) {
    res.status(500).json({ message: "Backend error." });
  }
});

// Get word suggestions from the C Trie
app.post("/api/suggest", async (req, res) => {
  const prefix = req.body.prefix;

  if (typeof prefix !== "string" || !/^[a-zA-Z]+$/.test(prefix)) {
    return res.status(400).json({
      suggestions: [],
      message: "Please enter a valid prefix.",
    });
  }

  try {
    const suggestions = await sendToBridge(`SUGGEST ${prefix}`, "suggest");

    res.json({
      suggestions: suggestions,
      message:
        suggestions.length > 0
          ? "Suggestions found!"
          : "No matching words found.",
    });
  } catch (error) {
    res.status(500).json({
      suggestions: [],
      message: "Backend error.",
    });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await sendToBridge("CATEGORIES", "categories");

    res.json({
      categories: categories,
      message: "Categories retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      categories: [],
      message: "Backend error.",
    });
  }
});

app.post("/api/words", async (req, res) => {
  const category = req.body.category;

  if (typeof category !== "string" || !/^[a-zA-Z ]+$/.test(category)) {
    return res.status(400).json({
      words: [],
      message: "Please enter a valid category.",
    });
  }

  try {
    const words = await sendToBridge(`WORDS ${category}`, "words");

    res.json({
      words: words,
      message: "Words retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      words: [],
      message: "Backend error.",
    });
  }
});

// Add a word using the C Trie and Hash Table

app.post("/api/add", async (req, res) => {
  const { word, category, clue } = req.body;

  if (
    typeof word !== "string" ||
    typeof category !== "string" ||
    typeof clue !== "string" ||
    !/^[a-zA-Z]+$/.test(word) ||
    !/^[a-zA-Z]+$/.test(category) ||
    clue.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid word, category and clue.",
    });
  }

  try {
    const result = await sendToBridge(`ADD ${word} ${category}`);
    console.log("C bridge ADD response:", result);
    if (result !== "ADDED") {
      return res.json({
        success: false,
        message: "Unable to add word.",
      });
    }

    const filePath = path.join(__dirname, "data", "customWords.json");

    const customWords = JSON.parse(fs.readFileSync(filePath, "utf8"));

    customWords.push({
      word: word.toLowerCase(),
      category: category,
      clue: clue.trim(),
    });

    fs.writeFileSync(filePath, JSON.stringify(customWords, null, 2));

    res.json({
      success: true,
      message: "Word and clue saved successfully! 🎉",
    });
  } catch (error) {
    console.error("Error saving custom word:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save the word and clue.",
    });
  }
});

app.get("/api/custom-words", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "customWords.json");

    const customWords = JSON.parse(fs.readFileSync(filePath, "utf8"));

    res.json({
      success: true,
      words: customWords,
    });
  } catch (error) {
    console.error("Error loading custom words:", error);

    res.status(500).json({
      success: false,
      words: [],
    });
  }
});
// Start the Node.js server
app.listen(PORT, () => {
  console.log(`Word Detective server: http://localhost:${PORT}`);
});
