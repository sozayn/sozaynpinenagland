
import type { Book, ChatMessage, UserProfile } from '../types';
import { weaversChapters } from './books/weavers-of-eternity/chapters';
import { canChapters } from './books/can/chapters';
import { weaversCharacters } from './books/weavers-of-eternity/characters';

export const books: Book[] = [
  {
    id: 1,
    title: "The Weavers of Eternity",
    category: 'Mythological Fiction',
    coverImage: 'https://drive.google.com/uc?export=view&id=1pfbAFvXYdtzzAYP4d4ut10bbIYe-BFwM',
    chapters: weaversChapters,
    characters: weaversCharacters,
  },
  {
    id: 2,
    title: "CAN",
    category: 'Philosophical Fiction',
    coverImage: 'https://drive.google.com/uc?export=view&id=1REiG5Zi-TVwSBNLMe04e59VxvIGbCpF3',
    chapters: canChapters,
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'ai',
    content: 'Welcome, Seeker. I am Devatra AI, your guide through the annals of history and myth. How may I illuminate your path today?',
  },
];

export const quickQuestions: string[] = [
  'Tell me more about the New Kingdom.',
  'Who were the "Weavers of Eternity"?',
  'What is the Duat?',
  'Explain the concept of Ma\'at.',
];

// Template for a new user profile, ensuring a fresh start.
export const newUserTemplate: Omit<UserProfile, 'email' | 'picture' | 'name'> = {
  goals: [],
  readingProgress: {},
  wellnessLog: [],
  aiInteractionLog: [],
  gameLog: [],
  fontSettings: {
    theme: 'dark',
    fontSize: 'text-lg',
    fontFamily: 'font-serif',
  },
  bookmarks: [],
  notes: [],
  chatPanelMessages: initialMessages,
  activeView: 'Book Reader',
  currentBookIndex: 0,
  currentChapterIndex: 0,
  thinkingModeEnabled: false,
};
