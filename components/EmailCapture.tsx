import React, { useState } from 'react';

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-12 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Análise 100% Concluída!
            </h2>
            
            <p className="text-lg text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
                Nós identificamos o seu Arquétipo Metabólico e selecionamos a estratégia perfeita para o seu caso.
                <br /><br />
                <span className="text-white font-medium">Digite seu melhor e-mail abaixo para liberar seu resultado imediatamente.</span>
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Seu melhor e-mail aqui..."
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        className="w-full px-6 py-4 bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-lg"
                    />
                    {error && <p className="text-red-500 text-sm mt-2 text-left ml-2">{error}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-lg py-4 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 transition-all duration-300 transform hover:scale-[1.02]"
                >
                    VER MEU RESULTADO AGORA
                </button>
                
                <p className="mt-4 text-xs text-neutral-600 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    Seus dados estão 100% seguros. Livre de spam.
                </p>
            </form>
        </div>
    </div>
  );
};

export default EmailCapture;