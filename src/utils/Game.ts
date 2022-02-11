import Player from "./Player";
import { Socket } from "socket.io";
import { Question } from "../../types/Question";
import SimplePlayer from "../../types/SimplePlayer";
import LetterAnswer from "../../types/LetterAnswer";
import GameData from "../../types/GameData";

export default class Game {
  readonly hostSocket: Socket;
  readonly pin: string;
  gameData: GameData;
  private players: Player[];
  private questions: Question[];
  private gameStarted: boolean;
  private mainPlayer?: Player;
  constructor(hostSocket: Socket, pin: number | string, questions: Question[]) {
    this.hostSocket = hostSocket;
    this.pin = String(pin);
    this.gameData = { playersAnswered: 0, questionLive: false, question: 0 };
    this.players = [];
    this.questions = questions;
    this.gameStarted = false;
    this.mainPlayer = undefined;
    this.hostSocket.join(this.pin); // The host is joining a room based on the pin
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.socket.join(this.pin);
    player.socket.emit("player-ready");
    return player;
  }

  getPlayers() {
    return this.players;
  }
  getPlayer(playerId: string) {
    return this.players.find((player) => player.socket.id === playerId);
  }

  /**
   * Starts the game. Returns the same game if the game has already started.
   * @returns The game instance
   */
  startGame() {
    if (this.gameStarted) return this;
    // this.gameData.questionLive = true;
    this.gameStarted = true;
    this.hostSocket.in(this.pin).emit("player-start-game");
    this.hostSocket.emit("choose-player", true);
    // this.hostSocket.emit("new-question", this.questions[0]);
    return this;
  }

  chooseMainPlayer(socketId: string) {
    const player = this.players.find((player) => player.socket.id === socketId);
    if (!player) return this;
    this.mainPlayer = player;
    this.nextQuestion();
  }

  private nextQuestion() {
    this.gameData = { playersAnswered: 0, questionLive: true, question: ++this.gameData.question };
    const data = {
      mainPlayer: {
        username: this.mainPlayer!.username,
        socketId: this.mainPlayer!.socket.id,
      } as SimplePlayer,
      question: this.questions[this.gameData.question - 1],
    };
    this.hostSocket.emit("show-question", data);
    this.hostSocket.in(this.pin).emit("show-question", data);
  }

  answerQuestion(socketId: string, answer: LetterAnswer) {
    const player = this.getPlayer(socketId);
    if (!player) return;
    if (!player.hasAnsweredQuestion(this.gameData.question)) {
      const isCorrect = answer === this.questions[this.gameData.question - 1].correctAnswer;
      player.answerQuestion(this.gameData.question, answer, isCorrect);
      this.gameData.playersAnswered++;
      this.hostSocket.emit("player-answer-question", this.gameData);
    }
  }
}
