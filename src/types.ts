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

export type AppMode = 'sets' | 'cards' | 'list' | 'quiz' | 'poems';
