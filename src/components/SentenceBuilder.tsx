import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Sparkles, Trophy, Volume2, ArrowRight } from 'lucide-react';
import { Word } from '../types';
import { speakGerman } from '../services/ttsService';

interface SentenceBuilderProps {
  words: Word[];
  onFinish: () => void;
  onCorrect: (wordId: string) => void;
}

export function SentenceBuilder({ words, onFinish, onCorrect }: SentenceBuilderProps) {
  // Filter words that have examples
  const wordsWithExamples = useMemo(() => words.filter(w => w.example), [words]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentWord = wordsWithExamples[currentIndex];
  
  // Clean sentence: remove punctuation and split into words
  const targetSentence = useMemo(() => {
    if (!currentWord?.example) return [];
    return currentWord.example
      .replace(/[.,!?;:]/g, '')
      .split(' ')
      .filter(w => w.length > 0);
  }, [currentWord]);

  useEffect(() => {
    if (targetSentence.length > 0) {
      setShuffledWords([...targetSentence].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setIsCorrect(null);
      setShowHint(false);
    }
  }, [targetSentence]);

  const handleWordClick = (word: string, index: number) => {
    if (isCorrect === true) return;
    
    setSelectedWords(prev => [...prev, word]);
    setShuffledWords(prev => prev.filter((_, i) => i !== index));
    setIsCorrect(null);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isCorrect === true) return;

    setSelectedWords(prev => prev.filter((_, i) => i !== index));
    setShuffledWords(prev => [...prev, word].sort(() => Math.random() - 0.5));
    setIsCorrect(null);
  };

  const handleSpeak = async () => {
    if (!currentWord?.example || isPlaying) return;
    setIsPlaying(true);
    await speakGerman(currentWord.example);
    setIsPlaying(false);
  };

  const checkSentence = () => {
    const isMatch = selectedWords.join(' ') === targetSentence.join(' ');
    setIsCorrect(isMatch);
    
    if (isMatch) {
      onCorrect(currentWord.id);
      setStreak(prev => prev + 1);
      handleSpeak(); // Auto-play audio when correct
      
      setTimeout(() => {
        if (currentIndex < wordsWithExamples.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCompleted(true);
        }
      }, 2500);
    } else {
      setStreak(0);
    }
  };

  const resetCurrent = () => {
    setShuffledWords([...targetSentence].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsCorrect(null);
  };

  const progress = ((currentIndex) / wordsWithExamples.length) * 100;

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <HelpCircle className="w-16 h-16 text-brand-200 mb-4" />
        <h3 className="text-2xl font-serif font-bold text-brand-900">Нет примеров</h3>
        <p className="text-brand-500 mt-2">В этом наборе нет слов с примерами предложений.</p>
        <button 
          onClick={onFinish}
          className="mt-8 px-6 py-3 bg-brand-900 text-white rounded-2xl font-medium"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl border border-brand-100 shadow-xl"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">Блестяще!</h2>
          <p className="text-brand-500 mb-8">Вы успешно составили все предложения и заработали максимум опыта.</p>
          <div className="bg-brand-50 p-6 rounded-2xl mb-8 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-xs font-bold text-brand-400 uppercase">Опыт</p>
              <p className="text-2xl font-bold text-brand-900">+{wordsWithExamples.length * 75}</p>
            </div>
            <div className="w-px h-10 bg-brand-200" />
            <div className="text-center">
              <p className="text-xs font-bold text-brand-400 uppercase">Стрик</p>
              <p className="text-2xl font-bold text-brand-900">{streak}</p>
            </div>
          </div>
          <button 
            onClick={onFinish}
            className="w-full py-4 bg-brand-900 text-white rounded-2xl font-bold text-lg hover:bg-brand-800 transition-colors"
          >
            Завершить игру
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Прогресс</span>
          <span className="text-xs font-bold text-brand-900">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Конструктор ситуаций</span>
          <h2 className="text-2xl font-serif font-bold text-brand-900">Соберите предложение</h2>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-bold border border-amber-100"
            >
              🔥 {streak}
            </motion.div>
          )}
          <div className="text-sm font-medium text-brand-500 bg-brand-50 px-4 py-2 rounded-full">
            {currentIndex + 1} / {wordsWithExamples.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-brand-100 shadow-sm p-8 mb-8 relative overflow-hidden">
        {/* Success Particles Overlay */}
        <AnimatePresence>
          {isCorrect === true && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute"
                >
                  <Sparkles className={`w-6 h-6 ${i % 2 === 0 ? 'text-emerald-400' : 'text-amber-400'}`} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8 text-center">
          <p className="text-brand-400 text-sm mb-2 uppercase tracking-tighter font-bold">Перевод:</p>
          <p className="text-xl font-medium text-brand-900 mb-2">{currentWord.translation}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-brand-500 italic">{currentWord.german}</span>
            <button 
              onClick={handleSpeak}
              disabled={isPlaying}
              className={`p-1.5 rounded-full transition-colors ${isPlaying ? 'bg-brand-100 text-brand-400' : 'hover:bg-brand-50 text-brand-400 hover:text-brand-900'}`}
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {/* Target Area */}
        <div className={`min-h-[120px] p-6 rounded-2xl border-2 border-dashed transition-all duration-300 mb-8 flex flex-wrap gap-3 items-center justify-center ${
          isCorrect === true ? 'border-emerald-200 bg-emerald-50/30 scale-[1.02]' : 
          isCorrect === false ? 'border-rose-200 bg-rose-50/30' : 
          'border-brand-100 bg-brand-50/20'
        }`}>
          <AnimatePresence mode="popLayout">
            {selectedWords.map((word, index) => (
              <motion.button
                key={`${word}-${index}`}
                layout
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -10 }}
                onClick={() => handleRemoveWord(word, index)}
                className={`px-4 py-2 bg-white border rounded-xl shadow-sm text-brand-900 font-medium transition-colors ${
                  isCorrect === true ? 'border-emerald-200 text-emerald-700' : 'border-brand-200 hover:border-brand-400'
                }`}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
          {selectedWords.length === 0 && (
            <p className="text-brand-300 italic">Нажимайте на слова ниже, чтобы составить фразу</p>
          )}
        </div>

        {/* Source Area */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <AnimatePresence mode="popLayout">
            {shuffledWords.map((word, index) => (
              <motion.button
                key={`${word}-${index}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWordClick(word, index)}
                className="px-4 py-2 bg-brand-50 text-brand-700 rounded-xl font-medium hover:bg-brand-100 transition-colors"
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={resetCurrent}
              className="p-3 text-brand-500 hover:bg-brand-50 rounded-xl transition-colors"
              title="Сбросить"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className={`p-3 rounded-xl transition-colors ${showHint ? 'bg-brand-900 text-white' : 'text-brand-500 hover:bg-brand-50'}`}
              title="Подсказка"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow max-w-xs w-full">
            <button
              onClick={checkSentence}
              disabled={selectedWords.length === 0 || isCorrect === true}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isCorrect === true ? 'bg-emerald-600 text-white' :
                isCorrect === false ? 'bg-rose-600 text-white' :
                'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isCorrect === true ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Верно!
                </>
              ) : isCorrect === false ? (
                <>
                  <XCircle className="w-5 h-5" />
                  Попробовать снова
                </>
              ) : (
                <>
                  Проверить
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-900 text-center italic overflow-hidden"
            >
              {currentWord.example}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
          <h4 className="font-bold text-brand-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Совет
          </h4>
          <p className="text-sm text-brand-600">
            В немецком языке глагол обычно стоит на втором месте в повествовательном предложении. 
            Обращайте внимание на заглавные буквы — они всегда в начале предложения или у существительных.
          </p>
        </div>
        <div className="bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
          <h4 className="font-bold text-brand-900 mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-400" />
            Награда
          </h4>
          <p className="text-sm text-brand-600">
            За каждое правильно составленное предложение вы получаете 75 очков опыта! 
            Стрик 🔥 увеличивает вашу уверенность в языке.
          </p>
        </div>
      </div>
    </div>
  );
}
