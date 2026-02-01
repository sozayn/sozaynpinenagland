import React, { useState, useEffect } from 'react';

type Player = 'A' | 'B';
type Winner = Player | 'draw';

const initialPits = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];

// Define props interface for Pit component to fix TypeScript assignment errors
interface PitProps {
  index: number;
  stones: number;
  isStore?: boolean;
  currentPlayer: Player;
  winner: Winner | null;
  onClick: (index: number) => void;
}

// Use React.FC to correctly handle standard React props like 'key'
const Pit: React.FC<PitProps> = ({
  index,
  stones,
  isStore = false,
  currentPlayer,
  winner,
  onClick,
}) => {
  const pitStyle = isStore
    ? 'w-16 h-32 sm:w-20 sm:h-40 md:w-28 md:h-56 rounded-full flex-col'
    : 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full';
  const textStyle = isStore
    ? 'text-2xl sm:text-3xl md:text-4xl'
    : 'text-xl sm:text-2xl md:text-3xl';

  const isPlayerAPit = index >= 0 && index <= 5;
  const isPlayerBPit = index >= 7 && index <= 12;
  const isClickable =
    !isStore &&
    !winner &&
    stones > 0 &&
    ((currentPlayer === 'A' && isPlayerAPit) ||
      (currentPlayer === 'B' && isPlayerBPit));

  return (
    <div
      onClick={() => isClickable && onClick(index)}
      className={`${pitStyle} bg-yellow-900/50 shadow-inner flex items-center justify-center transition-all
        ${isClickable ? 'cursor-pointer ring-2 ring-yellow-400' : ''}
        ${!isStore && !isClickable && 'opacity-75'}
      `}
    >
      <span className={`${textStyle} font-bold text-yellow-200/80`}>
        {stones}
      </span>
    </div>
  );
};

const Mancala: React.FC<{ onGameComplete: (winner: string) => void }> = ({ onGameComplete }) => {
  const [pits, setPits] = useState<number[]>(initialPits);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('A');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [message, setMessage] = useState("Player A's turn");

  useEffect(() => {
    if (winner) return;
    checkEndGame();
  }, [pits]);

  useEffect(() => {
    if (winner) {
      if (winner === 'draw') {
        setMessage("It's a draw!");
        setTimeout(() => onGameComplete('draw'), 1500);
      } else {
        setMessage(`Player ${winner} wins!`);
        setTimeout(() => onGameComplete(`Player ${winner}`), 1500);
      }
    }
  }, [winner, onGameComplete]);

  const checkEndGame = () => {
    const playerAPitsEmpty = pits.slice(0, 6).every(p => p === 0);
    const playerBPitsEmpty = pits.slice(7, 13).every(p => p === 0);

    if (playerAPitsEmpty || playerBPitsEmpty) {
      const finalPits = [...pits];
      let playerAScore = finalPits[6] + finalPits.slice(0, 6).reduce((a, b) => a + b, 0);
      let playerBScore = finalPits[13] + finalPits.slice(7, 13).reduce((a, b) => a + b, 0);
      
      for(let i=0; i<14; i++) {
        if (i !== 6 && i !== 13) finalPits[i] = 0;
      }
      
      finalPits[6] = playerAScore;
      finalPits[13] = playerBScore;
      setPits(finalPits);

      if (playerAScore > playerBScore) setWinner('A');
      else if (playerBScore > playerAScore) setWinner('B');
      else setWinner('draw');
    }
  };

  const handlePitClick = (index: number) => {
    if (winner || pits[index] === 0) return;
    if ((currentPlayer === 'A' && index > 5) || (currentPlayer === 'B' && (index < 7 || index > 12))) return;

    let stones = pits[index];
    const newPits = [...pits];
    newPits[index] = 0;

    let currentIndex = index;
    while (stones > 0) {
      currentIndex = (currentIndex + 1) % 14;
      if ((currentPlayer === 'A' && currentIndex === 13) || (currentPlayer === 'B' && currentIndex === 6)) {
        continue;
      }
      newPits[currentIndex]++;
      stones--;
    }

    const lastPit = currentIndex;
    const isPlayerAPit = lastPit >= 0 && lastPit <= 5;
    const isPlayerBPit = lastPit >= 7 && lastPit <= 12;

    if (newPits[lastPit] === 1 && ((currentPlayer === 'A' && isPlayerAPit) || (currentPlayer === 'B' && isPlayerBPit))) {
      const oppositePit = 12 - lastPit;
      if (newPits[oppositePit] > 0) {
        const capturedStones = newPits[oppositePit] + 1;
        newPits[oppositePit] = 0;
        newPits[lastPit] = 0;
        if (currentPlayer === 'A') newPits[6] += capturedStones;
        else newPits[13] += capturedStones;
      }
    }
    
    setPits(newPits);

    if ((currentPlayer === 'A' && lastPit === 6) || (currentPlayer === 'B' && lastPit === 13)) {
       setMessage(`Player ${currentPlayer} gets another turn!`);
    } else {
      const nextPlayer = currentPlayer === 'A' ? 'B' : 'A';
      setCurrentPlayer(nextPlayer);
      setMessage(`Player ${nextPlayer}'s turn`);
    }
  };

  const resetGame = () => {
    setPits([...initialPits]);
    setCurrentPlayer('A');
    setWinner(null);
    setMessage("Player A's turn");
  };

  return (
    <div className="flex flex-col items-center p-4 font-serif">
      <h1 className="text-3xl font-bold mb-2 text-brand-dark dark:text-brand-light">Mancala</h1>
      <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 h-8">{message}</p>
      
      <div className="w-full max-w-[800px] bg-yellow-800 border-4 border-yellow-950 rounded-[40px] sm:rounded-[60px] md:rounded-[100px] shadow-2xl mx-auto flex justify-around items-center p-2 sm:p-4 md:p-6 gap-2 sm:gap-4 md:gap-6">
        <Pit index={13} stones={pits[13]} isStore currentPlayer={currentPlayer} winner={winner} onClick={handlePitClick} />
        <div className="flex flex-col justify-between h-full py-1 sm:py-2 gap-2 sm:gap-4">
          <div className={`flex gap-2 sm:gap-4 p-1 sm:p-2 rounded-full transition-colors ${currentPlayer === 'B' ? 'bg-yellow-600/50' : ''}`}>
            {pits.slice(7, 13).reverse().map((stones, i) => <Pit key={12-i} index={12-i} stones={stones} currentPlayer={currentPlayer} winner={winner} onClick={handlePitClick} />)}
          </div>
          <div className={`flex gap-2 sm:gap-4 p-1 sm:p-2 rounded-full transition-colors ${currentPlayer === 'A' ? 'bg-yellow-600/50' : ''}`}>
            {pits.slice(0, 6).map((stones, i) => <Pit key={i} index={i} stones={stones} currentPlayer={currentPlayer} winner={winner} onClick={handlePitClick} />)}
          </div>
        </div>
        <Pit index={6} stones={pits[6]} isStore currentPlayer={currentPlayer} winner={winner} onClick={handlePitClick} />
      </div>

       <button onClick={resetGame} className="mt-6 px-6 py-2 bg-yellow-800 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors shadow-lg">
        Reset Game
      </button>
    </div>
  );
};

export default Mancala;