
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include "trie.h"
#include "category.h"

int main()
{
    struct TrieNode *root = createNode();
    struct CategoryNode *categoryTable[HASH_SIZE];

    initializeCategories(categoryTable);

    // Load the default dictionary

    // Load the default dictionary
    const char *words[] = {
        "apple", "banana", "mango", "orange", "grapes",
        "pineapple", "strawberry", "watermelon", "papaya",
        "kiwi", "peach", "pear", "cherry", "guava", "pomegranate",

        "tiger", "elephant", "rabbit", "dolphin", "penguin", "lion",

        "computer", "keyboard", "internet", "software", "robot", "laptop"};

    const char *categories[] = {
        "Fruits", "Fruits", "Fruits", "Fruits", "Fruits",
        "Fruits", "Fruits", "Fruits", "Fruits", "Fruits",
        "Fruits", "Fruits", "Fruits", "Fruits", "Fruits",

        "Animals", "Animals", "Animals", "Animals", "Animals", "Animals",

        "Technology", "Technology", "Technology",
        "Technology", "Technology", "Technology"};

    int wordCount = sizeof(words) / sizeof(words[0]);

    for (int i = 0; i < wordCount; i++)
    {
        insertWord(root, words[i]);
        addWordToCategory(categoryTable, categories[i], words[i]);
    }

    char command[120];
    char word[50];
    char wordCategory[30];

    printf("BRIDGE_READY\n");
    fflush(stdout);

    // Keep the bridge running and accept commands
    while (fgets(command, sizeof(command), stdin))
    {
        if (sscanf(command, "%19s %49s", wordCategory, word) < 1)
        {
            continue;
        }

        if (strcmp(wordCategory, "SEARCH") == 0)
        {
            if (searchWord(root, word))
                printf("FOUND\n");
            else
                printf("NOT_FOUND\n");
        }
        else if (strcmp(wordCategory, "SUGGEST") == 0)
        {
            suggestWords(root, word);
            printf("SUGGEST_DONE\n");
        }
        else if (strcmp(wordCategory, "CATEGORIES") == 0)
        {
            displayCategories(categoryTable);
            printf("CATEGORY_DONE\n");
        }
        else if (strcmp(wordCategory, "WORDS") == 0)
        {
            displayWordsInCategory(categoryTable, word);
            printf("WORDS_DONE\n");
        }
        else if (strcmp(wordCategory, "ADD") == 0)
        {
            char categoryName[30];

            if (sscanf(command, "%19s %49s %29s",
                       wordCategory, word, categoryName) == 3)
            {
                insertWord(root, word);
                addWordToCategory(categoryTable, categoryName, word);
                printf("ADDED\n");
            }
            else
            {
                printf("INVALID_INPUT\n");
            }
        }
        else if (strcmp(wordCategory, "EXIT") == 0)
        {
            printf("BRIDGE_CLOSED\n");
            fflush(stdout);
            break;
        }
        else
        {
            printf("UNKNOWN_COMMAND\n");
        }

        fflush(stdout);
    }

    return 0;
}
