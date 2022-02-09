import Game from "./Game";

export default class LiveGames {
  private games: Game[];
  constructor() {
    this.games = [];
  }
  addGame(game: Game) {
    this.games.push(game);
    return game;
  }
  removeGame(pin: string) {
    var game = this.getGame(pin);
    if (game) {
      this.games = this.games.filter((game) => game.pin !== pin);
    }
    return game;
  }
  getGame(pin: string) {
    const game = this.games.find((game) => game.pin === pin);
    return game;
  }

  getGameByHostId(hostId: string) {
    const game = this.games.find((game) => game.hostSocket.id === hostId);
    return game;
  }
}
