import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { Poem } from '../data/poems';

interface PoemsProps {
  poems: Poem[];
}

export const Poems: React.FC<PoemsProps> = ({ poems }) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid gap-8">
        {poems.map((poem, index) => (
          <motion.div
            key={poem.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-900 text-white rounded-xl flex items-center justify-center shadow-lg">
              <Quote className="w-5 h-5" />
            </div>
            
            <h3 className="text-xl font-serif font-bold text-brand-900 mb-4 border-b border-brand-50 pb-2">
              {poem.title}
            </h3>
            
            <div className="space-y-1">
              {poem.text.split('\n').map((line, i) => {
                // Highlight words between **
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={i} className="text-lg text-brand-700 leading-relaxed">
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <span key={j} className="font-mono font-bold text-brand-900 bg-brand-100 px-1.5 py-0.5 rounded mx-0.5">
                            {part.slice(2, -2)}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-brand-900 text-white rounded-3xl text-center">
        <h4 className="text-xl font-serif mb-2">Совет по запоминанию</h4>
        <p className="opacity-80">
          Смешные ассоциации и рифмы помогают мозгу быстрее закрепить новые слова. 
          Попробуйте прочитать эти стихи вслух несколько раз!
        </p>
      </div>
    </div>
  );
};
