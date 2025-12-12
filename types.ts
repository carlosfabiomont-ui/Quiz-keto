export interface QuizOption {
  title: string;
  description: string;
}

export interface Question {
  question: string;
  options: QuizOption[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string; 
}

export interface Recommendation {
    recommendedProductTitle: string;
    archetype: string; // Novo campo para o título do Arquétipo
    reason: string; // O script de VSL
}

export interface QuestionWithAnswer {
  question: string;
  answer: string;
}