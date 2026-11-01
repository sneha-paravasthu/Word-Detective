# Word Detective – Smart Word Search

## About the Project

Word Detective is a menu-driven word search application developed using the C programming language. It uses data structures and algorithms to provide efficient word searching, autocomplete suggestions, category management, and an interactive word guessing game.

The project demonstrates how Trie and Hash Table data structures can be used to organize and retrieve words efficiently.

## Technologies Used

- Programming Language: C
- Data Structures: Trie and Hash Table
- Compiler: GCC
- IDE: Visual Studio Code
- Version Control: Git and GitHub

## Features

1. **Add a New Word** – Add words to the dictionary along with their categories.
2. **Search for a Word** – Quickly check whether a word exists in the dictionary using a Trie.
3. **Autocomplete Suggestions** – Get word suggestions based on the entered prefix.
4. **Guess the Hidden Word** – Play an interactive guessing game with clues, three attempts, and a scoring system.
5. **Browse Word Categories** – Organize and explore words using a Hash Table.
6. **Display All Words** – Display all words stored in the Trie.

## Data Structures Used

### 1. Trie

A Trie is a tree-based data structure used to store and search words efficiently. It supports word searching, prefix matching, and autocomplete suggestions.

### 2. Hash Table

A Hash Table is used to organize words into categories. It uses a hash function to determine where category entries are stored.

## Project Structure

```text
Word-Detective/
│
├── src/
│   ├── main.c
│   ├── trie.c
│   ├── category.c
│   └── game.c
│
├── include/
│   ├── trie.h
│   ├── category.h
│   └── game.h
│
├── .gitignore
└── README.md
```

## Installation and Execution

### Prerequisites

- GCC compiler
- Git
- Visual Studio Code (recommended)

### Clone the Repository

```bash
git clone https://github.com/sneha-paravasthu/Word-Detective.git
```

### Navigate to the Project Folder

```bash
cd Word-Detective
```

### Compile the Project

Run this command from the project root directory:

```bash
gcc src/main.c src/trie.c src/category.c src/game.c -Iinclude -o WordDetective
```

### Run the Application

**Windows PowerShell:**

```powershell
.\WordDetective.exe
```

**Linux/macOS:**

```bash
./WordDetective
```

## Future Enhancements

- Store dictionary words permanently using file handling.
- Improve case-insensitive word searching.
- Add more categories and vocabulary.
- Improve input validation and memory management.
- Add difficulty levels to the guessing game.

## Author

**Sneha Paravasthu**

GitHub: [sneha-paravasthu](https://github.com/sneha-paravasthu)
