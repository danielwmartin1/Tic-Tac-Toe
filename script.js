// script.js

const board = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let gameActive = true;
let flashInterval;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the board
function initBoard() {
  board.innerHTML = '';
  boardState.fill(null);
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = "Player X's turn";
  statusText.style.color = ''; // Reset text color
  statusText.style.fontWeight = ''; // Reset font weight
  statusText.style.backgroundColor = ''; // Reset background color
  statusText.style.visibility = 'visible'; // Reset visibility

  // Clear any ongoing flash interval
  if (flashInterval) {
    clearInterval(flashInterval);
    flashInterval = null;
  }

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

// Handle cell click
function handleCellClick(e) {
  const cellIndex = e.target.dataset.index;

  // If cell is already taken or game is over, do nothing
  if (boardState[cellIndex] || !gameActive) return;

  // Update board state and UI
  boardState[cellIndex] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.style.backgroundColor = currentPlayer === 'X' ? 'green' : 'red';

  // Check for a win or a tie
  if (checkWin()) {
    if (currentPlayer === 'X') {
      statusText.textContent = `Congratulations. You win!`;
    } else {
      statusText.textContent = `You lose! Sorry, try again.`;
    }
    statusText.style.color = currentPlayer === 'X' ? 'green' : 'red';
    statusText.style.fontWeight = 'bold';
    statusText.style.backgroundColor = 'yellow';
    gameActive = false;
    flashText(statusText);
    return;
  } else if (boardState.every(cell => cell)) {
    statusText.textContent = "It's a tie!";
    statusText.style.color = 'blue';
    statusText.style.fontWeight = 'bold';
    statusText.style.backgroundColor = 'yellow';
    gameActive = false;
    flashText(statusText);
    return;
  }

  // Switch to the other player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  // If it's "O"'s turn, make a random move
  if (currentPlayer === 'O') {
    makeRandomMove();
  }
}

// Make a random move for "O"
function makeRandomMove() {
  let availableCells = boardState
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);

  // Choose a random available cell
  if (availableCells.length > 0) {
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const randomCell = document.querySelector(`[data-index='${randomIndex}']`);
    randomCell.click();  // Simulate a click on the chosen cell
  }
}

// Check for a winning combination
function checkWin() {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
  });
}

// Reset the game
resetButton.addEventListener('click', initBoard);

// Initialize the game on page load
initBoard();

// Flash the status text
function flashText(element) {
  let isVisible = true;
  flashInterval = setInterval(() => {
    element.style.visibility = isVisible ? 'hidden' : 'visible';
    isVisible = !isVisible;
  }, 500);

  // Stop flashing after 3 seconds
  setTimeout(() => {
    clearInterval(flashInterval);
    element.style.visibility = 'visible';
  }, 3000);
}
