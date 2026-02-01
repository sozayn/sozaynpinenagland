
import React, { useState, useEffect } from 'react';
import type { Book, Chapter, FontSettings, Bookmark } from '../types';
import { Maximize, Minimize, Edit, Bookmark as BookmarkIcon, Type, ChevronsUpDown, Menu, Settings2 } from 'lucide-react';
import FontSettingsPopover from './FontSettings';
import AudioPlayer from './AudioPlayer';

interface HeaderProps {
  book: Book & { progress: number };
  chapter: Chapter;
  onOpenBookTray: () => void;
  fontSettings: FontSettings;
  onFontSettingsChange: (settings: Partial<FontSettings>) => void;
  bookmarks: Bookmark[];
  onToggleBookmark: () => void;
  onToggleNotes: () => void;
  activeView: string;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ book, chapter, onOpenBookTray, fontSettings, onFontSettingsChange, bookmarks, onToggleBookmark, onToggleNotes, activeView, onToggleSidebar }) => {
  const [isFontSettingsOpen, setIsFontSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isBookmarked = bookmarks.some(b => b.bookId === book.id && b.chapterId === chapter.id);
  const isReaderView = activeView === 'Book Reader';
  const showReaderControls = isReaderView || activeView === 'Character Gallery';

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <header className="sticky top-0 h-20 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <button onClick={onToggleSidebar} className="p-2.5 rounded-xl md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Menu size={20} className="text-slate-600 dark:text-slate-300"/>
        </button>
        
        {showReaderControls ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenBookTray}
              className="group flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-w-0"
            >
              <div className="text-left">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[300px]">{book.title}</h1>
              </div>
              <ChevronsUpDown size={14} className="text-slate-400 group-hover:text-brand-accent transition-colors" />
            </button>
            {isReaderView && (
              <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapter {chapter.number}</span>
                <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-accent h-full rounded-full transition-all duration-500" style={{ width: `${book.progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeView}</h1>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {isReaderView && chapter.content.audioUrl && (
          <div className="hidden md:block pr-4 border-r border-slate-200 dark:border-slate-800">
            <AudioPlayer src={chapter.content.audioUrl} />
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <button onClick={() => setIsFontSettingsOpen(p => !p)} className={`p-2.5 rounded-xl transition-all ${isFontSettingsOpen ? 'bg-brand-accent text-white shadow-glow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Type size={18} />
          </button>
          
          {isReaderView && (
            <button onClick={onToggleBookmark} className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <BookmarkIcon size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
          
          <button onClick={onToggleNotes} className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Edit size={18} />
          </button>

          <button onClick={handleFullscreenToggle} className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>

        {isFontSettingsOpen && (
          <div className="absolute top-full right-4 mt-2 animate-slide-up">
            <FontSettingsPopover settings={fontSettings} onChange={onFontSettingsChange} onClose={() => setIsFontSettingsOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
