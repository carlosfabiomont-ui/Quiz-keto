import { GoogleGenAI, Type } from "@google/genai";
import type { Question, Recommendation, QuestionWithAnswer } from '../types';

/**
 * Creates and returns a GoogleGenAI client instance.
 * Throws an error if the API key is not found in the environment variables.
 */
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY is not defined. Make sure it's set in your environment variables.");
    throw new Error("A chave da API não foi encontrada. Verifique as variáveis de ambiente.");
  }
  
  return new GoogleGenAI({ apiKey });
}

export async function generateQuizQuestions(): Promise<Question[]> {
    const ai = getAiClient();
    const prompt = `
      Você é um especialista em nutrição da página @keto_carnivoras_news, focado em dieta cetogênica e carnívora.
      Crie um quiz de 5 perguntas de múltipla escolha para ajudar um seguidor a escolher o melhor produto digital para ele.
      
      Os produtos disponíveis para recomendação final são:
      1. "Guia Definitivo: para iniciantes na dieta carnívora" (Para quem quer começar na carnívora estrita).
      2. "Guia de 21 dias de transformação keto" (Para quem quer um desafio de perda de peso e adaptação keto).
      3. "80+ receitas keto" (Para quem já faz a dieta mas quer variedade e sabor).

      As perguntas devem investigar:
      - Nível de experiência com dietas low-carb (a primeira pergunta DEVE abordar a experiência tanto com Keto quanto com Carnívora).
      - Principal objetivo (ex: perda de peso, melhora de saúde autoimune, mais energia, variedade alimentar).
      - Estilo de vida atual, incluindo nível de atividade física (ex: sedentário, ativo, há quanto tempo não treina).
      - Relação com a comida e cozinha (ex: prefere refeições rápidas, gosta de cozinhar, enjoa fácil da rotina).
      - Dificuldades enfrentadas em outras dietas (ex: falta de saciedade, vontade de doces, complexidade).
      
      Gere perguntas engajadoras e diretas, em Português do Brasil.
      
      Retorne a resposta EXCLUSIVAMENTE como um array JSON de objetos, sem markdown.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                    },
                    required: ["question", "options"],
                },
            },
        },
    });

    try {
        // Limpeza de segurança: remove crases de markdown caso a IA as envie (ex: ```json ... ```)
        const jsonText = response.text.replace(/```json|```/g, '').trim();
        const questions = JSON.parse(jsonText);
        return questions as Question[];
    } catch (e) {
        console.error("Failed to parse Gemini response:", e, "Raw text:", response.text);
        throw new Error("Could not generate quiz questions.");
    }
}

export async function getRecommendation(userAnswers: QuestionWithAnswer[]): Promise<Recommendation> {
    const ai = getAiClient();
    const prompt = `
      Atue como o especialista da página @keto_carnivoras_news.
      Analise as respostas do usuário no quiz e recomende UM dos seguintes produtos:
      
      1. "Guia Definitivo: para iniciantes na dieta carnívora"
      2. "Guia de 21 dias de transformação keto"
      3. "80+ receitas keto"

      Respostas do usuário: ${JSON.stringify(userAnswers)}.

      Regras:
      - Se o usuário busca cura de doenças autoimunes ou simplicidade total, priorize o "Guia Definitivo: para iniciantes na dieta carnívora".
      - Se busca emagrecimento estruturado ou gosta de alguns vegetais, priorize o "Guia de 21 dias de transformação keto".
      - Se reclama de monotonia ou busca sabor, priorize o "80+ receitas keto".

      Retorne um JSON com:
      - "recommendedProductTitle": O título EXATO de um dos 3 produtos acima.
      - "reason": Uma explicação curta (2-3 frases), motivadora e personalizada em Português do Brasil.

      Retorne apenas o JSON.
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
                    reason: { type: Type.STRING },
                },
                required: ["recommendedProductTitle", "reason"],
            },
        },
    });

    try {
        // Limpeza de segurança: remove crases de markdown caso a IA as envie
        const jsonText = response.text.replace(/```json|```/g, '').trim();
        const recommendation = JSON.parse(jsonText);
        return recommendation as Recommendation;
    } catch (e) {
        console.error("Failed to parse Gemini recommendation response:", e, "Raw text:", response.text);
        throw new Error("Could not generate recommendation.");
    }
}