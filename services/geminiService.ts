import { GoogleGenAI, Type } from "@google/genai";
import type { Question, Recommendation, QuestionWithAnswer } from '../types';

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

const FIXED_QUESTIONS: Question[] = [
  // MÓDULO 1: NEURO-METABOLISMO & ENERGIA
  {
    category: "Módulo 1: Neuro-Metabolismo",
    question: "Como está o seu nível de foco e clareza mental durante o dia?",
    options: [
      { title: "Névoa Mental constante", description: "Dificuldade de raciocínio e memória lenta." },
      { title: "Foco Intermitente", description: "Oscilo entre picos de foco e cansaço extremo." },
      { title: "Normal, mas sem 'brilho'", description: "Consigo trabalhar, mas sinto que poderia render 2x mais." }
    ]
  },
  {
    category: "Módulo 1: Neuro-Metabolismo",
    question: "Sobre seus desejos (cravings): O quão dependente você se sente de carboidratos ou doces?",
    options: [
      { title: "Dependência Química", description: "Se eu não comer doce/pão, fico irritado ou ansioso." },
      { title: "Hábito Social", description: "Cedo facilmente quando estou com amigos ou sob estresse." },
      { title: "Controle Moderado", description: "Consigo evitar, mas sinto falta no final do dia." }
    ]
  },
  {
    category: "Módulo 1: Neuro-Metabolismo",
    question: "Como está sua energia no período das 15h às 17h?",
    options: [
      { title: "Crash Metabólico", description: "Desejo incontrolável de deitar ou tomar muito café." },
      { title: "Sonolência leve", description: "Bocejos frequentes e produtividade baixa." },
      { title: "Estável", description: "Minha energia não cai drasticamente nesse horário." }
    ]
  },
  {
    category: "Módulo 1: Neuro-Metabolismo",
    question: "Qual sua dependência atual de cafeína para funcionar?",
    options: [
      { title: "Alta (3+ xícaras)", description: "Não sou ninguém antes do primeiro café." },
      { title: "Moderada (1-2 xícaras)", description: "Gosto do café, mas não é um vício debilitante." },
      { title: "Nula/Baixa", description: "Funciono bem sem estimulantes." }
    ]
  },
  {
    category: "Módulo 1: Neuro-Metabolismo",
    question: "Como você se sente ao acordar?",
    options: [
      { title: "Exausto(a)", description: "Parece que não dormi nada, mesmo após 8h de sono." },
      { title: "Lento(a)", description: "Demoro cerca de 1 a 2 horas para 'pegar no tranco'." },
      { title: "Revigorado(a)", description: "Acordo pronto para o dia quase imediatamente." }
    ]
  },
  
  // MÓDULO 2: SINAIS FÍSICOS & INFLAMAÇÃO
  {
    category: "Módulo 2: Sinais de Inflamação",
    question: "Você sente inchaço abdominal (estufamento) após as refeições?",
    options: [
      { title: "Sempre", description: "Minha barriga parece um balão logo após comer." },
      { title: "Às vezes", description: "Depende muito do que eu como (ex: massas/grãos)." },
      { title: "Raramente", description: "Sinto-me leve após a maioria das refeições." }
    ]
  },
  {
    category: "Módulo 2: Sinais de Inflamação",
    question: "Como estão suas articulações (joelhos, dedos, costas)?",
    options: [
      { title: "Dores Crônicas", description: "Sinto 'pontadas' ou rigidez frequente." },
      { title: "Dores Ocasionais", description: "Sinto desconforto após esforço físico ou frio." },
      { title: "Sem Dores", description: "Minhas articulações estão em perfeito estado." }
    ]
  },
  {
    category: "Módulo 2: Sinais de Inflamação",
    question: "Você apresenta olheiras profundas ou retenção de líquidos?",
    options: [
      { title: "Sim, constante", description: "Mesmo dormindo bem, pareço sempre inchado(a)." },
      { title: "Apenas em excessos", description: "Fico inchado após comer muito sal ou carboidrato." },
      { title: "Não", description: "Minha pele e corpo parecem bem drenados." }
    ]
  },
  {
    category: "Módulo 2: Sinais de Inflamação",
    question: "Como está a qualidade da sua pele (acne, oleosidade, psoríase)?",
    options: [
      { title: "Problemática", description: "Tenho inflamações ou irritações frequentes." },
      { title: "Oleosa/Mista", description: "Apenas irregularidades comuns." },
      { title: "Pele Limpa", description: "Minha pele reflete boa saúde interna." }
    ]
  },
  {
    category: "Módulo 2: Sinais de Inflamação",
    question: "Onde você acumula gordura com mais facilidade?",
    options: [
      { title: "Visceral (Barriga)", description: "Gordura dura, localizada na região abdominal." },
      { title: "Subcutânea (Geral)", description: "Distribuída pelo corpo todo." },
      { title: "Culotes/Pernas", description: "Foco em membros inferiores." }
    ]
  },

  // MÓDULO 3: PADRÕES DE DOPAMINA & HÁBITOS
  {
    category: "Módulo 3: Padrões de Recompensa",
    question: "Qual seu nível de ansiedade no final da tarde/noite?",
    options: [
      { title: "Altíssimo", description: "Sinto uma inquietação que só passa com comida ou telas." },
      { title: "Moderado", description: "Fico estressado(a) com a rotina, mas me controlo." },
      { title: "Baixo", description: "Consigo relaxar naturalmente ao final do dia." }
    ]
  },
  {
    category: "Módulo 3: Padrões de Recompensa",
    question: "Com que frequência você belisca comida sem estar com fome real?",
    options: [
      { title: "Várias vezes ao dia", description: "Como por tédio, ansiedade ou hábito." },
      { title: "Apenas à noite", description: "É o meu momento de relaxar após o trabalho." },
      { title: "Raramente", description: "Só como quando sinto fome biológica." }
    ]
  },
  {
    category: "Módulo 3: Padrões de Recompensa",
    question: "Como você lida com o 'Hangry' (ficar irritado com fome)?",
    options: [
      { title: "Insuportável", description: "Fico de mau humor e perco a paciência com todos." },
      { title: "Leve irritação", description: "Sinto desconforto, mas consigo manter a pose." },
      { title: "Tranquilo", description: "Sinto a fome, mas minha mente continua calma." }
    ]
  },
  {
    category: "Módulo 3: Padrões de Recompensa",
    question: "Quanto tempo você passa em redes sociais ou 'dopamina barata'?",
    options: [
      { title: "Várias horas", description: "Sinto que estou sempre buscando estímulo no celular." },
      { title: "Moderado", description: "Uso para trabalho e lazer controlado." },
      { title: "Baixo", description: "Prefiro atividades offline e foco no mundo real." }
    ]
  },
  {
    category: "Módulo 3: Padrões de Recompensa",
    question: "Qual sua principal recompensa após um dia difícil?",
    options: [
      { title: "Comida Conforto", description: "Doce, pizza, hambúrguer ou algo bem saboroso." },
      { title: "Entretenimento", description: "Séries, filmes ou jogos por horas." },
      { title: "Descanso/Esporte", description: "Banho quente, leitura ou atividade física." }
    ]
  },

  // MÓDULO 4: RESISTÊNCIA E OBJETIVO
  {
    category: "Módulo 4: Estratégia Final",
    question: "Qual o seu nível de conhecimento sobre Dieta Carnívora/Ancestral?",
    options: [
      { title: "Iniciante Total", description: "Estou começando a pesquisar sobre o assunto agora." },
      { title: "Conhecedor", description: "Já vi vídeos e li sobre, mas não aplico corretamente." },
      { title: "Praticante", description: "Já faço, mas sinto que estagnei nos resultados." }
    ]
  },
  {
    category: "Módulo 4: Estratégia Final",
    question: "Como é sua rotina de preparação de refeições?",
    options: [
      { title: "Caótica", description: "Não tenho tempo, como o que for mais fácil/rápido." },
      { title: "Organizada", description: "Consigo cozinhar algumas vezes na semana." },
      { title: "Prática", description: "Busco métodos rápidos (ex: Air Fryer) para não perder tempo." }
    ]
  },
  {
    category: "Módulo 4: Estratégia Final",
    question: "Quanto peso você gostaria de eliminar nos próximos 30 dias?",
    options: [
      { title: "Apenas 2-4kg", description: "Quero apenas uma 'limpeza' e definição." },
      { title: "5-10kg", description: "Preciso de uma transformação visível e rápida." },
      { title: "Mais de 10kg", description: "Estou em um processo longo de emagrecimento." }
    ]
  },
  {
    category: "Módulo 4: Estratégia Final",
    question: "Qual seu maior medo ao começar uma nova estratégia alimentar?",
    options: [
      { title: "Passar Fome", description: "Tenho medo de dietas restritivas que me deixam fraco." },
      { title: "Ser muito difícil", description: "Medo de não conseguir manter no longo prazo." },
      { title: "Não ter resultado", description: "Tentar mais uma coisa e falhar novamente." }
    ]
  },
  {
    category: "Módulo 4: Estratégia Final",
    question: "Você está pronto(a) para um 'Reset' biológico de 21 dias?",
    options: [
      { title: "Totalmente!", description: "Quero seguir um plano passo a passo." },
      { title: "Tenho dúvidas", description: "Preciso de mais informações técnicas primeiro." },
      { title: "Quero praticidade", description: "Só quero saber o que comer e como fazer rápido." }
    ]
  }
];

export async function generateQuizQuestions(): Promise<Question[]> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(FIXED_QUESTIONS), 800);
    });
}

export async function getRecommendation(userAnswers: QuestionWithAnswer[]): Promise<Recommendation> {
    const ai = getAiClient();
    const prompt = `
      Você é um Especialista em Biohacking e Nutrição Ancestral de nível internacional.
      Você acaba de aplicar um diagnóstico de 20 perguntas em um paciente.
      
      OBJETIVO:
      Analise o padrão de respostas e identifique o ARQUÉTIPO e a RECOMENDAÇÃO.
      
      ESTILO DE LINGUAGEM:
      - Científico, autoritário, mas empático com a dor do paciente.
      - Use termos: "Sequestro Dopaminérgico", "Depressão Metabólica", "Inflamação Sistêmica Subclínica", "Resistência à Leptina".

      RELATÓRIO DO PACIENTE: ${JSON.stringify(userAnswers)}

      LÓGICA DE PRODUTOS:
      1. Se o paciente tem muito BRAIN FOG e vício em AÇÚCAR -> "Guia de 21 dias de transformação keto" (O PERFIL INFLAMADO - RESET URGENTE).
      2. Se o paciente foca em FALTA DE TEMPO e quer comer bem -> "80+ Receitas para Air Fryer" (O OTIMIZADOR DE ALTA PERFORMANCE).
      3. Se o paciente é INICIANTE e tem MEDO de gordura/carne -> "Guia Definitivo: para iniciantes na dieta carnívora" (O CIENTISTA ANCESTRAL).
      4. Se o paciente quer VARIEDADE e SUSTENTABILIDADE -> "80+ receitas keto" (O EXPLORADOR METABÓLICO).

      SAÍDA (JSON):
      - "recommendedProductTitle": Título exato do produto.
      - "archetype": Nome impactante do arquétipo.
      - "reason": Um texto de 60-80 palavras que explique o diagnóstico (por que ele se sente assim) e por que o produto é o 'antídoto' específico.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
        throw new Error("Falha no diagnóstico.");
    }
}