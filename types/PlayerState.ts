import { GameState, LetterAnswer, Question, SimplePlayer } from ".";

export default interface PlayerState {
  gameStarted: boolean;
  gameState: GameState;
  currentQuestion?: Omit<Question, "correctAnswer">;
  mainPlayer?: SimplePlayer;
  correctAnswer?: LetterAnswer;
}
