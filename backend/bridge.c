
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
    const char *words[] = {
        "apple", "banana", "mango", "orange", "grapes"};

    const char *category = "Fruits";

    for (int i = 0; i < 5; i++)
    {
        insertWord(root, words[i]);
        addWordToCategory(categoryTable, category, words[i]);
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
