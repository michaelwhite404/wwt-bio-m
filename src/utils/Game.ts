import Player from "./Player";

interface GameData {
  playersAnswered: number;
  questionLive: boolean;
  question: number;
}

export default class Game {
  hostId: string;
  pin: string;
  gameData: GameData;
  players: Player[];
  constructor(hostId: string, pin: number | string) {
    this.hostId = hostId;
    this.pin = String(pin);
    this.gameData = { playersAnswered: 0, questionLive: false, question: 1 };
    this.players = [];
  }

  addPlayer(player: Player) {
    this.players.push(player);
    return player;
  }

  nextQuestion() {
    this.gameData = { playersAnswered: 0, questionLive: true, question: this.gameData.question++ };
  }
}
