import { Socket } from "socket.io";

export default class Player {
  readonly username: string;
  readonly socket: Socket;
  private correctAnswers: number;
  constructor(username: string, socket: Socket) {
    this.username = username;
    this.socket = socket;
    this.correctAnswers = 0;
  }

  /**
   * Call when the player has answered the question correctly
   */
  correct() {
    this.correctAnswers++;
  }
}
