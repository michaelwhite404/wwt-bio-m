import LetterAnswer from "./LetterAnswer";

export default interface Question {
  question: string;
  answers: Answer[];
  correctAnswer: string;
}

interface Answer {
  answer: string;
  letter: LetterAnswer;
}
