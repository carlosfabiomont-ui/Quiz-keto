import { GoogleGenAI, Type } from "@google/genai";
import type { Question, Recommendation, QuestionWithAnswer } from '../types';

/**
 * Recupera a chave de API de forma segura em qualquer ambiente.
 */
function getApiKey(): string {
  let apiKey = "";
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      apiKey = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}

  if (!apiKey) {
    try {
      // @ts-ignore
      if (typeof process !== "undefined" && process.env && process.env.API_KEY) {
        // @ts-ignore
        apiKey = process.env.API_KEY;
      }
    } catch (e) {}
  }
  return apiKey;
}

function getAiClient(): GoogleGenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key não encontrada.");
  }
  return new GoogleGenAI({ apiKey });
}

// Perguntas FIXAS baseadas no script de alta conversão
const FIXED_QUESTIONS: Question[] = [
  {
    question: "Para começarmos, qual é o seu gênero biológico? (Isso nos ajuda a calcular suas necessidades basais de proteína).",
    options: [
      { title: "Homem", description: "Foco em otimização hormonal e ganho muscular." },
      { title: "Mulher", description: "Foco em regulação metabólica e bem-estar." }
    ]
  },
  {
    question: "Qual é a sua experiência atual com a alimentação Carnívora ou Low Carb?",
    options: [
      { title: "Totalmente iniciante", description: "Nunca fiz, ou tentei e desisti em poucos dias." },
      { title: "Intermediário", description: "Já faço, mas sinto que posso otimizar ou estou estagnado." },
      { title: "Veterano", description: "Sigo a dieta há meses, mas estou ficando entediado com as refeições." }
    ]
  },
  {
    question: "Seja honesto(a): O que mais te impede de ter consistência na dieta hoje?",
    options: [
      { title: "Tempo e Bagunça", description: "Chego cansado(a) e não tenho energia para fritar bifes e limpar o fogão." },
      { title: "Falta de Clareza", description: "Fico confuso(a) com tanta informação. Não sei o que comer ou como começar." },
      { title: "Paladar Monótono", description: "Sinto falta de sabores diferentes, texturas crocantes e variedade." }
    ]
  },
  {
    question: "Como é a sua rotina de preparo das refeições?",
    options: [
      { title: "Praticidade Máxima", description: "Se pudesse apertar um botão e a comida aparecer pronta, seria ideal." },
      { title: "Preciso de Regras", description: "Se eu tiver um cardápio dizendo 'coma isso na segunda-feira', eu sigo." },
      { title: "Cozinheiro Criativo", description: "Gosto de cozinhar e testar receitas novas para minha família." }
    ]
  },
  {
    question: "Além do peso, o que mais você quer resolver?",
    options: [
      { title: "Economia e Tempo", description: "Quero parar de gastar com delivery por falta de tempo de cozinhar." },
      { title: "Desinflamar e Vícios", description: "Quero acabar com a compulsão por doces e carboidratos." },
      { title: "Social e Família", description: "Quero manter a dieta em eventos sociais e jantares sem sofrer." }
    ]
  },
  {
    question: "Qual a sua faixa etária?",
    options: [
      { title: "18-29 anos", description: "Fase de construção e energia." },
      { title: "30-39 anos", description: "Fase de consolidação e rotina." },
      { title: "40-49 anos", description: "Fase de manutenção e cuidado." },
      { title: "50-59 anos", description: "Fase de renovação metabólica." },
      { title: "60+ anos", description: "Fase de priorização da longevidade." }
    ]
  },
  {
    question: "Qual é a sua meta principal?",
    options: [
      { title: "Perder 5kg a 10kg", description: "Ajuste rápido e definição." },
      { title: "Perder 10kg a 20kg", description: "Mudança significativa de composição corporal." },
      { title: "Perder mais de 20kg", description: "Transformação total de saúde." },
      { title: "Ganho de Massa/Saúde", description: "Não foco em peso, mas em vitalidade e músculos." }
    ]
  }
];

export async function generateQuizQuestions(): Promise<Question[]> {
    // Retorna as perguntas fixas do script imediatamente
    return new Promise((resolve) => {
        setTimeout(() => resolve(FIXED_QUESTIONS), 800); // Pequeno delay artificial para sensação de "carregamento"
    });
}

export async function getRecommendation(userAnswers: QuestionWithAnswer[]): Promise<Recommendation> {
    const ai = getAiClient();
    const prompt = `
      Você é um Especialista Sênior em Dieta Carnívora e Copywriter de Resposta Direta.
      Analise as respostas do usuário e determine o ARQUÉTIPO dele e o PRODUTO IDEAL.
      
      IMPORTANTE: O texto de "reason" (a razão) deve seguir a estrutura:
      1. DOR (Identifique o problema principal dele).
      2. AGITAÇÃO (Mostre que se ele não resolver isso, vai falhar).
      3. SOLUÇÃO (Apresente o produto recomendado como a ÚNICA solução lógica).
      
      Mantenha o tom empático, mas firme. Use palavras como "estratégia", "protocolo", "destravar".

      OS PRODUTOS E ARQUÉTIPOS:
      
      1. PRODUTO: "80+ Receitas para Air Fryer"
         ARQUÉTIPO: "O CARNÍVORO PRAGMÁTICO"
         GATILHOS: Tempo, Bagunça, Praticidade, Odeia limpar fogão.
      
      2. PRODUTO: "Guia de 21 dias de transformação keto"
         ARQUÉTIPO: "O BUSCADOR DE REINÍCIO"
         GATILHOS: Falta de Clareza, Precisa de Regras, Desinflamar, Vícios.

      3. PRODUTO: "80+ receitas keto"
         ARQUÉTIPO: "O HEDONISTA ESTRATÉGICO"
         GATILHOS: Paladar Monótono, Criativo, Família, Tédio alimentar.

      4. PRODUTO: "Guia Definitivo: para iniciantes na dieta carnívora"
         ARQUÉTIPO: "O INICIANTE CONSCIENTE"
         GATILHOS: Iniciante, Medo de errar, Busca segurança, Quer passo a passo.

      CRITÉRIOS DE DESEMPATE (TIE-BREAKER):
      - Prioridade 1: "Guia de 21 dias" (Se quer estrutura).
      - Prioridade 2: "80+ Receitas para Air Fryer" (Se quer praticidade).
      - Prioridade 3: "Guia Definitivo" (Se é muito iniciante).

      RESPOSTAS DO USUÁRIO: ${JSON.stringify(userAnswers)}

      INSTRUÇÕES DE SAÍDA:
      Retorne um JSON com:
      - "recommendedProductTitle": O título exato do produto vencedor.
      - "archetype": O nome do Arquétipo (ex: "O CARNÍVORO PRAGMÁTICO").
      - "reason": O texto persuasivo (aprox 40-50 palavras). Seja direto. Fale diretamente com o usuário ("Você...").

      SCRIPTS BASE PARA O CAMPO "REASON" (ADAPTE PARA SER MAIS PERSUASIVO):

      [Se Air Fryer]:
      "Identifiquei que sua maior barreira não é a dieta, é a LOGÍSTICA. Você quer os benefícios, mas a bagunça e o tempo na cozinha estão drenando sua energia. Se você depender de fritar bifes todo dia, vai desistir em uma semana. A solução para o seu perfil 'Pragmático' é a automação. Com este guia de Air Fryer, você elimina a sujeira e garante refeições perfeitas em 12 minutos."

      [Se 21 Dias]:
      "Você está sofrendo de 'Paralisia por Análise'. Tentar juntar dicas soltas da internet está te deixando confuso e ansioso. Seu metabolismo precisa de um 'Reset' urgente, mas sem adivinhação. O Desafio 21 Dias não é um livro, é um Protocolo de Choque. Pare de tentar descobrir o que fazer e apenas siga o mapa que desenhei para destravar sua queima de gordura em 3 semanas."

      [Se 80 Receitas Keto]:
      "Cuidado: O tédio é o assassino silencioso da sua dieta. Sua análise mostra que comer a mesma coisa todo dia vai fazer você chutar o balde e voltar ao açúcar. Você precisa de PRAZER estratégico. Este livro de receitas é sua apólice de seguro contra a desistência, permitindo que você coma 'pães' e 'lasanhas' que na verdade aceleram seu emagrecimento."

      [Se Guia Iniciantes]:
      "Você está pronto para mudar, mas tem medo de errar e prejudicar sua saúde. E você está certo: começar a Carnívora sem o protocolo correto de eletrólitos e adaptação pode ser perigoso. Não arrisque seu bem-estar com tentativas e erros. O Guia Definitivo é a base de segurança que você precisa para passar pela fase de adaptação sem sintomas ruins e colher os benefícios reais."
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recommendedProductTitle: { type: Type.STRING },
                    archetype: { type: Type.STRING },
                    reason: { type: Type.STRING },
                },
                required: ["recommendedProductTitle", "archetype", "reason"],
            },
        },
    });

    try {
        const jsonText = response.text ? response.text.replace(/```json|```/g, '').trim() : "{}";
        const recommendation = JSON.parse(jsonText);
        return recommendation as Recommendation;
    } catch (e) {
        console.error("Failed to parse Gemini recommendation response:", e, "Raw text:", response.text);
        throw new Error("Could not generate recommendation.");
    }
}