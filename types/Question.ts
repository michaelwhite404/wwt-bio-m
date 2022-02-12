import LetterAnswer from "./LetterAnswer";

export default interface Question {
  question: string;
  answers: Answer[];
  correctAnswer: LetterAnswer;
}

interface Answer {
  answer: string;
  letter: LetterAnswer;
}
