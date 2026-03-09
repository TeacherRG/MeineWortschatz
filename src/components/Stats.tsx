import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Target, Award, Zap } from 'lucide-react';
import { Achievement } from '../types';

interface StatsProps {
  points: number;
  level: number;
  learnedCount: number;
  achievements: Achievement[];
  unlockedAchievementIds: string[];
}

export const Stats: React.FC<StatsProps> = ({ 
  points, 
  level, 
  learnedCount, 
  achievements, 
  unlockedAchievementIds 
}) => {
  const nextLevelPoints = (level + 1) * 1000;
  const progressToNextLevel = (points % 1000) / 10;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Level Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-brand-300 text-sm uppercase tracking-wider font-bold mb-1">Ваш уровень</p>
              <h2 className="text-5xl font-serif font-bold">{level} Уровень</h2>
            </div>
            <div className="text-right">
              <p className="text-brand-300 text-sm uppercase tracking-wider font-bold mb-1">Всего очков</p>
              <p className="text-3xl font-mono font-bold">{points}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Прогресс до {level + 1} уровня</span>
              <span>{points % 1000} / 1000 XP</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                className="h-full bg-brand-400"
              />
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-500 font-medium">Выучено слов</p>
            <p className="text-2xl font-bold text-brand-900">{learnedCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-500 font-medium">Точность</p>
            <p className="text-2xl font-bold text-brand-900">85%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-brand-500 font-medium">Достижения</p>
            <p className="text-2xl font-bold text-brand-900">{unlockedAchievementIds.length} / {achievements.length}</p>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="text-2xl font-serif font-bold text-brand-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-600" />
          Достижения
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedAchievementIds.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnlocked 
                    ? 'bg-white border-brand-200 shadow-md' 
                    : 'bg-brand-50/50 border-brand-100 opacity-60 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  isUnlocked ? 'bg-brand-900 text-white' : 'bg-brand-200 text-brand-400'
                }`}>
                  <span className="text-xl">{achievement.icon}</span>
                </div>
                <h4 className="font-bold text-brand-900 mb-1">{achievement.title}</h4>
                <p className="text-sm text-brand-600">{achievement.description}</p>
                
                {!isUnlocked && (
                  <div className="mt-4 h-1.5 bg-brand-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-400" 
                      style={{ width: `${Math.min(100, (learnedCount / achievement.requirement) * 100)}%` }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
