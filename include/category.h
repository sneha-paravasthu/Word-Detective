#ifndef CATEGORY_H
#define CATEGORY_H

#define HASH_SIZE 10

// Structure for storing words and their categories
struct CategoryNode {
    char category[30];
    char word[50];

    struct CategoryNode *next;
};

// Function declarations
unsigned int hashFunction(const char *category);

void initializeCategories(struct CategoryNode *table[]);

void addWordToCategory(
    struct CategoryNode *table[],
    const char *category,
    const char *word
);

void displayCategories(struct CategoryNode *table[]);

void displayWordsInCategory(
    struct CategoryNode *table[],
    const char *category
);

#endif