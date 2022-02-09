import { Socket } from "socket.io";

export default class Player {
  username: string;
  socket: Socket;
  correctAnswers: number;
  constructor(username: string, socket: Socket) {
    this.username = username;
    this.socket = socket;
    this.correctAnswers = 0;
  }
}
