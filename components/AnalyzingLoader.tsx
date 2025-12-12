import React, { useEffect, useState } from 'react';

const AnalyzingLoader: React.FC = () => {
  const [text, setText] = useState('Processando respostas...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula a barra de progresso
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    // Troca os textos para parecer científico
    const texts = [
      'Calculando taxa metabólica basal...',
      'Identificando restrições alimentares...',
      'Mapeando perfil comportamental...',
      'Gerando estratégia personalizada...',
      'Finalizando diagnóstico...'
    ];

    let textIndex = 0;
    const textTimer = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setText(texts[textIndex]);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-8 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl">
      <div className="mb-8 relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-amber-500 text-lg">
          {Math.floor(progress)}%
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 animate-pulse text-center">
        Analisando seu Perfil...
      </h2>
      <p className="text-neutral-400 text-sm uppercase tracking-widest mb-8 text-center min-h-[1.5em]">
        {text}
      </p>

      <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden relative">
        <div 
           className="bg-amber-500 h-full rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
           style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AnalyzingLoader;