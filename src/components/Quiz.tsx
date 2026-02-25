import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, RefreshCcw, Check, X } from 'lucide-react';
import { Word } from '../types';

interface QuizProps {
  words: Word[];
  onFinish: () => void;
  onCorrectAnswer: (id: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ words, onFinish, onCorrectAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      const otherTranslations = words
        .filter(w => w.id !== currentWord.id)
        .map(w => w.translation);
      
      const shuffled = [...otherTranslations]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allOptions = [...shuffled, currentWord.translation]
        .sort(() => 0.5 - Math.random());
      
      setOptions(allOptions);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [currentIndex, words]);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === currentWord.translation;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
      onCorrectAnswer(currentWord.id);
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8"
      >
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Trophy className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-serif mb-2">Квиз завершен!</h2>
        <p className="text-brand-500 mb-8">
          Ваш результат: <span className="text-brand-900 font-bold">{score}</span> из {words.length}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setShowResult(false);
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-brand-200 text-brand-600 font-medium hover:bg-brand-50 transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            Попробовать снова
          </button>
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-900 text-white font-medium hover:bg-brand-800 transition-all shadow-lg"
          >
            К наборам
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-brand-500 mb-2">
          <span>Вопрос {currentIndex + 1} из {words.length}</span>
          <span>Счет: {score}</span>
        </div>
        <div className="h-1 w-full bg-brand-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-900"
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-12 rounded-3xl border border-brand-100 shadow-sm mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-400 mb-4 block">
          Переведите это слово
        </span>
        <h2 className="text-4xl font-serif text-brand-900">
          {currentWord.german}
        </h2>
      </div>

      <div className="grid gap-4">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(option)}
            disabled={!!selectedOption}
            className={`w-full p-5 rounded-2xl text-left font-medium transition-all border-2 ${
              selectedOption === option
                ? option === currentWord.translation
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-rose-50 border-rose-500 text-rose-700'
                : selectedOption && option === currentWord.translation
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'bg-white border-brand-100 hover:border-brand-300 text-brand-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{option}</span>
              {selectedOption === option && (
                option === currentWord.translation ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
