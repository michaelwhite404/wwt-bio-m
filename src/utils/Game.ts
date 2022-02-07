export default class Game {
  hostId: string;
  pin: string;
  gameData: any;
  live: boolean;
  constructor(hostId: string, pin: string, gameData: any) {
    this.hostId = hostId;
    this.pin = pin;
    this.gameData = gameData;
    this.live = false;
  }
}
