import React, { useEffect, useState } from 'react';

const AnalyzingLoader: React.FC = () => {
  const [text, setText] = useState('Verificando biomarcadores...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 8;
        return Math.min(oldProgress + diff, 100);
      });
    }, 250);

    const texts = [
      'Analisando curva de insulina...',
      'Mapeando receptores de dopamina...',
      'Calculando flexibilidade metabólica...',
      'Identificando focos inflamatórios...',
      'Cruzando dados com dieta ancestral...',
      'Sincronizando ritmo circadiano...',
      'Gerando protocolo de reset...'
    ];

    let textIndex = 0;
    const textTimer = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setText(texts[textIndex]);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-12 bg-neutral-900 rounded-[3rem] border border-neutral-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-neutral-800">
         <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="mb-10 relative">
        <div className="w-32 h-32 rounded-full border-[6px] border-neutral-800 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-[6px] border-amber-500 border-t-transparent animate-spin"></div>
            <span className="text-3xl font-black text-amber-500">{Math.floor(progress)}%</span>
        </div>
      </div>

      <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">
        Processando Biometria
      </h2>
      <p className="text-amber-500/60 text-xs font-bold uppercase tracking-[0.3em] mb-10 text-center min-h-[1.5em] animate-pulse">
        {text}
      </p>

      <div className="grid grid-cols-4 gap-2 w-full">
         {[...Array(12)].map((_, i) => (
             <div key={i} className={`h-8 rounded-sm transition-colors duration-500 ${progress > (i * 8) ? 'bg-amber-500/20 border-amber-500/40 border' : 'bg-neutral-800'}`}></div>
         ))}
      </div>
    </div>
  );
};

export default AnalyzingLoader;