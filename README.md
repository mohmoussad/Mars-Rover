# Mars Rover
Simple web app allows you to control a rover on a grid-based map. The rover can move forward, backward, rotate left, and rotate right based on the string commands you provide.

## Getting Started

1. Clone this repository to your local machine:
    ```
    git clone https://github.com/mohmoussad/Mars-Rover
    ```

2. Navigate to the project directory:
    ```
    cd Mars-Rover
    ```

3. Open the ``index.html`` file in your web browser to launch the app.

## Features
- **Map Building**: You can specify the size of the grid-based map by entering a scale size between 4 and 10.

- **Rover Initialization**: The rover initial location is generated randomly.

- **Rover Control**: You can control the rover by entering a sequence of commands, such as "F" (forward), "B" (backward), "L" (rotate left), and "R" (rotate right).

- **Real-time Status**: The app displays the rover's current location (X and Y coordinates) and direction in real-time.


- **Rover Respawn**: You can reset the rover to the (0,0) position by clicking the "Respawn" button.


## Command Input
The input field only accepts the following commands:

- "F" or "f" for forward movement.
- "B" or "b" for backward movement.
- "L" or "l" for left rotation.
- "R" or "r" for right rotation.
