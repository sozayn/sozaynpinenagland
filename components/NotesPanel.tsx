
import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  note: string;
  onNoteChange: (content: string) => void;
  title: string;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ isOpen, onClose, note, onNoteChange, title }) => {
  const [text, setText] = useState(note);

  useEffect(() => {
    setText(note);
  }, [note, isOpen]);

  // Debounced save
  useEffect(() => {
    const handler = setTimeout(() => {
      if (text !== note) {
        onNoteChange(text);
      }
    }, 500); // Save 500ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [text, onNoteChange, note]);

  return (
    <aside className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-gray-200 flex flex-col transition-transform duration-500 ease-in-out transform z-40 dark:bg-brand-dark-secondary dark:border-brand-dark-tertiary ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-200 dark:border-brand-dark-tertiary">
        <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-brand-light">Notes</h3>
            <p className="text-base text-gray-500 dark:text-gray-400 truncate max-w-[280px]">For: {title}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark-tertiary" aria-label="Close notes panel">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </header>
      <div className="flex-1 p-4 flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full flex-1 p-2 bg-transparent border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-shadow resize-none dark:border-brand-dark-tertiary dark:text-brand-light-secondary"
        />
         <p className="text-sm text-gray-400 pt-2 text-center">Notes are saved automatically.</p>
      </div>
    </aside>
  );
};

export default NotesPanel;
