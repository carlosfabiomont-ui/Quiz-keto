import React from 'react';
import type { Question } from '../types';

interface QuizProps {
  question: Question;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const Quiz: React.FC<QuizProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
            <div>
                <span className="block text-[10px] font-black text-amber-500/50 uppercase tracking-[0.3em] mb-1">Diagnóstico Biométrico</span>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                {question.category}
                </p>
            </div>
            <span className="text-xs text-neutral-500 font-mono">STEP {questionNumber}/{totalQuestions}</span>
        </div>
        
        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(245,158,11,0.6)]"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-black text-white mb-10 leading-tight tracking-tight">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(`${option.title} - ${option.description}`)}
            className="group w-full p-6 text-left rounded-2xl border border-neutral-800 bg-neutral-950/40 hover:bg-neutral-800/60 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 relative overflow-hidden flex flex-col items-start"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="w-full flex items-center justify-between relative z-10 mb-1">
                <span className="text-lg font-bold text-neutral-200 group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                    {option.title}
                </span>
                <span className="w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/20 transition-all">
                    <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-amber-500 transition-all scale-0 group-hover:scale-100"></div>
                </span>
            </div>
            
            <p className="text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors relative z-10 leading-snug">
                {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;