import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Library, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  BrainCircuit,
  ArrowLeft,
  Plus,
  Sparkles
} from 'lucide-react';
import { INITIAL_SETS } from './data/vocabulary';
import { AppMode, WordSet } from './types';
import { Flashcards } from './components/Flashcards';
import { WordList } from './components/WordList';
import { Quiz } from './components/Quiz';
import { Poems } from './components/Poems';
import { VOCABULARY_POEMS } from './data/poems';

export default function App() {
  const [mode, setMode] = useState<AppMode>('sets');
  const [selectedSet, setSelectedSet] = useState<WordSet | null>(null);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());

  // Load progress from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('wortschatz_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLearnedWords(new Set(parsed));
        }
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('wortschatz_progress', JSON.stringify(Array.from(learnedWords)));
  }, [learnedWords]);

  const toggleLearned = (wordId: string, learned: boolean) => {
    setLearnedWords(prev => {
      const next = new Set(prev);
      if (learned) next.add(wordId);
      else next.delete(wordId);
      return next;
    });
  };

  const handleSetSelect = (set: WordSet) => {
    setSelectedSet(set);
    setMode('list');
  };

  const renderContent = () => {
    if (mode === 'sets') {
      return (
        <div className="max-w-6xl mx-auto p-6">
          <header className="mb-12">
            <h1 className="text-5xl font-serif font-bold text-brand-900 mb-4">WortSchatz</h1>
            <p className="text-brand-500 text-lg max-w-2xl">
              Изучайте немецкую лексику с помощью интерактивных карточек и умных квизов.
              Выберите набор слов ниже, чтобы начать.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_SETS.map((set) => (
              <motion.div
                key={set.id}
                whileHover={{ y: -5 }}
                className="group bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
                onClick={() => handleSetSelect(set)}
              >
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">{set.title}</h3>
                <p className="text-brand-500 mb-8 flex-grow">{set.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-brand-50">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-brand-400">{set.words.length} слов</span>
                    <span className="text-xs text-emerald-600 font-medium">
                      {set.words.filter(w => learnedWords.has(w.id)).length} выучено
                    </span>
                  </div>
                  <div className="flex items-center text-brand-900 font-semibold gap-1">
                    Изучать <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="bg-brand-100/30 border-2 border-dashed border-brand-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center group cursor-not-allowed">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Plus className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-400">Добавить набор</h3>
              <p className="text-brand-400 text-sm mt-2">Скоро будет доступно</p>
            </div>
          </div>
        </div>
      );
    }

    if (!selectedSet) return null;

    return (
      <div className="min-h-screen pb-20">
        <nav className="sticky top-0 z-50 glass border-b border-brand-100 px-6 py-4 mb-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMode('sets')}
                className="p-2 hover:bg-brand-50 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="font-serif font-bold text-xl">{selectedSet.title}</h2>
                <p className="text-xs text-brand-400 uppercase tracking-wider">{mode}</p>
              </div>
            </div>
            
            <div className="flex bg-brand-100 p-1 rounded-2xl">
              <button
                onClick={() => setMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'list' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-500 hover:text-brand-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Список</span>
              </button>
              <button
                onClick={() => setMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'cards' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-500 hover:text-brand-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Карточки</span>
              </button>
              <button
                onClick={() => setMode('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'quiz' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-500 hover:text-brand-700'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span className="hidden sm:inline">Квиз</span>
              </button>
              <button
                onClick={() => setMode('poems')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'poems' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-500 hover:text-brand-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Стихи</span>
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'list' && (
              <WordList 
                words={selectedSet.words} 
                learnedWords={learnedWords}
                onToggleLearned={toggleLearned}
              />
            )}
            {mode === 'cards' && (
              <Flashcards 
                words={selectedSet.words} 
                onFinish={() => setMode('quiz')}
                onMarkLearned={(id) => toggleLearned(id, true)}
                learnedWords={learnedWords}
              />
            )}
            {mode === 'quiz' && (
              <Quiz 
                words={selectedSet.words} 
                onFinish={() => setMode('sets')}
                onCorrectAnswer={(id) => toggleLearned(id, true)}
              />
            )}
            {mode === 'poems' && <Poems poems={VOCABULARY_POEMS} />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen selection:bg-brand-900 selection:text-white">
      {renderContent()}
      
      {mode === 'sets' && (
        <footer className="max-w-6xl mx-auto p-12 mt-12 border-t border-brand-100 text-center">
          <p className="text-brand-400 text-sm">
            &copy; 2024 WortSchatz. Разработано для эффективного изучения языков.
          </p>
        </footer>
      )}
    </div>
  );
}
