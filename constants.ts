import type { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'carnivore-beginners',
    title: 'Guia Definitivo: para iniciantes na dieta carnívora',
    description: 'O passo a passo definitivo para você começar a dieta carnívora com segurança, evitar erros comuns e transformar sua saúde.',
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1000&auto=format&fit=crop', // Steak image
    link: 'https://pv.guia-iniciante.ketocarnivoro.com/',
  },
  {
    id: 'keto-transformation-21',
    title: 'Guia de 21 dias de transformação keto',
    description: 'Um desafio estruturado de 3 semanas para virar a chave do seu metabolismo, queimar gordura e recuperar sua vitalidade.',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop', // Keto breakfast
    link: 'https://ketocarnivoro.com/21-dias-ceto/',
  },
  {
    id: 'keto-carnivore-recipes',
    title: '80+ receitas keto',
    description: 'Nunca mais caia na rotina! Mais de 80 receitas deliciosas que unem o melhor dos dois mundos para manter seu paladar satisfeito.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76690b60943?q=80&w=1000&auto=format&fit=crop', // Ribs/Food
    link: 'https://ketocarnivoro.com/40-receitas/',
  },
  {
    id: 'air-fryer-recipes',
    title: '80+ Receitas para Air Fryer',
    description: 'Praticidade, crocância e zero sujeira. Descubra como fazer refeições Keto e Carnívoras incríveis usando apenas sua Air Fryer.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop', // Fried Chicken/Air Fryer vibe
    link: 'https://pv.80-air-fryer.ketocarnivoro.com/',
  },
];