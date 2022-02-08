export default class Player {
  username: string;
  socketId: string;
  correctAnswers: number;
  constructor(username: string, socketId: string) {
    this.username = username;
    this.socketId = socketId;
    this.correctAnswers = 0;
  }
}
