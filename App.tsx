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

// Função auxiliar para disparar Pixel (segura contra erros)
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
  
  // PageView tracking is now handled in index.html to ensure early firing

  const handleStartQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      trackPixelEvent('ViewContent', { content_name: 'Quiz Start' }); // Pixel Start
      const fetchedQuestions = await generateQuizQuestions();
      setQuestions(fetchedQuestions);
      setQuizState('in-progress');
      setCurrentQuestionIndex(0);
      setAnswers([]);
    } catch (err) {
      setError('Desculpe, não foi possível carregar o quiz. Tente novamente mais tarde.');
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
      // Finalizou as perguntas
      setQuizState('analyzing'); // Mostra a barra de progresso fake
      
      try {
        // Dispara a IA em background
        const fullQuestions = questions.map((q, i) => ({ question: q.question, answer: newAnswers[i] }));
        const aiPromise = getRecommendation(fullQuestions);
        
        // Garante que a animação de "Analisando" rode por pelo menos 3 segundos para valorizar o processo
        const timerPromise = new Promise(resolve => setTimeout(resolve, 3500));

        const [result] = await Promise.all([aiPromise, timerPromise]);
        
        setRecommendation(result);
        const product = PRODUCTS.find(p => p.title.toLowerCase() === result.recommendedProductTitle.toLowerCase());
        setRecommendedProduct(product || null);
        
        // Dispara Pixel de Lead/Conclusão aqui, já que não temos mais captura de email
        trackPixelEvent('Lead', { 
            content_name: product?.title || result.recommendedProductTitle,
            currency: 'BRL',
            value: 0 
        });
        
        // Vai direto para o resultado (Página de Vendas Intermediária)
        setQuizState('finished');
        
      } catch (err) {
        setError('Desculpe, não foi possível gerar sua recomendação. Tente novamente.');
        console.error(err);
        setQuizState('start'); // Volta para o inicio em erro critico
      }
    }
  }, [answers, currentQuestionIndex, questions]);

  const handleRestart = useCallback(() => {
    setQuizState('start');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setRecommendation(null);
    setRecommendedProduct(null);
    setError(null);
  }, []);

  const renderContent = () => {
    if (isLoading && quizState === 'start') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
          <p className="mt-6 text-amber-500 font-medium animate-pulse text-lg tracking-wide">
            Iniciando diagnóstico...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-neutral-900 rounded-2xl shadow-xl border border-red-900/50">
          <p className="text-red-500 font-bold text-lg mb-2">Ops! Algo deu errado.</p>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Tentar Novamente
          </button>
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
            <div onClick={() => {
                 // Rastreia clique de compra/interesse
                 trackPixelEvent('InitiateCheckout', { 
                    content_name: recommendedProduct.title,
                    content_ids: [recommendedProduct.id] 
                 });
            }}>
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
          <div className="text-center p-4 md:p-12 bg-neutral-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-neutral-800 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
              
              {/* Header Section */}
              <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase mb-2">
                  <span className="text-gold-gradient">Keto Carnívora</span>
                </h1>
                <p className="text-amber-500/80 font-semibold tracking-widest text-sm uppercase">@keto_carnivoras_news</p>
              </div>

              <div className="mb-10 relative group rounded-2xl overflow-hidden border border-neutral-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?q=80&w=1200&auto=format&fit=crop" 
                  alt="Bife suculento fatiado em uma tábua" 
                  className="w-full h-64 md:h-80 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                 <div className="absolute bottom-6 left-0 right-0 z-20 text-center px-4">
                    <p className="text-neutral-200 text-lg md:text-xl font-light italic">
                        "Transforme sua vida através da alimentação ancestral."
                    </p>
                 </div>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                Descubra o Seu Arquétipo Metabólico
              </h2>
              
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                Qual estratégia Carnívora destrava a queima de gordura no <strong>SEU</strong> corpo?
                <br className="hidden md:block mt-2"/> 
                Responda a 7 perguntas rápidas e receba um plano de ação personalizado para o seu perfil biológico.
              </p>
              
              <button
                onClick={handleStartQuiz}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-black transition-all duration-200 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105"
              >
                <span>DESCOBRIR MEU PLANO</span>
                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
              
              <p className="mt-6 text-xs text-neutral-600 uppercase tracking-widest">Tempo estimado: 45 segundos</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 py-8">
       <div className="w-full max-w-5xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;