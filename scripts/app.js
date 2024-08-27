const GameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (index >= 0 && index < board.length && board[index] === '') {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    }

    return { getBoard, setMark, resetBoard };
})();

const Players = (name, marker) => {

    return { name, marker };
}

const GameController = (() => {

    const resultEl = document.querySelector('.results')

    let player1 = Players('Player 1', "X");
    let player2 = Players('Player 2', 'O');
    let currentPlayer = player1;


    let gameOver = false;

    const switchTurns = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        resultEl.textContent = `${currentPlayer.name}'s turn`
    };

    const updateResults = (message) => {
        resultEl.textContent = `${message}`;
    }

    const playRound = (index) => {
        if (GameBoard.setMark(index, currentPlayer.marker)) {
            if (checkWin(currentPlayer.marker)) {
                updateResults(`${currentPlayer.name} WINS!`);
                gameOver = true;
            } else if (checkTie()) {
                updateResults("It's A TIE!");
                gameOver = true;
            } else {
                switchTurns();
            }
        }
    }

    // code will check if player marker has filled atleast one of combinations
    // below, to determine win. 
    const checkWin = (marker) => {
        const win_combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // row combos
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // column combos
            [0, 4, 8], [2, 4, 6] // diagonal combos
        ];

        // using some function for testing the win
        // MDN Web Docs : The some() method of Array instances 
        // tests whether at least one element in the array passes 
        // the test implemented by the provided function. It returns 
        // true if, in the array, it finds an element for which the 
        // provided function returns true; otherwise it returns false.
        // It doesn't modify the array
        return win_combos.some(combo =>
            combo.every(index => GameBoard.getBoard()[index] === marker)
        )
    }

    const checkTie = () => {
        return GameBoard.getBoard().every(cell => cell !== '');
    }

    const resetGame = () => {
        GameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    }

    return { playRound, resetGame, getCurrentPlayer: () => currentPlayer, updateResults }
})();

const DisplayController = (() => {
    const boardContainer = document.getElementById('container');
    const cells = boardContainer.querySelectorAll('.cell');
    const restartBtn = document.querySelector('button');

    const renderBoard = () => {
        const board = GameBoard.getBoard();

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }

    const eventListeners = () => {
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (!GameController.getCurrentPlayer().gameOver) {
                    GameController.playRound(index);
                    renderBoard();
                }
            })
        })

        restartBtn.addEventListener('click', () => {
            GameController.resetGame();
            GameController.updateResults(`${GameController.getCurrentPlayer().name}'s turn`);
            renderBoard();

        })
    }



    const initialize = () => {
        eventListeners();
        renderBoard();
    }

    return { initialize }

})();

DisplayController.initialize();