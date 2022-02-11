import LetterAnswer from "./LetterAnswer";

export default interface PlayerAnswer {
  questionNum: number;
  answer: LetterAnswer;
  correct: boolean;
}
