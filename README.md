# Overview

This is a classic Tic-Tac-Toe game implemented using HTML, CSS, and JavaScript. The game features a responsive design, animated effects, and a score-tracking system for two players (X and O). Players take turns marking cells on a 3x3 grid, aiming to align three of their symbols horizontally, vertically, or diagonally. The game includes options to start a new round or a new game, resetting the board or the entire score, respectively.

# Features

Interactive Gameplay: Players alternate between X and O, with visual feedback for each move.

Win Detection: Automatically detects winning combinations or ties.

Score Tracking: Keeps track of wins for both players (X and O).

Animations: Smooth animations for cell clicks and winning highlights.

Responsive Design: Adapts to various screen sizes, including mobile devices.

New Game/Round Options: Buttons to reset the board for a new round or reset scores for a new game.

Modern Styling: Uses a sleek, gradient-based design with the Poppins font and glassmorphism effects.

# File Structure

index.html: The main HTML file containing the game structure and layout.

style.css: CSS file for styling the game, including responsive design and animations.

script.js: JavaScript file handling game logic, event listeners, and win detection.

# How to Run

Clone or download the repository to your local machine.
Ensure all files (index.html, style.css, script.js) are in the same directory.
Open index.html in a web browser (e.g., Chrome, Firefox).
Start playing by clicking on the grid cells to place X or O.

# Usage

Gameplay: Click on an empty cell to place your mark (X or O). The game alternates between players and displays the current player's turn.

Winning: The game detects a win when three identical marks align in a row, column, or diagonal. Winning cells are highlighted.

Tie: If all cells are filled without a winner, the game declares a tie.

New Round: Click the "New Round" button to clear the board and start a new round without resetting scores.

New Game: Click the "New Game" button to reset the board and both players' scores.

Responsive Design: The game adjusts layout and font sizes for smaller screens (e.g., tablets, phones).

# Technologies Used

HTML5: For structuring the game interface.

CSS3: For styling, animations, and responsive design (includes media queries and flexbox/grid).

JavaScript: For game logic, event handling, and DOM manipulation.

Google Fonts: Poppins font for a modern look.

External CDN: Includes a Cloudflare script for challenge-platform functionality (optional, depending on hosting).

# Styling Highlights

Background: Gradient background with a dark, futuristic theme.

Glassmorphism: Transparent, blurred containers for the logo, result, and buttons.

Animations: Smooth scaling and fade-in effects for cell marks and hover states.

Responsive Layout: Uses media queries to adapt to screen sizes (768px and 480px breakpoints).

# Future Improvements

Add sound effects for moves, wins, and button clicks.

Implement a single-player mode with AI opponent.

Include a difficulty setting for AI (easy, medium, hard).

Add a theme toggle (e.g., light/dark mode).

Store scores in local storage to persist across sessions.

