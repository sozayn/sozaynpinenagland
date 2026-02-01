
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BookReader from './components/BookReader';
import CharacterGallery from './components/CharacterGallery';
import DevatraPage from './components/DevatraPage';
import HistoryExplorer from './components/HistoryExplorer';
import MeditationYoga from './components/MeditationYoga';
import Astrology from './components/Astrology';
import Game from './components/Game';
import ProfileGoals from './components/ProfileGoals';
import BookTray from './components/BookTray';
import NotesPanel from './components/NotesPanel';
import ChatPanel from './components/ChatPanel';
import { books, quickQuestions } from './data/mockData';
import type { FontSettings, Bookmark, Note, UserProfile, GameLog, ChatMessage } from './types';
import { getChatResponse } from './services/geminiService';
import { XIcon } from './components/icons';
import * as userService from './services/userService';

interface DevatraAIButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const DevatraAIButton: React.FC<DevatraAIButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-1/2 -translate-y-1/2 right-4 md:right-8 z-50 w-16 h-16 bg-brand-accent rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-brand-accent-hover hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-accent/50"
      aria-label={isOpen ? 'Close Devatra AI Chat' : 'Open Devatra AI Chat'}
    >
      <div className="relative w-12 h-12">
        <img
          src="https://drive.google.com/uc?export=view&id=17oDZYUqVg1xIZdFD9xyTsrLp2T4g9YZL"
          alt="Devatra AI Logo"
          className={`absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <XIcon
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </button>
  );
};

interface AppProps {
  user: UserProfile;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ user, onLogout }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(user);

  // Core function to update local state and persist changes to our simulated DB
  const updateUserProfileAndPersist = useCallback((updates: Partial<UserProfile> | ((p: UserProfile) => Partial<UserProfile>)) => {
    setUserProfile(prevProfile => {
        const newUpdates = typeof updates === 'function' ? updates(prevProfile) : updates;
        const newProfile = { ...prevProfile, ...newUpdates };
        userService.updateUserProfile(newProfile.email, newProfile);
        return newProfile;
    });
  }, []);

  const {
      activeView, currentBookIndex, currentChapterIndex, fontSettings,
      bookmarks, notes, chatPanelMessages, thinkingModeEnabled
  } = userProfile;
  
  const [isBookTrayOpen, setIsBookTrayOpen] = useState(false);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isChatPanelLoading, setIsChatPanelLoading] = useState(false);
  const [isDevatraPageLoading, setIsDevatraPageLoading] = useState(false);

  const currentBook = books[currentBookIndex];
  if (!currentBook) {
    return <div className="flex h-screen items-center justify-center bg-brand-light dark:bg-brand-dark"><p className="text-xl text-gray-700 dark:text-gray-200">Loading book data...</p></div>;
  }
  
  const currentChapter = currentBook.chapters[currentChapterIndex];
  if (!currentChapter) {
    return <div className="flex h-screen items-center justify-center bg-brand-light dark:bg-brand-dark"><p className="text-xl text-gray-700 dark:text-gray-200">Loading chapter data...</p></div>;
  }
  
  const readingProgress = currentBook.chapters.length > 1
    ? Math.round((currentChapterIndex / (currentBook.chapters.length - 1)) * 100)
    : 100;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', fontSettings.theme === 'dark');
  }, [fontSettings.theme]);

  const handleUpdateUserProfile = useCallback((updatedProfile: Partial<UserProfile>) => {
    updateUserProfileAndPersist(updatedProfile);
  }, [updateUserProfileAndPersist]);

  const handleCompletePractice = useCallback((type: 'Meditation' | 'Yoga', duration: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog = { date: today, type, duration };
    updateUserProfileAndPersist({ wellnessLog: [...userProfile.wellnessLog, newLog] });
  }, [updateUserProfileAndPersist, userProfile.wellnessLog]);

  const handleAiInteraction = useCallback(() => {
    updateUserProfileAndPersist(prev => ({ aiInteractionLog: [...prev.aiInteractionLog, { timestamp: Date.now() }] }));
  }, [updateUserProfileAndPersist]);

  const handleGameComplete = useCallback((log: Omit<GameLog, 'timestamp'>) => {
    updateUserProfileAndPersist({ gameLog: [...userProfile.gameLog, { ...log, timestamp: Date.now() }] });
  }, [updateUserProfileAndPersist, userProfile.gameLog]);

  useEffect(() => {
     if (userProfile.readingProgress[currentBook.id] !== readingProgress) {
        updateUserProfileAndPersist({
            readingProgress: {
                ...userProfile.readingProgress,
                [currentBook.id]: readingProgress,
            }
        });
     }
  }, [readingProgress, currentBook.id, userProfile.readingProgress, updateUserProfileAndPersist]);

  const handleFontSettingsChange = (settings: Partial<FontSettings>) => updateUserProfileAndPersist({ fontSettings: { ...fontSettings, ...settings } });
  const handleSetActiveView = (view: string) => updateUserProfileAndPersist({ activeView: view });

  const handleSelectBook = (index: number) => {
    updateUserProfileAndPersist({ currentBookIndex: index, currentChapterIndex: 0 });
    setIsBookTrayOpen(false);
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < currentBook.chapters.length - 1) {
        updateUserProfileAndPersist({ currentChapterIndex: currentChapterIndex + 1 });
    }
  };
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
        updateUserProfileAndPersist({ currentChapterIndex: currentChapterIndex - 1 });
    }
  };

  const handleToggleBookmark = () => {
    const bookmark = { bookId: currentBook.id, chapterId: currentChapter.id };
    const newBookmarks = bookmarks.some(b => b.bookId === bookmark.bookId && b.chapterId === bookmark.chapterId)
      ? bookmarks.filter(b => !(b.bookId === bookmark.bookId && b.chapterId === bookmark.chapterId))
      : [...bookmarks, bookmark];
    updateUserProfileAndPersist({ bookmarks: newBookmarks });
  };

  const getNoteContextId = () => activeView === 'Character Gallery' ? currentBook.id : currentChapter.id;

  const handleNoteChange = (content: string) => {
    const contextId = getNoteContextId();
    const noteId = { bookId: currentBook.id, chapterId: contextId };
    const existingNoteIndex = notes.findIndex(n => n.bookId === noteId.bookId && n.chapterId === noteId.chapterId);
    let updatedNotes: Note[];
    
    if (existingNoteIndex > -1) {
      updatedNotes = [...notes];
      updatedNotes[existingNoteIndex].content = content;
    } else {
      updatedNotes = [...notes, { ...noteId, content }];
    }
    updateUserProfileAndPersist({ notes: updatedNotes.filter(n => n.content.trim() !== '') });
  };
  
  const currentNote = notes.find(n => n.bookId === currentBook.id && n.chapterId === getNoteContextId())?.content || '';
  const notesPanelTitle = activeView === 'Book Reader' ? `Ch. ${currentChapter.number}: ${currentChapter.title}` : currentBook.title;

  const handleThinkingToggle = (enabled: boolean) => {
    updateUserProfileAndPersist({ thinkingModeEnabled: enabled });
  };

  const handleChatPanelSendMessage = async (content: string) => {
    const userMessage: ChatMessage = { id: Date.now(), role: 'user', content };
    const newMessages = [...chatPanelMessages, userMessage];
    updateUserProfileAndPersist({ chatPanelMessages: newMessages });
    setIsChatPanelLoading(true);

    try {
        const history = newMessages.slice(0, -1).map(msg => ({
            role: msg.role === 'ai' ? 'model' as const : 'user' as const,
            parts: [{ text: msg.content }]
        }));
        
        const aiResponseContent = await getChatResponse(history, content, thinkingModeEnabled);
        handleAiInteraction();
        const aiMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: aiResponseContent };
        updateUserProfileAndPersist(prev => ({ chatPanelMessages: [...prev.chatPanelMessages, aiMessage] }));
    } catch (error) {
        const errorMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: "My apologies, I am currently unable to connect. Please try again shortly."};
        updateUserProfileAndPersist(prev => ({ chatPanelMessages: [...prev.chatPanelMessages, errorMessage] }));
    } finally {
        setIsChatPanelLoading(false);
    }
  };
  
  const handleDevatraPageSendMessage = async (content: string) => {
    const userMessage: ChatMessage = { id: Date.now(), role: 'user', content };
    const newMessages = [...chatPanelMessages, userMessage];
    updateUserProfileAndPersist({ chatPanelMessages: newMessages });
    setIsDevatraPageLoading(true);

    try {
        const history = newMessages.slice(0, -1).map(msg => ({
            role: msg.role === 'ai' ? 'model' as const : 'user' as const,
            parts: [{ text: msg.content }]
        }));
        
        const aiResponseContent = await getChatResponse(history, content, thinkingModeEnabled);
        handleAiInteraction();

        const aiMessage: ChatMessage = {
            id: Date.now() + 1,
            role: 'ai',
            content: aiResponseContent,
        };
        updateUserProfileAndPersist(prev => ({ chatPanelMessages: [...prev.chatPanelMessages, aiMessage] }));

    } catch (error) {
        const errorMessage: ChatMessage = {
            id: Date.now() + 1,
            role: 'ai',
            content: "My apologies, Seeker. I am currently unable to connect with the cosmic currents. Please try again shortly.",
        };
        updateUserProfileAndPersist(prev => ({ chatPanelMessages: [...prev.chatPanelMessages, errorMessage] }));
        console.error(error);
    } finally {
        setIsDevatraPageLoading(false);
    }
};

  const renderActiveView = () => {
    switch (activeView) {
      case 'Book Reader':
        return <BookReader book={currentBook} chapter={currentChapter} onNextChapter={handleNextChapter} onPrevChapter={handlePrevChapter} isFirstChapter={currentChapterIndex === 0} isLastChapter={currentChapterIndex === currentBook.chapters.length - 1} fontSettings={fontSettings} />;
      case 'Character Gallery':
        return <CharacterGallery books={books} currentBookIndex={currentBookIndex} onSelectBook={handleSelectBook} />;
      case 'Devatra AI':
        return <DevatraPage messages={chatPanelMessages} onSendMessage={handleDevatraPageSendMessage} isLoading={isDevatraPageLoading} thinkingEnabled={thinkingModeEnabled} onThinkingToggle={handleThinkingToggle} />;
      case 'History Explorer':
        return <HistoryExplorer />;
      case 'Meditation & Yoga':
        return <MeditationYoga onPracticeComplete={handleCompletePractice} />;
      case 'Astrology':
        return <Astrology />;
      case 'Game':
        return <Game onGameComplete={handleGameComplete} />;
      case 'Profile & Goals':
        return <ProfileGoals profile={userProfile} onUpdateProfile={handleUpdateUserProfile} books={books} />;
      default:
        return <BookReader book={currentBook} chapter={currentChapter} onNextChapter={handleNextChapter} onPrevChapter={handlePrevChapter} isFirstChapter={currentChapterIndex === 0} isLastChapter={currentChapterIndex === currentBook.chapters.length - 1} fontSettings={fontSettings}/>;
    }
  };

  return (
    <div className={`flex h-screen bg-brand-light dark:bg-brand-dark font-sans ${fontSettings.fontFamily}`}>
      <Sidebar activeView={activeView} setActiveView={handleSetActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden relative md:ml-64">
        <Header book={{...currentBook, progress: readingProgress}} chapter={currentChapter} onOpenBookTray={() => setIsBookTrayOpen(true)} fontSettings={fontSettings} onFontSettingsChange={handleFontSettingsChange} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} onToggleNotes={() => setIsNotesPanelOpen(p => !p)} activeView={activeView} onToggleSidebar={() => setIsSidebarOpen(p => !p)} />
        <main className={`flex-1 overflow-y-auto bg-brand-light dark:bg-brand-dark relative ${activeView !== 'Devatra AI' ? 'p-4 sm:p-8' : ''}`}>
          {renderActiveView()}
        </main>
        <BookTray isOpen={isBookTrayOpen} onClose={() => setIsBookTrayOpen(false)} books={books} currentBookIndex={currentBookIndex} onSelectBook={handleSelectBook} />
        <NotesPanel isOpen={isNotesPanelOpen} onClose={() => setIsNotesPanelOpen(false)} note={currentNote} onNoteChange={handleNoteChange} title={notesPanelTitle} />
        {activeView !== 'Devatra AI' && (
          <>
            <div className={`fixed top-1/2 -translate-y-1/2 left-4 right-24 md:left-auto md:w-full md:max-w-md md:right-28 h-[55vh] md:h-[70%] z-40 transition-all duration-300 ease-in-out ${isChatPanelOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="bg-white dark:bg-brand-dark-secondary rounded-2xl shadow-2xl h-full border border-gray-200 dark:border-brand-dark-tertiary">
                <ChatPanel 
                  messages={chatPanelMessages} 
                  onSendMessage={handleChatPanelSendMessage} 
                  isLoading={isChatPanelLoading} 
                  quickQuestions={quickQuestions} 
                  thinkingEnabled={thinkingModeEnabled} 
                  onThinkingToggle={handleThinkingToggle}
                />
              </div>
            </div>
            <DevatraAIButton isOpen={isChatPanelOpen} onClick={() => setIsChatPanelOpen(p => !p)} />
          </>
        )}
      </div>
    </div>
  );
};

const AppContainer: React.FC = () => {
  // Bypassing login for easier development testing.
  // We initialize the "Guest Seeker" account immediately.
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const guestEmail = "guest@pinenagland.com";
    // Check if user is already logged in or use guest
    const userEmail = userService.getCurrentUserEmail() || guestEmail;
    
    // Ensure the session exists for whichever email we use
    userService.createSession(userEmail);
    
    // Attempt to load profile from "DB"
    let profile = userService.login(userEmail);
    
    // If it doesn't exist (first run for this user/guest), create it
    if (!profile) {
      profile = userService.signup(userEmail);
    }
    
    return profile;
  });

  const handleLogout = () => {
    // In "Disabled Login" mode, logging out just resets you to a fresh guest session
    userService.logout();
    window.location.reload(); 
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-light dark:bg-brand-dark">
        <p className="text-xl text-gray-700 dark:text-gray-200">Initializing Experience...</p>
      </div>
    );
  }

  return <App user={currentUser} onLogout={handleLogout} />;
};

export default AppContainer;
