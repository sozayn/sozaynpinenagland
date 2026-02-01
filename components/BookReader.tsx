
import React from 'react';
import type { Book, Chapter, FontSettings } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, ClockIcon, StarIcon } from './icons';

interface BookReaderProps {
  book: Book;
  chapter: Chapter;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  isFirstChapter: boolean;
  isLastChapter: boolean;
  fontSettings: FontSettings;
}

const BookReader: React.FC<BookReaderProps> = ({ book, chapter, onPrevChapter, onNextChapter, isFirstChapter, isLastChapter, fontSettings }) => {
  const { content } = chapter;

  return (
    <div className={`max-w-4xl mx-auto rounded-2xl shadow-premium overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-500 ${fontSettings.theme === 'light' ? 'bg-brand-parchment' : 'bg-brand-dark-secondary'}`}>
      <div className="p-8 sm:p-12 md:p-16">
        <div className="flex flex-col md:flex-row gap-12 mb-16 items-center md:items-start">
          <div className="w-48 sm:w-64 flex-shrink-0 group">
            <div className="relative rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img src={book.coverImage} alt={`${book.title} cover`} className="w-full object-cover aspect-[2/3]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left pt-4">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="bg-brand-accent/10 text-brand-accent text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">Chapter {chapter.number}</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{content.historicalContext.era}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              {chapter.title}
            </h1>
            <p className="font-serif italic text-xl text-slate-500 dark:text-slate-400">{book.title}</p>
          </div>
        </div>
        
        <article className={`prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-300 leading-[1.8] ${fontSettings.fontSize} ${fontSettings.fontFamily}`}>
          <div className="drop-cap mb-10 text-lg sm:text-xl">
            {content.paragraphs[0]}
          </div>
          
          <figure className="my-16 group">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={content.image.url} alt={content.image.caption} className="w-full hover:scale-105 transition-transform duration-700" />
            </div>
            <figcaption className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6 font-medium uppercase tracking-[0.2em]">{content.image.caption}</figcaption>
          </figure>

          {content.paragraphs.slice(1).map((p, index) => (
            <p key={index} className="mb-8 text-lg sm:text-xl">{p}</p>
          ))}
        </article>

        <div className="mt-24 grid md:grid-cols-2 gap-6">
          <div className="bg-white/50 dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <h3 className="flex items-center gap-3 font-bold text-lg text-slate-900 dark:text-white mb-6">
              <ClockIcon className="w-5 h-5 text-amber-500" />
              Chronicle Insights
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Timeline</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{content.historicalContext.period}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-3">Associations</span>
                <div className="flex flex-wrap gap-2">
                  {content.historicalContext.tags.map(tag => (
                    <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <h3 className="flex items-center gap-3 font-bold text-lg text-slate-900 dark:text-white mb-6">
              <StarIcon className="w-5 h-5 text-brand-accent" />
              Legacy
            </h3>
            <ul className="space-y-4">
              {content.globalInfluence.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-10">
          <button 
            onClick={onPrevChapter}
            disabled={isFirstChapter}
            className="group flex items-center px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-20"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Previous
          </button>
          
          <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
            <span className="text-brand-accent">{chapter.number}</span> / {book.chapters.length}
          </span>
          
          <button 
            onClick={onNextChapter}
            disabled={isLastChapter}
            className="group flex items-center px-8 py-3 bg-brand-accent text-white rounded-xl text-sm font-bold shadow-glow hover:bg-brand-accent-hover transition-all disabled:opacity-20"
          >
            Next Chapter
            <ChevronRightIcon className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
