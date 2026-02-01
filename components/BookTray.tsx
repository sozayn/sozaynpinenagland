
import React from 'react';
import type { Book } from '../types';
import { XIcon } from './icons';

interface BookTrayProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  currentBookIndex: number;
  onSelectBook: (index: number) => void;
}

const BookTray: React.FC<BookTrayProps> = ({ isOpen, onClose, books, currentBookIndex, onSelectBook }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-tray-title"
        className={`fixed bottom-0 left-0 right-0 bg-brand-light-secondary dark:bg-brand-dark-secondary rounded-t-2xl shadow-2xl z-50 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} h-[50vh] sm:h-[45vh] max-h-[480px]`}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-dark-tertiary flex-shrink-0">
          <h2 id="book-tray-title" className="font-serif text-2xl md:text-3xl font-bold text-brand-dark dark:text-brand-light">
            Select Your Chronicle
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-brand-dark-tertiary" aria-label="Close book selection">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-auto">
          <div className="flex items-center h-full px-4 sm:px-8 py-6 space-x-6 sm:space-x-8">
            {books.map((book, index) => {
              const isSelected = index === currentBookIndex;
              return (
                <button
                  key={book.id}
                  onClick={() => onSelectBook(index)}
                  className={`flex-shrink-0 w-36 sm:w-48 group text-left transition-transform duration-300 ease-in-out hover:scale-105 ${isSelected ? 'cursor-default' : ''}`}
                  aria-current={isSelected}
                >
                  <div className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${isSelected ? 'ring-4 ring-brand-accent' : 'ring-0 ring-transparent'}`}>
                    <img
                      src={book.coverImage}
                      alt={`${book.title} cover`}
                      className="w-full object-cover aspect-[2/3]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    {/* --- NEW: Currently Reading Indicator --- */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span>Reading</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    {/* --- UPDATED: Title Highlight --- */}
                    <h3 className={`font-bold text-lg truncate group-hover:text-brand-accent transition-colors ${isSelected ? 'text-brand-accent' : 'text-brand-dark dark:text-brand-light'}`}>{book.title}</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">{book.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default BookTray;
