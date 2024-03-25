const readlineSync = require('readline-sync');

// Game constants
const WIDTH = 20;
const HEIGHT = 10;
const EMPTY_CELL = ' ';
const WALL_CELL = '#';
const SNAKE_CELL = 'O';
const FOOD_CELL = '*';

// Directions
const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

// Initialize game state
let snake = [{ x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) }];
let food = generateFood();
let direction = DIRECTIONS.RIGHT;
let gameOver = false;

// Function to generate random coordinates for food
function generateFood() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT)
  };
}

// Function to draw the game board
function drawBoard() {
  const board = [];
  for (let y = 0; y < HEIGHT; y++) {
    let row = '';
    for (let x = 0; x < WIDTH; x++) {
      if (x === food.x && y === food.y) {
        row += FOOD_CELL;
      } else if (snake.some(segment => segment.x === x && segment.y === y)) {
        row += SNAKE_CELL;
      } else if (x === 0 || x === WIDTH - 1 || y === 0 || y === HEIGHT - 1) {
        row += WALL_CELL;
      } else {
        row += EMPTY_CELL;
      }
    }
    board.push(row);
  }
  console.clear();
  console.log(board.join('\n'));
}

// Function to update the game state
function update() {
  // Move the snake
  let head = { ...snake[0] };
  switch (direction) {
    case DIRECTIONS.UP:
      head.y--;
      break;
    case DIRECTIONS.DOWN:
      head.y++;
      break;
    case DIRECTIONS.LEFT:
      head.x--;
      break;
    case DIRECTIONS.RIGHT:
      head.x++;
      break;
  }

  // Check for collisions with walls
  if (head.x === 0 || head.x === WIDTH - 1 || head.y === 0 || head.y === HEIGHT - 1) {
    gameOver = true;
    return;
  }

  // Check for collisions with the snake itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    return;
  }

  // Move the snake
  snake.unshift(head);

  // Check if the snake eats food
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
  } else {
    snake.pop();
  }
}

// Function to handle user input
function handleInput() {
  const key = readlineSync.keyIn('', { hideEchoBack: true, mask: '' });
  switch (key && key.toLowerCase()) {
    case 'w':
      if (direction !== DIRECTIONS.DOWN)
        direction = DIRECTIONS.UP;
      break;
    case 's':
      if (direction !== DIRECTIONS.UP)
        direction = DIRECTIONS.DOWN;
      break;
    case 'a':
      if (direction !== DIRECTIONS.RIGHT)
        direction = DIRECTIONS.LEFT;
      break;
    case 'd':
      if (direction !== DIRECTIONS.LEFT)
        direction = DIRECTIONS.RIGHT;
      break;
    case 'q':
      gameOver = true;
      break;
  }
}

// Function to display instructions
function displayInstructions() {
  console.log('Welcome to Snake Game!');
  console.log('Use W, A, S, D keys to control the snake.');
  console.log('Collect * to grow. Avoid hitting the walls or yourself.');
  console.log('Press Q to quit at any time.');
  console.log('Press any key to start...');
  readlineSync.keyIn('', { hideEchoBack: true, mask: '' });
}

// Display instructions before starting the game
displayInstructions();

// Main game loop
function gameLoop() {
  drawBoard();
  handleInput();
  update();
  if (!gameOver) {
    setTimeout(gameLoop, 200); // Adjust game speed (milliseconds)
  } else {
    console.log('Game Over!');
  }
}

// Start the game loop
gameLoop();
