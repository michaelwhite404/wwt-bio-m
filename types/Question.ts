export interface Question {
  question: string;
  answers: Answer[];
  correctAnswer: string;
}

interface Answer {
  answer: string;
  letter: string;
}
