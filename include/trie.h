#ifndef TRIE_H
#define TRIE_H

#define ALPHABET_SIZE 26

// Structure of a Trie node
struct TrieNode
{
    struct TrieNode *children[ALPHABET_SIZE];
    int isEndOfWord;
};

// Function declarations
struct TrieNode *createNode();

void insertWord(struct TrieNode *root, const char *word);

int searchWord(struct TrieNode *root, const char *word);

void suggestWords(struct TrieNode *root, const char *prefix);

void displayAllWords(struct TrieNode *root);

#endif