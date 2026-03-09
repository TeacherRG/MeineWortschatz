export interface Word {
  id: string;
  german: string;
  translation: string;
  category: string;
  example?: string;
  note?: string;
}

export interface WordSet {
  id: string;
  title: string;
  description: string;
  words: Word[];
}

export type AppMode = 'sets' | 'cards' | 'list' | 'quiz' | 'poems' | 'stats' | 'game';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlockedAt?: string;
}

export interface UserStats {
  points: number;
  level: number;
  achievements: string[]; // IDs of unlocked achievements
}
