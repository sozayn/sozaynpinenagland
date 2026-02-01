import React, { useState } from 'react';
import TicTacToe from './ThreeMensMorris';
import Hnefatafl from './Hnefatafl';
import Mancala from './Mancala';
// FIX: Import HelpCircleIcon instead of the non-exported HelpCircle.
import { GridIcon, HnefataflIcon, MancalaIcon, XIcon, HelpCircleIcon } from './icons';
import type { GameLog } from '../types';

type GameId = 'hnefatafl' | 'tic-tac-toe' | 'mancala';

interface GameProps {
  onGameComplete: (log: Omit<GameLog, 'timestamp'>) => void;
}

const games = [
    { id: 'hnefatafl' as GameId, name: 'Hnefatafl', description: 'A Viking strategy board game of unequal sides.', icon: HnefataflIcon, rules: {
        title: 'How to Play Hnefatafl',
        content: [
            { point: 'Attackers (Red):', detail: 'Win by capturing the King. The King is captured by surrounding him on all four sides with your pieces (the throne & corners are also hostile).' },
            { point: 'Defenders (Blue):', detail: 'Win by helping the King escape. The King escapes by reaching any of the four corner squares.' },
            { point: 'Movement:', detail: 'All pieces move like a Rook in chess (any number of empty squares horizontally or vertically). Only the King can land on the throne or corners.' },
            { point: 'Capture:', detail: 'Capture an enemy piece by "sandwiching" it between two of your own pieces (or one piece and a hostile square).' },
        ]
    }},
    { id: 'tic-tac-toe' as GameId, name: 'Tic-Tac-Toe', description: 'A classic game of strategy and alignment.', icon: GridIcon, rules: {
        title: 'How to Play Tic-Tac-Toe',
        content: [
            { point: 'Objective:', detail: 'Be the first player to get three of your marks in a row (up, down, across, or diagonally).' },
            { point: 'Turns:', detail: 'Players take turns placing their mark (X or O) in an empty square.' },
            { point: 'Win:', detail: 'The first player to get 3 of their marks in a row wins the game!' },
        ]
    }},
    { id: 'mancala' as GameId, name: 'Mancala', description: 'A classic count-and-capture game from Africa and Asia.', icon: MancalaIcon, rules: {
        title: 'How to Play Mancala',
        content: [
            { point: 'Objective:', detail: "Collect more stones in your store (the large pit on your right) than your opponent. Player A's side is the bottom row." },
            { point: 'Sowing:', detail: 'On your turn, pick up all the stones from one of your small pits. Drop one stone in each pit counter-clockwise.' },
            { point: 'Extra Turn:', detail: 'If your last stone lands in your own store, you get another turn!' },
            { point: 'Capture:', detail: 'If your last stone lands in an empty pit on your side, you capture all the stones in the opposite pit.' },
            { point: 'End Game:', detail: "The game ends when one player's six pits are all empty. The other player collects the remaining stones on their side." },
        ]
    }},
];

const RulesModal = ({ game, onClose }: { game: any, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-xl p-8 max-w-lg w-full relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark-tertiary">
                <XIcon className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-3xl font-bold text-brand-dark dark:text-brand-light mb-4">{game.rules.title}</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                {game.rules.content.map((rule: any) => (
                    <p key={rule.point}><strong>{rule.point}</strong> {rule.detail}</p>
                ))}
            </div>
        </div>
    </div>
);

const Game: React.FC<GameProps> = ({ onGameComplete }) => {
    const [view, setView] = useState<'selection' | 'pre-game' | 'playing'>('selection');
    const [selectedGame, setSelectedGame] = useState<(typeof games)[0] | null>(null);
    const [showRules, setShowRules] = useState(false);

    const handleSelectGame = (gameId: GameId) => {
        const game = games.find(g => g.id === gameId);
        if (game) {
            setSelectedGame(game);
            setView('pre-game');
        }
    };
    
    const handleStartGame = () => setView('playing');
    const handleBackToSelection = () => {
        setView('selection');
        setSelectedGame(null);
    };

    const handleWin = (gameId: GameId, winner: string) => {
        const score = Math.floor(Math.random() * 20) + 80; // Random IQ score between 80-100
        onGameComplete({ gameId, score });
        const gameName = games.find(g => g.id === gameId)?.name || 'the game';
        if (winner === 'draw') {
            alert(`It's a draw in ${gameName}! Your combined IQ score is ${score}.`);
        } else {
            alert(`${winner} wins ${gameName}! Your IQ score for this game is ${score}.`);
        }
        handleBackToSelection();
    };

    if (view === 'playing' && selectedGame) {
        const gameComponents = {
            'hnefatafl': <Hnefatafl onGameComplete={(winner) => handleWin('hnefatafl', winner)} />,
            'tic-tac-toe': <TicTacToe onGameComplete={(winner) => handleWin('tic-tac-toe', winner)} />,
            'mancala': <Mancala onGameComplete={(winner) => handleWin('mancala', winner)} />,
        };
        return (
            <div className="p-8">
                <button onClick={handleBackToSelection} className="mb-8 text-brand-accent hover:underline">
                    &larr; Back to Game Selection
                </button>
                {gameComponents[selectedGame.id]}
            </div>
        );
    }

    if (view === 'pre-game' && selectedGame) {
        return (
            <>
                {showRules && <RulesModal game={selectedGame} onClose={() => setShowRules(false)} />}
                <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-brand-dark-secondary p-8 rounded-lg">
                    <button onClick={handleBackToSelection} className="absolute top-12 left-12 text-brand-accent hover:underline">&larr; Back</button>
                    <selectedGame.icon className="w-24 h-24 text-brand-accent/50 mb-4" />
                    <h1 className="font-serif text-5xl font-bold text-brand-dark dark:text-brand-light mb-4">{selectedGame.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mb-12">{selectedGame.description}</p>
                    <div className="flex gap-4">
                        <button onClick={() => setShowRules(true)} className="flex items-center gap-2 px-8 py-4 bg-brand-light-secondary dark:bg-brand-dark-tertiary text-xl font-semibold rounded-lg hover:ring-2 hover:ring-brand-accent transition-all">
                            <HelpCircleIcon /> How to Play
                        </button>
                        <button onClick={handleStartGame} className="px-8 py-4 bg-brand-accent text-white text-xl font-semibold rounded-lg hover:bg-brand-accent-hover transition-all">
                            Start 2-Player Game
                        </button>
                    </div>
                </div>
            </>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-brand-dark-secondary p-8 rounded-lg">
            <GridIcon className="w-16 h-16 text-brand-accent/50 mb-4" />
            <h1 className="font-serif text-5xl font-bold text-brand-dark dark:text-brand-light mb-4">Ancient Games</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mb-12">
                Challenge your mind with strategy games that have been played for centuries. Select a game to begin.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {games.map(game => (
                    <button key={game.id} onClick={() => handleSelectGame(game.id)} className="p-8 bg-brand-light-secondary dark:bg-brand-dark-tertiary rounded-lg hover:ring-2 hover:ring-brand-accent transition-all">
                        <game.icon className="w-12 h-12 text-brand-accent mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light">{game.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{game.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Game;