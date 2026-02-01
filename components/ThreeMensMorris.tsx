import React, { useState, useEffect } from 'react';

type Player = 'X' | 'O';
type Winner = Player | 'draw';

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Define props interface for Square component to fix TypeScript assignment errors
interface SquareProps {
  value: Player | null;
  onClick: () => void;
  winner: Winner | null;
}

// Use React.FC to correctly handle standard React props like 'key'
const Square: React.FC<SquareProps> = ({ value, onClick, winner }) => {
  const piece = value ? (
    <div className={`w-[70%] h-[70%] rounded-full flex items-center justify-center text-4xl font-bold transition-transform duration-200 ease-in-out scale-100
      ${value === 'X' ? 'bg-gradient-to-br from-blue-900 to-gray-800 text-stone-300 border-2 border-black' : 'bg-gradient-to-br from-stone-100 to-stone-300 text-stone-800 border-2 border-stone-400'}`
    }>
      {value}
    </div>
  ) : (
    <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-[#f0e6d6] to-[#d4c3a9] shadow-inner transition-all duration-200 group-hover:from-[#fffdf9] group-hover:to-[#d8c7ad]"></div>
  );

  return (
    <button onClick={onClick} className="w-full h-full flex items-center justify-center group" disabled={!!winner}>
      {piece}
    </button>
  );
};

const TicTacToe: React.FC<{ onGameComplete: (winner: string) => void }> = ({ onGameComplete }) => {
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Winner | null>(null);

  useEffect(() => {
    if (winner) {
      const winnerName = winner === 'draw' ? 'draw' : `Player ${winner}`;
      setTimeout(() => onGameComplete(winnerName), 1000); // Delay to show final board
    }
  }, [winner, onGameComplete]);

  const checkWinner = (currentBoard: (Player | null)[]) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every(square => square !== null)) {
      return 'draw';
    }
    return null;
  };

  const handleSquareClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const getStatusMessage = () => {
    if (winner === 'draw') return "It's a draw!";
    if (winner) return `Player ${winner} wins!`;
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-[#2a1d1d] font-serif w-full">
       <h1 className="text-4xl font-bold mb-2 text-[#f0e6d6]">Tic-Tac-Toe</h1>
       <div className="mb-4 text-xl text-[#d4c3a9] h-8 flex items-center gap-3">
          <span className={`w-4 h-4 rounded-full transition-colors ${currentPlayer === 'X' ? 'bg-blue-500' : 'bg-stone-300'}`}></span>
          <span>{getStatusMessage()}</span>
       </div>
      
      <div className="w-full max-w-[400px] aspect-square bg-[#1c1212] border-4 border-[#3a2d2d] shadow-2xl rounded-2xl p-2 sm:p-4 grid grid-cols-3 grid-rows-3 gap-2">
          {board.map((value, index) => (
          <Square key={index} value={value} onClick={() => handleSquareClick(index)} winner={winner} />
          ))}
      </div>

      <button onClick={resetGame} className="mt-6 px-8 py-3 bg-[#1c1212] text-[#f0e6d6] text-lg font-semibold rounded-lg hover:bg-[#3a2d2d] transition-colors shadow-lg border-2 border-[#3a2d2d]">
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;