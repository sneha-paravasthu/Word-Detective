#include <stdio.h>
#include <string.h>
#include "trie.h"
#include "category.h"
#include "game.h"

int main()
{
    int choice;
    char word[50];
    char category[30];

    // Create the root of the Trie
    struct TrieNode *root = createNode();
    struct CategoryNode *categoryTable[HASH_SIZE];
    initializeCategories(categoryTable);

    printf("\n=================================\n");
    printf("         WORD DETECTIVE\n");
    printf("      Smart Word Search System\n");
    printf("=================================\n");

    do
    {
        printf("\n========== MAIN MENU ==========\n");
        printf("1. Add a New Word\n");
        printf("2. Search for a Word\n");
        printf("3. Get Word Suggestions\n");
        printf("4. Guess the Hidden Word\n");
        printf("5. Browse Word Categories\n");
        printf("6. Display All Words\n");
        printf("7. Exit\n");

        printf("\nEnter your choice: ");
        scanf("%d", &choice);

        switch (choice)
        {

        case 1:
            printf("Enter a word to add: ");
            scanf("%49s", word);

            printf("Enter its category: ");
            scanf("%29s", category);

            insertWord(root, word);
            addWordToCategory(categoryTable, category, word);

            break;

        case 2:

            printf("Enter a word to search: ");
            scanf("%49s", word);

            if (searchWord(root, word))
            {
                printf("Word found in the dictionary!\n");
            }
            else
            {
                printf("Word not found!\n");
            }
            break;

        case 3:
            printf("Enter a prefix: ");
            scanf("%49s", word);
            suggestWords(root, word);
            break;

        case 4:
            playGuessingGame();
            break;

        case 5:
            displayCategories(categoryTable);

            printf("\nEnter a category to browse: ");
            scanf("%29s", category);

            displayWordsInCategory(categoryTable, category);

            break;

        case 6:
            printf("\nAll Words in the Dictionary:\n");
            displayAllWords(root);
            break;

        case 7:
            printf("Thank you for playing Word Detective!\n");
            break;

        default:
            printf("Invalid choice! Please try again.\n");
        }

    } while (choice != 7);

    return 0;
}