
import React, { useState, useEffect } from 'react';
import { Crown, Shield, Castle } from 'lucide-react';

type Player = 'Attacker' | 'Defender';
type Piece = 'attacker' | 'defender' | 'king';
type Square = Piece | null;

const initialBoard: Square[][] = [
  [null, null, null, 'attacker', 'attacker', 'attacker', 'attacker', 'attacker', null, null, null],
  [null, null, null, null, null, 'attacker', null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null],
  ['attacker', null, null, null, null, 'defender', null, null, null, null, 'attacker'],
  ['attacker', null, null, null, 'defender', 'defender', 'defender', null, null, null, 'attacker'],
  ['attacker', 'attacker', null, 'defender', 'defender', 'king', 'defender', 'defender', null, 'attacker', 'attacker'],
  ['attacker', null, null, null, 'defender', 'defender', 'defender', null, null, null, 'attacker'],
  ['attacker', null, null, null, null, 'defender', null, null, null, null, 'attacker'],
  [null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, 'attacker', null, null, null, null, null],
  [null, null, null, 'attacker', 'attacker', 'attacker', 'attacker', 'attacker', null, null, null],
];

const throne = [5, 5];
const corners = [[0, 0], [0, 10], [10, 0], [10, 10]];

const KingIcon = () => <Crown className="w-4/5 h-4/5 text-white" />;
const DefenderIcon = () => <Shield className="w-4/5 h-4/5 text-white" />;
const AttackerIcon = () => <Castle className="w-4/5 h-4/5 text-white" />;

const Hnefatafl: React.FC<{ onGameComplete: (winner: string) => void }> = ({ onGameComplete }) => {
  const [board, setBoard] = useState<Square[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Attacker');
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [validMoves, setValidMoves] = useState<{row: number, col: number}[]>([]);

  useEffect(() => {
    if (winner) {
      setTimeout(() => onGameComplete(winner), 1000);
      return;
    };
    const checkResult = checkWinCondition(board);
    if (checkResult) {
      setWinner(checkResult);
    }
  }, [board, winner, onGameComplete]);

  const findKing = (currentBoard: Square[][]) => {
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        if (currentBoard[r][c] === 'king') return { row: r, col: c };
      }
    }
    return null;
  };
  
  const checkWinCondition = (currentBoard: Square[][]): Player | null => {
    const kingPosition = findKing(currentBoard);
    if (kingPosition && corners.some(c => c[0] === kingPosition.row && c[1] === kingPosition.col)) {
      return 'Defender';
    }

    if (kingPosition) {
      const { row, col } = kingPosition;
      const neighbors = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
      const isSurrounded = neighbors.every(([nRow, nCol]) => {
          if (nRow < 0 || nRow >= 11 || nCol < 0 || nCol >= 11) return true;
          const neighborPiece = currentBoard[nRow][nCol];
          return neighborPiece === 'attacker' || isHostileSquare(nRow, nCol, currentBoard);
      });
      if (isSurrounded) {
        return 'Attacker';
      }
    }
    return null;
  };


  const isHostileSquare = (row: number, col: number, currentBoard: Square[][]) => {
    return (row === throne[0] && col === throne[1] && currentBoard[row][col] === null);
  };
  
  const calculateValidMoves = (from: {row: number, col: number}) => {
    const moves: {row: number, col: number}[] = [];
    const piece = board[from.row][from.col];
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 11; i++) {
        const to = { row: from.row + dr * i, col: from.col + dc * i };
        if (to.row < 0 || to.row >= 11 || to.col < 0 || to.col >= 11) break;
        if (board[to.row][to.col] !== null) break;

        const isKing = piece === 'king';
        const isRestricted = corners.some(c => c[0] === to.row && c[1] === to.col) || (to.row === throne[0] && to.col === throne[1]);
        if (isRestricted && !isKing) continue;

        moves.push(to);
      }
    }
    return moves;
  }

  const handleSquareClick = (row: number, col: number) => {
    if (winner) return;

    if (selectedPiece) {
      if (validMoves.some(m => m.row === row && m.col === col)) {
        movePiece(selectedPiece, { row, col });
      }
      setSelectedPiece(null);
      setValidMoves([]);
    } else {
      const piece = board[row][col];
      if (piece) {
        if ((currentPlayer === 'Defender' && (piece === 'defender' || piece === 'king')) ||
            (currentPlayer === 'Attacker' && piece === 'attacker')) {
          setSelectedPiece({ row, col });
          setValidMoves(calculateValidMoves({row, col}));
        }
      }
    }
  };

  const movePiece = (from: { row: number, col: number }, to: { row: number, col: number }) => {
    const newBoard = board.map(r => [...r]);
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;

    const opposingPiece: Piece = currentPlayer === 'Attacker' ? 'defender' : 'attacker';
    const neighbors = [[to.row - 1, to.col], [to.row + 1, to.col], [to.row, to.col - 1], [to.row, to.col + 1]];
    
    for (const [nRow, nCol] of neighbors) {
        if (nRow >= 0 && nRow < 11 && nCol >= 0 && nCol < 11 && (newBoard[nRow][nCol] === opposingPiece || newBoard[nRow][nCol] === 'king' && opposingPiece === 'defender')) {
            const [oRow, oCol] = [nRow + (nRow - to.row), nCol + (nCol - to.col)];
            const sandwichingPiece = newBoard[oRow]?.[oCol];
            const isPlayerPiece = (sandwichingPiece === 'attacker' && currentPlayer === 'Attacker') || ((sandwichingPiece === 'defender' || sandwichingPiece === 'king') && currentPlayer === 'Defender');
            
            if (isPlayerPiece || isHostileSquare(oRow,oCol, newBoard) || (oRow < 0 || oRow >= 11 || oCol < 0 || oCol >= 11)) {
                if (newBoard[nRow][nCol] !== 'king') {
                    newBoard[nRow][nCol] = null;
                }
            }
        }
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'Attacker' ? 'Defender' : 'Attacker');
  };

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setCurrentPlayer('Attacker');
    setSelectedPiece(null);
    setWinner(null);
    setValidMoves([]);
  };
  
  const getStatusMessage = () => {
    if (winner) return `${winner} wins!`;
    return `${currentPlayer}'s Turn`;
  };

  const renderPiece = (piece: Piece) => {
    const baseStyle = "w-[85%] h-[85%] rounded-full flex items-center justify-center font-bold shadow-lg border-2 transition-transform duration-200 p-0.5";
    if (piece === 'king') return <div className={`${baseStyle} bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-800`}><KingIcon /></div>;
    if (piece === 'defender') return <div className={`${baseStyle} bg-gradient-to-br from-blue-500 to-blue-700 border-blue-900`}><DefenderIcon /></div>;
    if (piece === 'attacker') return <div className={`${baseStyle} bg-gradient-to-br from-red-500 to-red-700 border-red-900`}><AttackerIcon /></div>;
    return null;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-xl font-serif w-full">
      <h1 className="text-3xl font-bold mb-2 text-white">Hnefatafl</h1>
      <div className="mb-4 text-lg h-8 flex items-center gap-3">
        <span className={`font-bold ${currentPlayer === 'Attacker' ? 'text-red-400' : 'text-blue-400'}`}>
            {getStatusMessage()}
        </span>
      </div>
      <div className="p-1 sm:p-2 bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-lg shadow-2xl w-full max-w-[484px] aspect-square">
        <div className="grid grid-cols-11 grid-rows-11 w-full h-full gap-px bg-gray-900/50">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isCorner = corners.some(corner => corner[0] === r && corner[1] === c);
              const isThrone = r === throne[0] && c === throne[1];
              const isSelected = selectedPiece?.row === r && selectedPiece?.col === c;
              const isValidMove = validMoves.some(m => m.row === r && m.col === c);
              
              let bgClass = 'bg-gray-200 shadow-inner';
              if(isThrone) bgClass = 'bg-yellow-400 shadow-inner';
              if(isCorner) bgClass = 'bg-red-500 shadow-inner';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`w-full h-full flex items-center justify-center cursor-pointer relative ${bgClass}`}
                >
                  {isCorner && <span className="absolute text-red-900/70 font-bold text-xs sm:text-sm">IN</span>}
                   {isValidMove && <div className="absolute w-2/3 h-2/3 rounded-full bg-green-500/50 animate-pulse ring-2 ring-green-400"></div>}
                  <div className={`relative z-10 transition-transform duration-200 w-full h-full flex items-center justify-center ${isSelected ? 'scale-110' : ''}`}>{piece && renderPiece(piece)}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <button onClick={resetGame} className="mt-6 px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-lg">
        Reset Game
      </button>
    </div>
  );
};

export default Hnefatafl;
