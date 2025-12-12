import React from 'react';
import type { Product } from '../types';

interface ResultProps {
  product: Product;
  reason: string;
  archetype?: string; // Tornando opcional para compatibilidade, mas será usado
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ product, reason, archetype, onRestart }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-12 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 text-center animate-fade-in relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-500 font-bold text-xs md:text-sm tracking-wide uppercase">Análise Concluída</span>
        </div>
        
        {archetype && (
            <h3 className="text-xl md:text-2xl font-light text-neutral-400 mb-2 uppercase tracking-widest">
                SEU ARQUÉTIPO É:
            </h3>
        )}

        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 uppercase leading-tight">
          <span className="text-gold-gradient">{archetype || "Perfil Identificado"}</span>
        </h2>
        
        <div className="bg-neutral-800/30 border-l-4 border-amber-500 p-6 md:p-8 rounded-r-xl text-left mb-10 shadow-inner">
           <h4 className="font-bold text-amber-500 uppercase text-xs tracking-widest mb-3">Diagnóstico do Algoritmo</h4>
           <p className="text-neutral-200 text-base md:text-lg leading-relaxed font-medium">"{reason}"</p>
        </div>
        
        <p className="text-sm text-neutral-400 mb-4 uppercase tracking-wider font-semibold">
          Ferramenta Recomendada para você:
        </p>

        <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700 flex flex-col md:flex-row items-center gap-8 text-left mb-10 transition-all hover:border-amber-500/30 group">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg brightness-90 group-hover:brightness-100 transition-all duration-500" 
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{product.title}</h3>
            <p className="text-neutral-400 leading-relaxed text-sm">{product.description}</p>
          </div>
        </div>
  
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full md:max-w-md mx-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-lg py-5 px-8 rounded-full shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 transition-all duration-300 transform hover:scale-105"
        >
          ACESSAR MEU PLANO
        </a>

        {/* Bonus Section */}
        <div className="my-10 border-t border-neutral-800 pt-8 opacity-80 hover:opacity-100 transition-opacity">
            <p className="text-neutral-500 text-sm mb-4">Quer ir além?</p>
            <a 
                href="https://app.ketocarnivoro.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold text-sm uppercase tracking-wide transition-colors"
            >
                Conheça a Keto Carnívora AI
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
        </div>
        
        <button
          onClick={onRestart}
          className="text-neutral-600 hover:text-neutral-400 transition-colors text-xs uppercase tracking-widest"
        >
          Refazer Análise
        </button>
      </div>
    </div>
  );
};

export default Result;