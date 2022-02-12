import LetterAnswer from "./LetterAnswer";

export default interface GameData {
  playersAnswered: number;
  questionLive: boolean;
  question: number;
  mainAnswered: boolean;
  mainPlayerAnswer?: LetterAnswer;
  showAnswer: boolean;
}
