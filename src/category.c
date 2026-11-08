#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "category.h"

// Calculate the hash value for a category
unsigned int hashFunction(const char *category)
{
    unsigned int hash = 0;

    for (int i = 0; category[i] != '\0'; i++)
    {
        hash = (hash * 31 + tolower((unsigned char)category[i])) % HASH_SIZE;
    }

    return hash;
}

// Initialize all Hash Table positions
void initializeCategories(struct CategoryNode *table[])
{
    for (int i = 0; i < HASH_SIZE; i++)
    {
        table[i] = NULL;
    }
}

// Add a word to a category
void addWordToCategory(
    struct CategoryNode *table[],
    const char *category,
    const char *word)
{
    unsigned int index = hashFunction(category);

    struct CategoryNode *newNode =
        (struct CategoryNode *)malloc(sizeof(struct CategoryNode));

    if (newNode == NULL)
    {
        printf("Memory allocation failed!\n");
        return;
    }

    strcpy(newNode->category, category);
    strcpy(newNode->word, word);

    newNode->next = table[index];
    table[index] = newNode;
}

// Display all available categories
void displayCategories(struct CategoryNode *table[])
{
    printf("\nAvailable Categories:\n");

    int found = 0;

    for (int i = 0; i < HASH_SIZE; i++)
    {
        struct CategoryNode *current = table[i];

        while (current != NULL)
        {
            int alreadyDisplayed = 0;

            for (int j = 0; j < i; j++)
            {
                struct CategoryNode *previous = table[j];

                while (previous != NULL)
                {
                    if (strcmp(previous->category, current->category) == 0)
                    {
                        alreadyDisplayed = 1;
                    }
                    previous = previous->next;
                }
            }

            struct CategoryNode *previous = table[i];

            while (previous != current)
            {
                if (strcmp(previous->category, current->category) == 0)
                {
                    alreadyDisplayed = 1;
                }
                previous = previous->next;
            }

            if (!alreadyDisplayed)
            {
                printf("- %s\n", current->category);
                found = 1;
            }

            current = current->next;
        }
    }

    if (!found)
    {
        printf("No categories available!\n");
    }
}

// Display words belonging to a particular category
void displayWordsInCategory(
    struct CategoryNode *table[],
    const char *category)
{
    unsigned int index = hashFunction(category);

    struct CategoryNode *current = table[index];

    int found = 0;

    printf("\nWords in %s:\n", category);

    while (current != NULL)
    {
        if (strcmp(current->category, category) == 0)
        {
            printf("- %s\n", current->word);
            found = 1;
        }

        current = current->next;
    }

    if (!found)
    {
        printf("No words found in this category!\n");
    }
}