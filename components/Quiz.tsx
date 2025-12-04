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
    <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
            <p className="text-sm font-semibold text-amber-500 uppercase tracking-widest">
            Questão {questionNumber}
            </p>
            <span className="text-xs text-neutral-500">{totalQuestions - questionNumber} restantes</span>
        </div>
        
        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            // Envia o título e a descrição combinados para o sistema de recomendação ter o contexto completo
            onClick={() => onAnswer(`${option.title} - ${option.description}`)}
            className="group w-full p-5 text-left rounded-xl border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 relative overflow-hidden flex flex-col items-start"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="w-full flex items-center justify-between relative z-10 mb-1">
                <span className="text-lg font-bold text-neutral-200 group-hover:text-amber-400 transition-colors">
                    {option.title}
                </span>
                <span className="w-6 h-6 rounded-full border border-neutral-600 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/20 shrink-0 ml-3">
                    <svg className="w-3 h-3 text-transparent group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </span>
            </div>
            
            <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors relative z-10">
                {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;