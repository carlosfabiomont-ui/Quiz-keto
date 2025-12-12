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
      Você é o "Algoritmo de Diagnóstico Metabólico" da página @keto_carnivoras_news.
      Analise as respostas do usuário e determine o ARQUÉTIPO dele e o PRODUTO IDEAL baseando-se na seguinte Lógica de Pontuação (Scoring Logic):

      OS PRODUTOS E ARQUÉTIPOS:
      
      1. PRODUTO: "80+ Receitas para Air Fryer"
         ARQUÉTIPO: "O CARNÍVORO PRAGMÁTICO"
         GATILHOS: Respondeu "Tempo e Bagunça", "Praticidade Máxima", "Economia e Tempo". Odeia sujeira, quer rapidez.
      
      2. PRODUTO: "Guia de 21 dias de transformação keto"
         ARQUÉTIPO: "O BUSCADOR DE REINÍCIO"
         GATILHOS: Respondeu "Falta de Clareza", "Preciso de Regras", "Desinflamar e Vícios". Precisa de um mapa, um desafio, estrutura rígida.

      3. PRODUTO: "80+ receitas keto"
         ARQUÉTIPO: "O HEDONISTA ESTRATÉGICO"
         GATILHOS: Respondeu "Paladar Monótono", "Cozinheiro Criativo", "Social e Família", "Veterano". Sente falta de variedade, gosta de cozinhar.

      4. PRODUTO: "Guia Definitivo: para iniciantes na dieta carnívora"
         ARQUÉTIPO: "O INICIANTE CONSCIENTE"
         GATILHOS: Respondeu "Totalmente iniciante" E demonstra insegurança ou busca conhecimento profundo antes da prática. É o "Purista" que quer fazer certo desde o dia 1 para evitar erros.

      CRITÉRIOS DE DESEMPATE (TIE-BREAKER):
      - Prioridade 1: "Guia de 21 dias" (Se o usuário quer estrutura/desafio).
      - Prioridade 2: "80+ Receitas para Air Fryer" (Se o usuário quer praticidade).
      - Prioridade 3: "80+ receitas keto" (Apenas se reclamar de tédio ou gostar de cozinhar).

      RESPOSTAS DO USUÁRIO: ${JSON.stringify(userAnswers)}

      INSTRUÇÕES DE SAÍDA:
      Retorne um JSON com:
      - "recommendedProductTitle": O título exato do produto vencedor.
      - "archetype": O nome do Arquétipo (ex: "O CARNÍVORO PRAGMÁTICO").
      - "reason": Um texto persuasivo no estilo VSL (Video Sales Letter). Use os scripts abaixo como base, mas personalize levemente com os dados do usuário (idade, gênero, meta) se possível.

      SCRIPTS BASE PARA O CAMPO "REASON":

      [Se Air Fryer]:
      "O nosso algoritmo analisou suas respostas e identificou um padrão muito comum. Você quer os benefícios da dieta — a clareza mental, a queima de gordura — mas a rotina de preparo está te sabotando. Você indicou que tem pouco tempo ou odeia a bagunça da cozinha. A boa notícia: seu problema não é falta de disciplina, é falta de tecnologia. Tentar fazer dieta usando frigideira todos os dias é insustentável para você. Por isso, a solução é a Automação: Picanha crocante e torresmo em 12 minutos, sem sujeira."

      [Se 21 Dias]:
      "Vi nas suas respostas que você se sente perdido com tanta informação contraditória. O excesso de informação causa paralisia. Para o seu tipo metabólico, tentar 'inventar moda' agora é um erro. Você precisa de Blindagem. Você precisa de um período curto e guiado para resetar seus hormônios. O Desafio 21 Dias não é um livro, é um sistema. Eu vou te dizer exatamente o que comer e quando comer. Seu único trabalho é obedecer ao mapa."

      [Se 80 Receitas Keto]:
      "Sua análise mostra algo interessante: você já entende o poder da alimentação, mas seu paladar está entediado. Cuidado: o tédio é o maior assassino de dietas. Se você continuar comendo bife sem graça todo dia, você vai chutar o balde. Para blindar sua dieta, você precisa de Prazer. Você precisa enganar seu cérebro achando que está 'jacando', quando na verdade está nutrindo. Transforme sua obrigação em banquete com Lasanhas e Pães que funcionam na dieta."

      [Se Guia Iniciantes]:
      "Sua análise indica que você está pronto para uma mudança real, mas quer fazer isso com segurança absoluta. Você não quer apenas 'tentar' mais uma dieta; você quer entender os fundamentos para não colocar sua saúde em risco. O Guia Definitivo é a base sólida que falta para você. Ele elimina as suposições e te dá o passo a passo científico para começar a Dieta Carnívora evitando os erros que 90% dos iniciantes cometem nos primeiros 15 dias."
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