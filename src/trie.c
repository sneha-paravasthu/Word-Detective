#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include "trie.h"

// Create a new Trie node
struct TrieNode *createNode()
{
    struct TrieNode *node =
        (struct TrieNode *)malloc(sizeof(struct TrieNode));

    if (node == NULL)
    {
        printf("Memory allocation failed!\n");
        exit(1);
    }

    node->isEndOfWord = 0;

    for (int i = 0; i < ALPHABET_SIZE; i++)
    {
        node->children[i] = NULL;
    }

    return node;
}

// Insert a word into the Trie
void insertWord(struct TrieNode *root, const char *word)
{
    struct TrieNode *current = root;

    for (int i = 0; word[i] != '\0'; i++)
    {
        char ch = tolower((unsigned char)word[i]);

        if (ch < 'a' || ch > 'z')
        {
            continue;
        }

        int index = ch - 'a';

        if (current->children[index] == NULL)
        {
            current->children[index] = createNode();
        }

        current = current->children[index];
    }

    current->isEndOfWord = 1;
}

// Search for a word in the Trie
int searchWord(struct TrieNode *root, const char *word)
{
    struct TrieNode *current = root;

    for (int i = 0; word[i] != '\0'; i++)
    {
        char ch = tolower((unsigned char)word[i]);

        if (ch < 'a' || ch > 'z')
        {
            continue;
        }

        int index = ch - 'a';

        if (current->children[index] == NULL)
        {
            return 0;
        }

        current = current->children[index];
    }

    return current->isEndOfWord;
}
// Display all words starting with a given prefix
void displaySuggestions(struct TrieNode *root, char *buffer, int depth)
{

    if (root->isEndOfWord)
    {
        buffer[depth] = '\0';
        printf("%s\n", buffer);
    }

    for (int i = 0; i < ALPHABET_SIZE; i++)
    {

        if (root->children[i] != NULL)
        {

            buffer[depth] = 'a' + i;

            displaySuggestions(root->children[i], buffer, depth + 1);
        }
    }
}

// Find words matching the given prefix
void suggestWords(struct TrieNode *root, const char *prefix)
{

    struct TrieNode *current = root;

    for (int i = 0; prefix[i] != '\0'; i++)
    {

        char ch = tolower((unsigned char)prefix[i]);

        if (ch < 'a' || ch > 'z')
        {
            printf("Invalid prefix!\n");
            return;
        }

        int index = ch - 'a';

        if (current->children[index] == NULL)
        {
            printf("No suggestions found!\n");
            return;
        }

        current = current->children[index];
    }

    char buffer[100];

    strcpy(buffer, prefix);

    printf("\nWord Suggestions:\n");

    displaySuggestions(current, buffer, strlen(prefix));
}
void displayAllWordsHelper(struct TrieNode *root, char word[], int level)
{
    if (root->isEndOfWord)
    {
        word[level] = '\0';
        printf("%s\n", word);
    }

    for (int i = 0; i < ALPHABET_SIZE; i++)
    {
        if (root->children[i] != NULL)
        {
            word[level] = 'a' + i;
            displayAllWordsHelper(root->children[i], word, level + 1);
        }
    }
}

void displayAllWords(struct TrieNode *root)
{
    char word[100];
    displayAllWordsHelper(root, word, 0);
}