import React, { useState } from 'react';
import { Search, Volume2, CheckCircle2 } from 'lucide-react';
import { Word } from '../types';

interface WordListProps {
  words: Word[];
  learnedWords: Set<string>;
  onToggleLearned: (id: string, learned: boolean) => void;
}

export const WordList: React.FC<WordListProps> = ({ words, learnedWords, onToggleLearned }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(words.map(w => w.category)));

  const filteredWords = words.filter(w => {
    const matchesSearch = w.german.toLowerCase().includes(search.toLowerCase()) || 
                         w.translation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
          <input
            type="text"
            placeholder="Поиск слов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-brand-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-900/10 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              !selectedCategory ? 'bg-brand-900 text-white' : 'bg-white text-brand-600 border border-brand-200'
            }`}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-brand-900 text-white' : 'bg-white text-brand-600 border border-brand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filteredWords.map((word) => {
          const isLearned = learnedWords.has(word.id);
          return (
            <div 
              key={word.id}
              className={`group bg-white p-4 rounded-2xl border flex items-center justify-between hover:shadow-md transition-all ${
                isLearned ? 'border-emerald-100 bg-emerald-50/30' : 'border-brand-100'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-brand-900">{word.german}</h3>
                  <button 
                    onClick={() => speak(word.german)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-brand-50 text-brand-400 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {isLearned && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <p className="text-brand-500">{word.translation}</p>
                {word.example && (
                  <p className="text-sm text-brand-400 italic mt-1">
                    "{word.example}"
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-brand-400 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
                  {word.category}
                </div>
                <button
                  onClick={() => onToggleLearned(word.id, !isLearned)}
                  className={`p-2 rounded-xl transition-colors ${
                    isLearned ? 'text-emerald-500 hover:bg-emerald-100' : 'text-brand-200 hover:text-brand-400 hover:bg-brand-50'
                  }`}
                  title={isLearned ? "Отметить как невыученное" : "Отметить как выученное"}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredWords.length === 0 && (
          <div className="text-center py-20 text-brand-400">
            Слова не найдены.
          </div>
        )}
      </div>
    </div>
  );
};
