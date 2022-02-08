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
  removeGame(hostId: string) {
    var game = this.getGame(hostId);
    if (game) {
      this.games = this.games.filter((game) => game.hostId !== hostId);
    }
    return game;
  }
  getGame(hostId: string) {
    return this.games.filter((game) => game.hostId === hostId)[0];
  }
}
