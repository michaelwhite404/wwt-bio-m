import Player from "./Player";

export default class Game {
  hostId: string;
  pin: number;
  gameData: any;
  live: boolean;
  players: Player[];
  constructor(hostId: string, pin: number, gameData: any) {
    this.hostId = hostId;
    this.pin = pin;
    this.gameData = gameData;
    this.live = false;
    this.players = [];
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }
}
