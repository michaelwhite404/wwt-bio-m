import { GameData, GameState, SimplePlayer, Question } from ".";

export default interface HostState {
  gameStarted: boolean;
  gameState: GameState;
  mainPlayer?: SimplePlayer;
  players: SimplePlayer[];
  gameData: GameData;
  currentQuestion?: Question;
}
