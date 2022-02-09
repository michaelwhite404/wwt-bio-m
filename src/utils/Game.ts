import Player from "./Player";
import { Socket } from "socket.io";

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
  constructor(hostSocket: Socket, pin: number | string) {
    this.hostSocket = hostSocket;
    this.pin = String(pin);
    this.gameData = { playersAnswered: 0, questionLive: false, question: 1 };
    this.players = [];
    this.hostSocket.join(this.pin); // The host is joining a room based on the pin
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.socket.join(this.pin);
    return player;
  }

  getPlayers() {
    return this.players;
  }

  nextQuestion() {
    this.gameData = { playersAnswered: 0, questionLive: true, question: this.gameData.question++ };
  }
}
