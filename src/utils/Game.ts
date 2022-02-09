import Player from "./Player";
import { Socket } from "socket.io";
import { Question } from "../../types/Question";

interface GameData {
  playersAnswered: number;
  questionLive: boolean;
  question: number;
}

export default class Game {
  hostSocket: Socket;
  pin: string;
  gameData: GameData;
  private players: Player[];
  private questions: Question[];
  constructor(hostSocket: Socket, pin: number | string, questions: Question[]) {
    this.hostSocket = hostSocket;
    this.pin = String(pin);
    this.gameData = { playersAnswered: 0, questionLive: false, question: 1 };
    this.players = [];
    this.questions = questions;
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
    this.players.find((player) => player.socket.id === playerId);
  }

  startGame() {
    this.gameData = { ...this.gameData, questionLive: true };
    this.hostSocket.in(this.pin).emit("player-start-game");
    this.hostSocket.emit("new-question", this.questions[0]);
    return this;
  }

  nextQuestion() {
    this.gameData = { playersAnswered: 0, questionLive: true, question: this.gameData.question++ };
  }
}
