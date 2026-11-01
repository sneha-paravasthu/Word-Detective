#include <stdio.h>
#include <string.h>
#include "game.h"
#include <stdlib.h>
#include <time.h>

const char *words[] = {"apple", "banana", "mango", "orange", "grapes"};

const char *clues[] = {
    "I am a red or green fruit.",
    "I am a long yellow fruit.",
    "I am known as the king of fruits.",
    "I am a citrus fruit.",
    "I grow in bunches."};

void playGuessingGame()
{

    char answer[50];
    int score = 0;
    int attempts = 3;
    srand(time(NULL));

    int randomIndex = rand() % 5;

    const char *hiddenWord = words[randomIndex];
    const char *hiddenClue = clues[randomIndex];

    printf("\n=================================\n");
    printf("       GUESS THE HIDDEN WORD\n");
    printf("You have 3 attempts to guess the word.\n");
    printf("=================================\n");

    printf("\nClue: %s\n", hiddenClue);

    while (attempts > 0)
    {

        printf("\nEnter your guess: ");
        scanf("%49s", answer);

        if (strcmp(answer, hiddenWord) == 0 ||
            strcmp(answer, "Apple") == 0)
        {

            score += 10;

            printf("\nCorrect! You guessed the word!\n");
            printf("You earned 10 points!\n");

            break;
        }

        else
        {
            attempts--;

            if (attempts > 0)
            {
                printf("Wrong guess! Try again.\n");
                printf("Attempts remaining: %d\n", attempts);
            }
            else
            {
                printf("\nGame Over!\n");
                printf("The hidden word was %s.\n", hiddenWord);
            }
        }
    }
    printf("\nYour final score: %d\n", score);
}