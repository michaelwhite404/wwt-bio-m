export default class Game {
  hostId: string;
  pin: number;
  gameData: any;
  live: boolean;
  mainPlayerId?: string;
  constructor(hostId: string, pin: number, gameData: any) {
    this.hostId = hostId;
    this.pin = pin;
    this.gameData = gameData;
    this.live = false;
    this.mainPlayerId = undefined;
  }

  addMainPlayer(playerId: string) {
    this.mainPlayerId = playerId;
  }
}
