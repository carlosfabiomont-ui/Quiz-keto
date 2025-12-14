import React from 'react';
import type { Product } from '../types';

interface ResultProps {
  product: Product;
  reason: string;
  archetype?: string;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ product, reason, archetype, onRestart }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-10 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 text-center animate-fade-in relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Banner de Oferta Desbloqueada */}
        <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-500/30 rounded-lg p-3 mb-8 inline-flex items-center gap-2 animate-pulse">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-400 text-xs md:text-sm font-bold uppercase tracking-wider">
                Condição Especial Desbloqueada
            </span>
        </div>

        {archetype && (
            <h3 className="text-sm md:text-base font-medium text-neutral-400 mb-2 uppercase tracking-widest">
                Seu Arquétipo Metabólico:
            </h3>
        )}

        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 uppercase leading-tight">
          <span className="text-gold-gradient">{archetype || "Perfil Identificado"}</span>
        </h2>
        
        {/* Caixa da VSL (Carta de Vendas) */}
        <div className="bg-neutral-800/40 border-l-4 border-amber-500 p-6 md:p-8 rounded-r-xl text-left mb-8 shadow-inner">
           <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <h4 className="font-bold text-amber-500 uppercase text-xs tracking-widest">Análise do Especialista</h4>
           </div>
           <p className="text-neutral-200 text-base md:text-lg leading-relaxed font-medium italic">"{reason}"</p>
        </div>
        
        <div className="flex flex-col items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-amber-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
            Solução Recomendada para o seu Caso:
            </p>
        </div>

        {/* Card do Produto */}
        <div className="bg-neutral-950/50 rounded-2xl p-6 border border-amber-500/20 flex flex-col md:flex-row items-center gap-6 text-left mb-8 transition-all hover:border-amber-500/50 group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
            OFERTA DO QUIZ
          </div>
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full md:w-40 h-40 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors">{product.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">{product.description}</p>
            <div className="flex items-center gap-2 text-xs text-green-400 font-bold uppercase">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Compatibilidade: 98%
            </div>
          </div>
        </div>
  
        {/* Botão de Ação Forte */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full md:max-w-md mx-auto bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-black text-xl py-5 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 -skew-x-12 origin-left"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
            VER OFERTA COM DESCONTO
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        </a>

        {/* Selos de Garantia (Redução de Ansiedade) */}
        <div className="mt-6 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span className="text-[10px] font-bold text-neutral-300 uppercase">Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-[10px] font-bold text-neutral-300 uppercase">Garantia de 7 Dias</span>
            </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-neutral-800">
             <button
                onClick={onRestart}
                className="text-neutral-600 hover:text-neutral-400 transition-colors text-xs uppercase tracking-widest hover:underline"
                >
                Refazer Análise
            </button>
        </div>
      </div>
    </div>
  );
};

export default Result;