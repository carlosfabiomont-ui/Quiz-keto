import React from 'react';
import type { Product } from '../types';

interface ResultProps {
  product: Product;
  reason: string;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ product, reason, onRestart }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-12 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 text-center animate-fade-in relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-500 font-bold text-sm tracking-wide uppercase">Recomendação Oficial</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Seu Plano Ideal
        </h2>
        <p className="text-lg text-neutral-400 mb-10">
          Baseado no seu perfil, este é o guia para sua transformação:
        </p>
        
        <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700 flex flex-col md:flex-row items-center gap-8 text-left mb-10 transition-all hover:border-amber-500/30">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg brightness-90" 
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gold-gradient mb-3">{product.title}</h3>
            <p className="text-neutral-300 leading-relaxed text-sm md:text-base">{product.description}</p>
          </div>
        </div>
        
        <div className="bg-neutral-800/30 border-l-4 border-amber-500 p-6 rounded-r-xl text-left mb-10">
           <h4 className="font-bold text-amber-500 uppercase text-xs tracking-widest mb-2">Análise do Especialista</h4>
           <p className="text-neutral-200 italic font-medium">"{reason}"</p>
        </div>
  
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full md:max-w-md mx-auto mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-lg py-5 px-8 rounded-full shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 transition-all duration-300"
        >
          ACESSAR GUIA AGORA
        </a>
        
        <button
          onClick={onRestart}
          className="text-neutral-500 font-medium text-sm hover:text-amber-500 transition-colors uppercase tracking-wider"
        >
          Refazer Quiz
        </button>
      </div>
    </div>
  );
};

export default Result;