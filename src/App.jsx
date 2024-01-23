import { useState } from "react";
import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const PLAYERS = {
    X: "Player 1",
    O: "Player 2",
};

const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

function deriveActivePlayer(gameTurns) {
    let currentPlayer = "X";
    if (gameTurns.length > 0 && gameTurns[0].player === "X") {
      currentPlayer = "O";
    }

    return currentPlayer;
}

function deriveWinner(gameBoard, players) {
    let winner = null;

    for (const combination of WINNING_COMBINATIONS) {
        const [firstSquare, secondSquare, thirdSquare] = combination;

        const firstSquareValue = gameBoard[firstSquare.row][firstSquare.column];
        const secondSquareValue = gameBoard[secondSquare.row][secondSquare.column];
        const thirdSquareValue = gameBoard[thirdSquare.row][thirdSquare.column];

        if (firstSquareValue && 
            firstSquareValue === secondSquareValue && 
            firstSquareValue === thirdSquareValue) {
            winner = players[firstSquareValue];
        }
    }

    return winner;
}

function deriveGameBoard(gameTurns) {
    let gameBoard = [...INITIAL_GAME_BOARD.map(innerArray => [...innerArray])];

    gameTurns.forEach(turn => {
        const { square, player } = turn;
        const { row, col } = square;
        gameBoard[row][col] = player;
    });

    return gameBoard;
}

function App() {
    const [players, setPlayers] = useState(PLAYERS);
    const [gameTurns, setGameTurns] = useState([]);

    const activePlayer = deriveActivePlayer(gameTurns);
    const gameBoard = deriveGameBoard(gameTurns);
    const winner = deriveWinner(gameBoard, players);  
    const hasDraw = gameTurns.length === 9 && !winner;

    function handleSelectSquare(rowIndex, colIndex) {
        setGameTurns(gameTurns => {
            const currentPlayer = deriveActivePlayer(gameTurns);

            const updatedGameTurns = [
                { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
                ...gameTurns,
            ];

            return updatedGameTurns;
        });
    }

    function handleRestart() {
        setGameTurns([]);
    }

    function handlePlayerNameChange(symbol, newName) {
        setPlayers(players => ({
            ...players,
            [symbol]: newName,
        }));
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player 
                        initialName={PLAYERS.X} 
                        symbol="X" 
                        isActive={activePlayer === "X"}
                        onChangeName={handlePlayerNameChange}
                    />
                    <Player 
                        initialName={PLAYERS.O} 
                        symbol="O" 
                        isActive={activePlayer === "O"}
                        onChangeName={handlePlayerNameChange}
                    />
                </ol>
                {(winner || hasDraw) && 
                    <GameOver 
                        winner={winner} 
                        onRestart={handleRestart} 
                    />}
                <GameBoard 
                    onSelectSquare={handleSelectSquare} 
                    board={gameBoard}
                />
            </div>
            <Log turns={gameTurns}/>
        </main>
    )
}

export default App
