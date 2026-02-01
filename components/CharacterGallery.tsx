
import React, { useState, useEffect } from 'react';
import type { Book, Character } from '../types';
import { XIcon } from './icons';

interface CharacterGalleryProps {
  books: Book[];
  currentBookIndex: number;
  onSelectBook: (index: number) => void;
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({ books, currentBookIndex, onSelectBook }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const booksWithCharacters = books
    .map((book, index) => ({ ...book, originalIndex: index }))
    .filter(book => book.characters && book.characters.length > 0);
  
  const currentBook = books[currentBookIndex];
  const characters = currentBook?.characters || [];

  // Effect to handle cases where the current book has no characters
  useEffect(() => {
    const currentBookHasChars = currentBook?.characters && currentBook.characters.length > 0;
    if (!currentBookHasChars && booksWithCharacters.length > 0) {
      onSelectBook(booksWithCharacters[0].originalIndex);
    }
  }, [currentBookIndex, books, onSelectBook, booksWithCharacters, currentBook]);

  if (booksWithCharacters.length === 0) {
    return (
        <div className="bg-white dark:bg-brand-dark-secondary p-8 md:p-12 rounded-lg shadow-sm text-center h-full flex flex-col justify-center items-center">
            <h1 className="font-serif text-5xl font-bold text-brand-dark dark:text-brand-light mb-4">Character Gallery</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">No books with character galleries are available.</p>
        </div>
    );
  }

  // If the logic to switch books is running, this prevents a flicker of old content
  if (!currentBook?.characters || currentBook.characters.length === 0) {
    return null; 
  }

  return (
    <div className="flex flex-col md:flex-row h-full gap-8">
      {/* Book Selector Sidebar */}
      <aside className="w-full md:w-1/4 bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-sm flex-shrink-0 overflow-y-auto">
        <h2 className="font-serif text-3xl font-bold text-brand-dark dark:text-brand-light mb-6">Chronicles</h2>
        <nav className="space-y-4">
          {booksWithCharacters.map(book => (
            <button 
              key={book.id} 
              onClick={() => onSelectBook(book.originalIndex)}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors duration-200 ${currentBookIndex === book.originalIndex ? 'bg-brand-accent/10 ring-2 ring-brand-accent/50' : 'hover:bg-gray-100 dark:hover:bg-brand-dark-tertiary'}`}
              aria-current={currentBookIndex === book.originalIndex}
            >
              <img src={book.coverImage} alt={`${book.title} cover`} className="w-12 h-16 object-cover rounded-md shadow-sm flex-shrink-0" />
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${currentBookIndex === book.originalIndex ? 'text-brand-accent' : 'text-brand-dark dark:text-brand-light'}`}>{book.title}</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">{book.category}</p>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Character Grid */}
      <main className="flex-1 bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-sm overflow-y-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-dark dark:text-brand-light mb-8">Characters of {currentBook.title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
          {characters.map(character => (
            <div key={character.id} className="cursor-pointer group" onClick={() => setSelectedCharacter(character)}>
              <div className="aspect-[3/4] bg-gray-200 dark:bg-brand-dark-tertiary rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
                <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg sm:text-xl text-brand-dark dark:text-brand-light">{character.name}</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">{character.title}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Modal for Character Details */}
      {selectedCharacter && (
         <>
            <div className="fixed inset-0 bg-black/70 z-50 animate-fade-in" onClick={() => setSelectedCharacter(null)} aria-hidden="true"></div>
            <div role="dialog" aria-modal="true" aria-labelledby="character-name" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-brand-dark-secondary w-[95vw] max-w-4xl h-[90vh] md:h-[80vh] rounded-2xl shadow-2xl z-50 flex flex-col md:flex-row overflow-hidden animate-slide-up">
                <div className="w-full h-1/3 md:w-1/3 md:h-full bg-gray-200 flex-shrink-0">
                    <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full flex-1 p-6 md:p-12 overflow-y-auto relative">
                    <button onClick={() => setSelectedCharacter(null)} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-brand-dark-tertiary dark:hover:text-gray-100 transition-colors" aria-label="Close character details">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <p className="text-base font-semibold uppercase tracking-wider text-brand-accent mb-2">{selectedCharacter.title}</p>
                    <h1 id="character-name" className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-brand-dark dark:text-brand-light mb-6">{selectedCharacter.name}</h1>
                    <div className="prose prose-lg sm:prose-xl max-w-none font-serif text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p>{selectedCharacter.description}</p>
                    </div>
                </div>
            </div>
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slide-up {
                from { opacity: 0; transform: translate(-50%, -45%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
              }
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
         </>
      )}
    </div>
  );
};

export default CharacterGallery;
