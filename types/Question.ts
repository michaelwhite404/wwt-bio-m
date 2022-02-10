import LetterAnswer from "./LetterAnswer";

export interface Question {
  question: string;
  answers: Answer[];
  correctAnswer: string;
}

interface Answer {
  answer: string;
  letter: LetterAnswer;
}
