import { Socket } from "socket.io";
import LetterAnswer from "../../types/LetterAnswer";
import PlayerAnswer from "../../types/PlayerAnswer";

export default class Player {
  readonly username: string;
  readonly socket: Socket;
  // private correctAnswers: number;
  private answers: PlayerAnswer[];
  constructor(username: string, socket: Socket) {
    this.username = username;
    this.socket = socket;
    // this.correctAnswers = 0;
    this.answers = [];
  }

  get correctAnswers() {
    return this.answers.filter((answer) => answer.correct).length;
  }

  hasAnsweredQuestion(questionNum: number) {
    return this.answers.some((answer) => answer.questionNum === questionNum);
  }

  answerQuestion(questionNum: number, answer: LetterAnswer, correct: boolean) {
    this.answers.push({ questionNum, answer, correct });
  }
}
