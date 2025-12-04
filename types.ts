export interface Question {
  question: string;
  options: string[];
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
    reason: string;
}

export interface QuestionWithAnswer {
  question: string;
  answer: string;
}