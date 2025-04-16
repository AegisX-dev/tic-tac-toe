// Select DOM elements
const cells = document.querySelectorAll('.cell'); // All game cells
const result = document.querySelector('.result'); // Result display (who's turn or winner)
const winsX = document.querySelector('.wins-x'); // Display for Player X's wins
const winsO = document.querySelector('.wins-o'); // Display for Player O's wins
const newGameBtn = document.querySelector('#new-game-btn'); // New Game button
const newRoundBtn = document.querySelector('#new-round-btn'); // New Round button

// Game state variables
let currentPlayer = 'X'; // Tracks current player (X or O)
let gameActive = true; // Determines if the game is active
let board = ['', '', '', '', '', '', '', '', '']; // Board state (empty initially)
let xWins = 0; // Track Player X's total wins
let oWins = 0; // Track Player O's total wins

// Winning combinations (indexes of cells that form a win)
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle cell click events
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index'); // Get index of clicked cell
        if (board[index] !== '' || !gameActive) return; // Prevent overwriting or clicking after game ends

        board[index] = currentPlayer; // Mark cell in board array
        cell.textContent = currentPlayer; // Display player mark (X or O)
        cell.classList.add('animate-mark'); // Apply animation

        setTimeout(() => {
            cell.classList.remove('animate-mark'); // Remove animation effect after 300ms
        }, 300);

        const winner = checkWinner(); // Check if there's a winner
        if (winner) {
            result.textContent = `Player ${currentPlayer} Wins!`;
            updateWins(); // Update win counter
            highlightWinningCombo(winner); // Highlight winning cells
            gameActive = false; // End game
        } else if (board.every(cell => cell !== '')) { // If board is full with no winner
            result.textContent = "It's a Tie!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player turn
            result.textContent = `Player ${currentPlayer}'s Turn`;
        }
    });
});

// Function to check for a winner
function checkWinner() {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combo; // Return winning combination if found
        }
    }
    return null; // No winner
}

// Function to highlight the winning cells
function highlightWinningCombo(combo) {
    combo.forEach(index => {
        cells[index].classList.add('highlight'); // Add highlight effect to winning cells
    });
}

// Function to update win counters
function updateWins() {
    if (currentPlayer === 'X') {
        xWins++;
        winsX.textContent = `Player X Wins: ${xWins}`;
    } else {
        oWins++;
        winsO.textContent = `Player O Wins: ${oWins}`;
    }
}

// Function to reset board for a new round
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', '']; // Clear board array
    gameActive = true; // Reactivate game
    currentPlayer = 'X'; // Reset to Player X's turn
    result.textContent = `Player ${currentPlayer}'s Turn`; // Update result display
    cells.forEach(cell => {
        cell.textContent = ''; // Clear cell text
        cell.classList.remove('animate-mark', 'highlight'); // Remove animations and highlights
    });
}

// Event listener for New Round button (resets board only)
newRoundBtn.addEventListener('click', resetBoard);

// Event listener for New Game button (resets board and win counters)
newGameBtn.addEventListener('click', () => {
    resetBoard();
    xWins = 0;
    oWins = 0;
    winsX.textContent = `Player X Wins: ${xWins}`;
    winsO.textContent = `Player O Wins: ${oWins}`;
});
