const express = require("express");
const path = require("path");
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
      if (pendingRequest.type === "suggest") {
        if (line === "SUGGEST_DONE") {
          const finish = pendingRequest.resolve;
          const suggestions = pendingRequest.lines;
          pendingRequest = null;
          finish(suggestions);
        } else if (
          line !== "Word Suggestions:" &&
          line !== "No suggestions found!" &&
          line !== "Invalid prefix!"
        ) {
          if (line.trim() !== "") {
            pendingRequest.lines.push(line.trim());
          }
        }
      } else {
        const validResponses = [
          "FOUND",
          "NOT_FOUND",
          "ADDED",
          "INVALID_INPUT",
          "UNKNOWN_COMMAND",
        ];

        if (validResponses.includes(line)) {
          const finish = pendingRequest.resolve;
          pendingRequest = null;
          finish(line);
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

// Add a word using the C Trie and Hash Table
app.post("/api/add", async (req, res) => {
  const { word, category } = req.body;

  if (
    typeof word !== "string" ||
    typeof category !== "string" ||
    !/^[a-zA-Z]+$/.test(word) ||
    !/^[a-zA-Z]+$/.test(category)
  ) {
    return res.status(400).json({
      message: "Enter a valid word and category.",
    });
  }

  try {
    const result = await sendToBridge(`ADD ${word} ${category}`);

    res.json({
      success: result === "ADDED",
      message:
        result === "ADDED" ? "Word added successfully!" : "Unable to add word.",
    });
  } catch (error) {
    res.status(500).json({ message: "Backend error." });
  }
});

// Start the Node.js server
app.listen(PORT, () => {
  console.log(`Word Detective server: http://localhost:${PORT}`);
});
