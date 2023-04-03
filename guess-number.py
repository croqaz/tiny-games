import random

print('Guess the number game!')

secret_number = random.randrange(100)

user_number = int(input('Try a number > '))

while True:
    if secret_number == user_number:
        print('You guessed!! You won!!')
        exit(0)
    elif user_number > secret_number:
        user_number = int(input('Too big! Try again > '))
    elif user_number < secret_number:
        user_number = int(input('Too small! Try again > '))

