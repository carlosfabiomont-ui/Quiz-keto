import React, { useState, useCallback } from 'react';
import { generateQuizQuestions, getRecommendation } from './services/geminiService';
import type { Question, Product, Recommendation } from './types';
import { PRODUCTS } from './constants';
import Quiz from './components/Quiz';
import Result from './components/Result';
import LoadingSpinner from './components/LoadingSpinner';
import AnalyzingLoader from './components/AnalyzingLoader';

// Extendendo o Window para suportar fbq
declare global {
  interface Window {
    fbq: any;
  }
}

const trackPixelEvent = (eventName: string, data?: any) => {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, data);
    } else {
      console.log(`[Pixel Simulated] Event: ${eventName}`, data);
    }
  } catch (e) {
    console.warn('Pixel Error', e);
  }
};

type QuizState = 'start' | 'in-progress' | 'analyzing' | 'finished';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      trackPixelEvent('ViewContent', { content_name: 'Dopamine Quiz Start' });
      const fetchedQuestions = await generateQuizQuestions();
      setQuestions(fetchedQuestions);
      setQuizState('in-progress');
      setCurrentQuestionIndex(0);
      setAnswers([]);
    } catch (err) {
      setError('Falha na conexão com o servidor de diagnóstico.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswer = useCallback(async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizState('analyzing');
      
      try {
        const fullQuestions = questions.map((q, i) => ({ question: q.question, answer: newAnswers[i] }));
        const aiPromise = getRecommendation(fullQuestions);
        const timerPromise = new Promise(resolve => setTimeout(resolve, 3800));

        const [result] = await Promise.all([aiPromise, timerPromise]);
        
        setRecommendation(result);
        const product = PRODUCTS.find(p => p.title.toLowerCase() === result.recommendedProductTitle.toLowerCase());
        setRecommendedProduct(product || null);
        
        trackPixelEvent('Lead', { 
            content_name: product?.title || result.recommendedProductTitle
        });
        
        setQuizState('finished');
      } catch (err) {
        setError('Erro ao processar diagnóstico biológico.');
        setQuizState('start');
      }
    }
  }, [answers, currentQuestionIndex, questions]);

  const handleRestart = useCallback(() => {
    setQuizState('start');
    setAnswers([]);
    setRecommendation(null);
    setRecommendedProduct(null);
  }, []);

  const renderContent = () => {
    if (isLoading && quizState === 'start') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
          <p className="mt-6 text-amber-500 font-bold animate-pulse text-lg tracking-widest uppercase">
            Acessando Protocolos...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-neutral-900 rounded-2xl border border-red-900/50">
          <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
          <button onClick={handleRestart} className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg uppercase text-sm">Reiniciar Sistema</button>
        </div>
      );
    }

    switch (quizState) {
      case 'in-progress':
        return (
          <Quiz
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        );
      case 'analyzing':
        return <AnalyzingLoader />;
      case 'finished':
        if (recommendedProduct && recommendation) {
          return (
            <div onClick={() => trackPixelEvent('InitiateCheckout', { content_name: recommendedProduct.title })}>
                <Result 
                    product={recommendedProduct} 
                    reason={recommendation.reason} 
                    archetype={recommendation.archetype}
                    onRestart={handleRestart} 
                />
            </div>
          );
        }
        return null;
      case 'start':
      default:
        return (
          <div className="text-center p-6 md:p-12 bg-neutral-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-neutral-800 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
              
              <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                <span className="text-amber-500 text-xs font-black tracking-[0.2em] uppercase">Protocolo Biohacking 2024</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                RESET DE <br/>
                <span className="text-gold-gradient">DOPAMINA</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-300 font-light mb-10 leading-relaxed max-w-2xl mx-auto">
                Descubra por que sua energia <span className="text-white font-bold italic">morre</span> à tarde e como destravar sua queima de gordura em 45 segundos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
                {[
                  { label: "Brain Fog", desc: "Elimine a névoa mental" },
                  { label: "Insulina", desc: "Reset hormonal total" },
                  { label: "Performance", desc: "Energia estável e limpa" }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-neutral-950/50 border border-neutral-800 rounded-2xl">
                    <div className="text-amber-500 font-black text-sm mb-1 uppercase tracking-tighter">{item.label}</div>
                    <div className="text-neutral-500 text-xs font-medium uppercase">{item.desc}</div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleStartQuiz}
                className="group relative inline-flex items-center justify-center px-16 py-6 text-xl font-black text-black transition-all duration-300 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-[1.03] active:scale-95"
              >
                <span>INICIAR DIAGNÓSTICO</span>
                <svg className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Sistema Online</span>
                <span className="opacity-30">|</span>
                <span>Análise Baseada em Biohacking</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-5xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;