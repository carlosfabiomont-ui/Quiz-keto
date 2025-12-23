export interface QuizOption {
  title: string;
  description: string;
}

export interface Question {
  category: string;
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
    archetype: string;
    reason: string;
}

export interface QuestionWithAnswer {
  category: string;
  question: string;
  answer: string;
}