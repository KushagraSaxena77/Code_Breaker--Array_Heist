# Code Breaker: The Array Heist

An interactive web based game designed for educational pov to test understanding of array manipulations. Players take on the role of a hacker trying to break into a secure system by manipulating a digital code array to find a hidden password pattern before time runs out.


<img width="1708" height="943" alt="image" src="https://github.com/user-attachments/assets/a7c94b07-b247-4bdd-a8b7-7fa4a461176c" />

<img width="1710" height="947" alt="image" src="https://github.com/user-attachments/assets/b11c052c-1cd3-4606-be86-792b492944ed" />


-----

## Features

  - **Visual Array Display**: An interactive, real time representation of the numeric array with a fixed size of 10 cells.
  - **Core Array Operations**:
      - **Insert**: Add a number (0-9) at a specific index, shifting subsequent elements to the right.
      - **Delete**: Remove a number at a specific index, shifting subsequent elements to the left.
      - **Reset**: Clear the array and start a new game session.
  - **Pattern Matching**: A linear search algorithm to find a user defined subarray (ex- 2,1,4) within the main array.
  - **Dynamic Animations**: Smooth CSS animations for all operations (insert, delete, search) provide clear visual feedback on the manipulation of the array structure.
  - **Real time Feedback System**: Instant messages inform the user about successful operations, input errors, and the current game status.
  - **Time Attack Mode**: A 60 second timer adds a layer of urgency and challenge, requiring players to think and act quickly.
  - **Auto Generated Puzzles**: A new secret 3 digit pattern is randomly generated for every game, ensuring replayability.
  - **Audio Feedback**: Simple sound effects generated via the Web Audio API provide auditory cues for key actions like insertion, errors, and winning the game.

-----

## Tech Stack

  - **HTML5**: For the core structure and content of the game.
  - **CSS3**: For styling, layout, and all animations.
  - **JavaScript (ES6+)**: For all game logic, DOM manipulation, and event handling.

-----

## Getting Started

To run this project locally, follow these simple steps.

### Prerequisites

You will need a modern web browser that supports HTML5, CSS3, and JavaScript.

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/KushagraSaxena77/Code_Breaker--Array_Heis.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Code_Breaker--Array_Heis
    ```
3.  Open the `index.html` file in your web browser. No web server is required as this is a fully client side application.

-----

## How to Play

  - When the game loads, a secret 3 digit pattern is generated. Your goal is to create this pattern within the array.
  - Your first action (Insert, Delete, or Search) will start the 60 second timer.
  - Use the **Insert** panel to add numbers (0-9) at a specific index in the array. The array has a maximum capacity of 10 elements.
  - Use the **Delete** panel to remove a number from a specific index.
  - Once you believe the array contains the secret pattern, enter it in the **Search for Pattern** input field, using commas to separate the numbers (e.g., `3,7,1`).
  - Click the **Search** button. The game will animate the search process, highlighting each segment it checks.
  - If the correct pattern is found, you win the game. The time taken will be displayed.
  - If the timer runs out before you find the code, the game ends.
  - Click the **Reset Game** button at any time to start over with a new pattern and a fresh timer.

-----

## File Structure

The project is organized into three main files:

```
/
├── index.html      # The main HTML file containing the game's structure.
├── style.css       # The CSS file for all styling, layout, and animations.
└── script.js       # The JavaScript file containing all game logic and interactivity.
```

-----

## Author

Kushagra Saxena
