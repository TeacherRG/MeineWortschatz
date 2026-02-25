import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Check, RotateCw, Volume2 } from 'lucide-react';
import { Word } from '../types';

interface FlashcardsProps {
  words: Word[];
  onFinish: () => void;
  onMarkLearned: (id: string) => void;
  learnedWords: Set<string>;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ words, onFinish, onMarkLearned, learnedWords }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentWord = words[currentIndex];

  const handleNext = (known: boolean) => {
    if (known) {
      onMarkLearned(currentWord.id);
    }
    setDirection(1);
    if (currentIndex < words.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setDirection(0);
      }, 200);
    } else {
      onFinish();
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-sm text-brand-500 mb-2">
          <span>Прогресс</span>
          <span>{currentIndex + 1} / {words.length}</span>
        </div>
        <div className="h-1 w-full bg-brand-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-900"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-md aspect-[4/3] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: direction * 100, opacity: 0, rotateY: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative preserve-3d transition-transform duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div 
                className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border border-brand-100"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <span className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-4">
                  {currentWord.category}
                </span>
                <h2 className="text-4xl font-serif text-center mb-6">
                  {currentWord.german}
                </h2>
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(currentWord.german); }}
                  className="p-3 rounded-full hover:bg-brand-50 transition-colors"
                >
                  <Volume2 className="w-6 h-6 text-brand-500" />
                </button>
                <p className="absolute bottom-6 text-sm text-brand-400 italic">Нажмите, чтобы перевернуть</p>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-brand-900 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 rotate-y-180"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <span className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">
                  Перевод
                </span>
                <h2 className="text-4xl font-serif text-center mb-4">
                  {currentWord.translation}
                </h2>
                {currentWord.example && (
                  <p className="text-center text-brand-200 italic mt-4 px-4">
                    "{currentWord.example}"
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-12">
        <button
          onClick={() => handleNext(false)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-brand-200 text-brand-600 font-medium hover:bg-brand-50 transition-all shadow-sm"
        >
          <RotateCw className="w-5 h-5" />
          Еще учу
        </button>
        <button
          onClick={() => handleNext(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-900 text-white font-medium hover:bg-brand-800 transition-all shadow-lg"
        >
          <Check className="w-5 h-5" />
          Знаю это
        </button>
      </div>

      <button 
        onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}
        className="mt-8 text-brand-400 hover:text-brand-600 flex items-center gap-1 text-sm transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Начать заново
      </button>
    </div>
  );
};
