
// FIX: Provided full content for types.ts to resolve import errors.
export interface FontSettings {
  theme: 'light' | 'dark';
  fontSize: 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';
  fontFamily: 'font-serif' | 'font-sans';
}

export interface Bookmark {
  bookId: number;
  chapterId: number;
}

export interface Note {
  bookId: number;
  chapterId: number;
  content: string;
}

export interface ChapterContent {
  subheading: string;
  paragraphs: string[];
  image: {
    url: string;
    caption: string;
  };
  historicalContext: {
    period: string;
    era: string;
    tags: string[];
  };
  globalInfluence: string[];
  audioUrl?: string;
}

export interface Chapter {
  id: number;
  number: number;
  title: string;
  content: ChapterContent;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
}

export interface Book {
  id: number;
  title: string;
  category: string;
  coverImage: string;
  chapters: Chapter[];
  characters?: Character[];
}

export interface ChatMessage {
  id: number;
  role: 'ai' | 'user';
  content: string;
}

// --- NEW PROFILE & GOALS TYPES ---

export interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface GoalAspect {
  aspect: string;
  attributes: { title: string; description: string; }[];
  finalGoals: Goal[];
}

export interface WellnessLog {
  date: string; // YYYY-MM-DD
  type: 'Meditation' | 'Yoga';
  duration: number; // in minutes
}

export interface AiInteractionLog {
  timestamp: number;
}

export interface GameLog {
  gameId: string;
  score: number; // Represents IQ score/points
  timestamp: number;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  goals: GoalAspect[];
  readingProgress: { [bookId: number]: number };
  wellnessLog: WellnessLog[];
  aiInteractionLog: AiInteractionLog[];
  gameLog: GameLog[];
  // --- NEW PERSISTENT STATE ---
  fontSettings: FontSettings;
  bookmarks: Bookmark[];
  notes: Note[];
  chatPanelMessages: ChatMessage[];
  activeView: string;
  currentBookIndex: number;
  currentChapterIndex: number;
  thinkingModeEnabled: boolean;
}
