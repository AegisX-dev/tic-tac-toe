// Enhanced Tic-Tac-Toe Game with AI and Advanced Features

class TicTacToeGame {
    constructor() {
        this.initializeElements();
        this.initializeGameState();
        this.loadSettings();
        this.bindEvents();
        this.showModeSelection();
    }

    initializeElements() {
        // Mode selection elements
        this.modeSelection = document.getElementById('mode-selection');
        this.mainGame = document.getElementById('main-game');
        this.difficultySelection = document.getElementById('difficulty-selection');
        
        // Game elements
        this.cells = document.querySelectorAll('.cell');
        this.result = document.querySelector('.result');
        this.gameModeDisplay = document.querySelector('.game-mode-display');
        this.winsX = document.querySelector('.wins-x');
        this.winsO = document.querySelector('.wins-o');
        this.ties = document.querySelector('.ties');
        
        // Buttons
        this.pvpModeBtn = document.getElementById('pvp-mode');
        this.pvcModeBtn = document.getElementById('pvc-mode');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.newRoundBtn = document.getElementById('new-round-btn');
        this.backToMenuBtn = document.getElementById('back-to-menu-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        
        // Difficulty buttons
        this.easyBtn = document.getElementById('easy-btn');
        this.mediumBtn = document.getElementById('medium-btn');
        this.hardBtn = document.getElementById('hard-btn');
        this.impossibleBtn = document.getElementById('impossible-btn');
        
        // Theme buttons
        this.themeButtons = document.querySelectorAll('.theme-btn');
        
        // Tournament elements
        this.tournamentButtons = document.querySelectorAll('.tournament-btn');
        this.tournamentStatus = document.getElementById('tournament-status');
        
        // Audio elements
        this.moveSound = document.getElementById('move-sound');
        this.winSound = document.getElementById('win-sound');
    }

    initializeGameState() {
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.board = Array(9).fill('');
        this.gameMode = 'pvp'; // 'pvp' or 'pvc'
        this.difficulty = 'medium';
        this.isPlayerTurn = true;
        this.currentTheme = 'blue';
        this.soundEnabled = true;
        
        // Statistics
        this.stats = {
            xWins: 0,
            oWins: 0,
            ties: 0
        };
        
        // Tournament mode
        this.tournament = {
            active: false,
            target: 0,
            games: 0
        };
        
        // Winning combinations
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        // AI personalities for different difficulties
        this.aiPersonalities = {
            easy: { randomMoveChance: 0.7, lookAhead: 1 },
            medium: { randomMoveChance: 0.3, lookAhead: 2 },
            hard: { randomMoveChance: 0.1, lookAhead: 4 },
            impossible: { randomMoveChance: 0, lookAhead: 9 }
        };
    }

    loadSettings() {
        const savedStats = localStorage.getItem('ticTacToeStats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
        
        const soundEnabled = localStorage.getItem('ticTacToeSounds') !== 'false';
        this.soundEnabled = soundEnabled;
        
        // Update settings button icon
        if (this.settingsBtn) {
            this.settingsBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
            this.settingsBtn.style.opacity = this.soundEnabled ? '1' : '0.5';
        }
        
        const savedTheme = localStorage.getItem('ticTacToeTheme') || 'blue';
        this.setTheme(savedTheme);
    }

    saveSettings() {
        localStorage.setItem('ticTacToeStats', JSON.stringify(this.stats));
        localStorage.setItem('ticTacToeTheme', this.currentTheme || 'blue');
        localStorage.setItem('ticTacToeSounds', (this.soundEnabled !== undefined ? this.soundEnabled : true).toString());
    }

    bindEvents() {
        // Mode selection events
        if (this.pvpModeBtn) {
            this.pvpModeBtn.addEventListener('click', () => this.selectMode('pvp'));
        }
        if (this.pvcModeBtn) {
            this.pvcModeBtn.addEventListener('click', () => this.selectMode('pvc'));
        }
        
        // Difficulty selection events
        if (this.easyBtn) {
            this.easyBtn.addEventListener('click', () => this.selectDifficulty('easy'));
        }
        if (this.mediumBtn) {
            this.mediumBtn.addEventListener('click', () => this.selectDifficulty('medium'));
        }
        if (this.hardBtn) {
            this.hardBtn.addEventListener('click', () => this.selectDifficulty('hard'));
        }
        if (this.impossibleBtn) {
            this.impossibleBtn.addEventListener('click', () => this.selectDifficulty('impossible'));
        }
        
        // Theme selection events
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
            });
        });
        
        // Game control events
        if (this.newRoundBtn) {
            this.newRoundBtn.addEventListener('click', () => this.startNewRound());
        }
        if (this.newGameBtn) {
            this.newGameBtn.addEventListener('click', () => this.startNewGame());
        }
        if (this.backToMenuBtn) {
            this.backToMenuBtn.addEventListener('click', () => this.showModeSelection());
        }
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => this.toggleSound());
        }
        
        // Tournament events - Use event delegation to ensure buttons work
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('tournament-btn')) {
                const target = parseInt(event.target.id.split('-')[2]);
                this.startTournament(target, event.target);
            }
        });
        
        // Cell click events
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
    }

    showModeSelection() {
        this.modeSelection.classList.remove('hidden');
        this.mainGame.classList.add('hidden');
        this.difficultySelection.classList.add('hidden');
    }

    selectMode(mode) {
        this.gameMode = mode;
        if (mode === 'pvc') {
            this.difficultySelection.classList.remove('hidden');
        } else {
            this.startGame();
        }
    }

    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.startGame();
    }

    startGame() {
        this.modeSelection.classList.add('hidden');
        this.mainGame.classList.remove('hidden');
        
        this.gameModeDisplay.textContent = this.gameMode === 'pvp' ? 
            'Player vs Player' : `Player vs Computer (${this.difficulty})`;
        
        this.updateDisplay();
        this.startNewRound();
    }

    startNewRound() {
        this.board = Array(9).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.isPlayerTurn = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('animate-mark', 'highlight', 'pulse');
        });
        
        this.result.textContent = this.gameMode === 'pvc' ? 
            "Your Turn (X)" : "Player X's Turn";
        
        this.updateDisplay();
    }

    startNewGame() {
        this.stats = { xWins: 0, oWins: 0, ties: 0 };
        this.tournament = { active: false, target: 0, games: 0 };
        this.tournamentStatus.classList.add('hidden');
        this.tournamentButtons.forEach(btn => btn.classList.remove('active'));
        this.startNewRound();
        this.saveSettings();
    }

    startTournament(target, buttonElement) {
        this.tournament = { active: true, target, games: 0 };
        
        // Remove active class from all tournament buttons
        document.querySelectorAll('.tournament-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        this.updateTournamentStatus();
        this.startNewGame();
    }

    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) return;
        
        if (this.gameMode === 'pvc' && !this.isPlayerTurn) return;
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameMode === 'pvc' && this.gameActive) {
            this.isPlayerTurn = false;
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add('animate-mark');
        
        this.playSound('move');
        
        setTimeout(() => {
            this.cells[index].classList.remove('animate-mark');
        }, 400);
        
        const winner = this.checkWinner();
        if (winner) {
            this.handleGameEnd(winner);
        } else if (this.board.every(cell => cell !== '')) {
            this.handleGameEnd('tie');
        } else {
            this.switchPlayer();
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;
        
        const move = this.getAIMove();
        this.makeMove(move, this.currentPlayer);
        this.isPlayerTurn = true;
    }

    getAIMove() {
        const personality = this.aiPersonalities[this.difficulty];
        
        // Random move chance for easier difficulties
        if (Math.random() < personality.randomMoveChance) {
            const availableMoves = this.board
                .map((cell, index) => cell === '' ? index : null)
                .filter(val => val !== null);
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        
        // Strategic AI using minimax algorithm
        return this.getBestMove(personality.lookAhead);
    }

    getBestMove(depth) {
        let bestScore = -Infinity;
        let bestMove = 0;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                const score = this.minimax(this.board, depth, false, -Infinity, Infinity);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }

    minimax(board, depth, isMaximizing, alpha, beta) {
        const winner = this.checkWinnerForBoard(board);
        
        if (winner === 'O') return 10;
        if (winner === 'X') return -10;
        if (board.every(cell => cell !== '') || depth === 0) return 0;
        
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const evaluation = this.minimax(board, depth - 1, false, alpha, beta);
                    board[i] = '';
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    if (beta <= alpha) break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const evaluation = this.minimax(board, depth - 1, true, alpha, beta);
                    board[i] = '';
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    if (beta <= alpha) break;
                }
            }
            return minEval;
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        if (this.gameMode === 'pvp') {
            this.result.textContent = `Player ${this.currentPlayer}'s Turn`;
        } else {
            this.result.textContent = this.currentPlayer === 'X' ? 
                "Your Turn (X)" : "Computer's Turn (O)";
        }
    }

    checkWinner() {
        return this.checkWinnerForBoard(this.board);
    }

    checkWinnerForBoard(board) {
        for (const combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'tie') {
            this.result.textContent = "It's a Tie!";
            this.stats.ties++;
            this.cells.forEach(cell => cell.classList.add('pulse'));
        } else {
            const winningCombo = this.getWinningCombo();
            this.highlightWinningCombo(winningCombo);
            
            if (this.gameMode === 'pvp') {
                this.result.textContent = `Player ${result} Wins!`;
            } else {
                this.result.textContent = result === 'X' ? 'You Win!' : 'Computer Wins!';
            }
            
            if (result === 'X') {
                this.stats.xWins++;
            } else {
                this.stats.oWins++;
            }
            
            this.playSound('win');
        }
        
        this.updateDisplay();
        this.checkTournamentEnd();
        this.saveSettings();
        
        // Auto-start new round in tournament mode
        if (this.tournament.active) {
            setTimeout(() => this.startNewRound(), 2000);
        }
    }

    getWinningCombo() {
        for (const combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return combo;
            }
        }
        return null;
    }

    highlightWinningCombo(combo) {
        combo.forEach(index => {
            this.cells[index].classList.add('highlight');
        });
    }

    updateDisplay() {
        this.winsX.textContent = `Player X: ${this.stats.xWins}`;
        this.winsO.textContent = `Player O: ${this.stats.oWins}`;
        this.ties.textContent = `Ties: ${this.stats.ties}`;
        
        if (this.tournament.active) {
            this.updateTournamentStatus();
        }
    }

    updateTournamentStatus() {
        if (!this.tournament.active) return;
        
        const xScore = this.stats.xWins;
        const oScore = this.stats.oWins;
        const target = Math.ceil(this.tournament.target / 2);
        
        this.tournamentStatus.classList.remove('hidden');
        
        if (xScore >= target) {
            this.tournamentStatus.textContent = `🏆 Player X Wins Tournament! (${xScore}-${oScore})`;
            this.tournament.active = false;
        } else if (oScore >= target) {
            this.tournamentStatus.textContent = `🏆 Player O Wins Tournament! (${oScore}-${xScore})`;
            this.tournament.active = false;
        } else {
            this.tournamentStatus.textContent = `Tournament: ${xScore}-${oScore} (First to ${target})`;
        }
    }

    checkTournamentEnd() {
        if (!this.tournament.active) return;
        
        const target = Math.ceil(this.tournament.target / 2);
        if (this.stats.xWins >= target || this.stats.oWins >= target) {
            this.tournament.active = false;
            this.tournamentButtons.forEach(btn => btn.classList.remove('active'));
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        this.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        this.saveSettings();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.settingsBtn) {
            this.settingsBtn.style.opacity = this.soundEnabled ? '1' : '0.5';
            this.settingsBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
        }
        this.saveSettings();
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            if (type === 'move' && this.moveSound) {
                this.moveSound.currentTime = 0;
                this.moveSound.play().catch(() => {});
            } else if (type === 'win' && this.winSound) {
                this.winSound.currentTime = 0;
                this.winSound.play().catch(() => {});
            }
        } catch (error) {
            // Silently handle audio errors
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.ctrlKey) {
        document.body.style.filter = document.body.style.filter === 'hue-rotate(180deg)' ? 
            '' : 'hue-rotate(180deg)';
    }
});
