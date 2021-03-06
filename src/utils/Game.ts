import Player from "./Player";
import { Socket } from "socket.io";
import {
  Question,
  SimplePlayer,
  LetterAnswer,
  GameData,
  GameState,
  HostState,
  PlayerState,
} from "../../types";

export default class Game {
  readonly hostSocket: Socket;
  readonly pin: string;
  private gameState: GameState;
  private gameData: GameData;
  private players: Player[];
  private questions: Question[];
  private gameStarted: boolean;
  private mainPlayer?: Player;
  private mainPlayerSocket?: Socket;
  constructor(hostSocket: Socket, pin: number | string, questions: Question[]) {
    this.hostSocket = hostSocket;
    this.pin = String(pin);
    this.gameState = "lobby";
    this.gameData = {
      playersAnswered: 0,
      questionLive: false,
      question: 0,
      mainAnswered: false,
      mainPlayerAnswer: undefined,
      showAnswer: false,
    };
    this.players = [];
    this.questions = questions;
    this.gameStarted = false;
    this.mainPlayer = undefined;
    this.mainPlayerSocket = undefined;
    this.hostSocket.join(this.pin); // The host is joining a room based on the pin
    this.emitStateUpdates();
  }

  /**
   * Emits to all clients in the room
   * @param ev The event name
   * @param args The arguments to send to a client
   * @returns `true`
   */
  emitAll(ev: string, ...args: any[]) {
    this.hostSocket.emit(ev, ...args);
    this.hostSocket.in(this.pin).emit(ev, ...args);
    return true;
  }

  /**
   * Add a player to the game
   * @param player The player to add to the game
   * @returns The plaeyer
   */
  addPlayer(player: Player) {
    this.players.push(new Player(player.username, player.socket));
    player.socket.join(this.pin);
    player.socket.emit("player-ready");
    this.emitStateUpdates();
    return player;
  }

  addMainPlayer(socket: Socket) {
    if (!this.mainPlayerSocket) {
      this.mainPlayerSocket = socket;
      socket.join(this.pin);
      socket.emit("main-player-ready");
      socket.emit("update-game-state", this.gameState);
      this.emitStateUpdates();
    }

    return this;
  }

  /**
   * Removes a player from the game
   * @param playerId The socket id of the player to remove
   * @returns The player that was removed or `undefined` if no player was removed
   */
  removePlayer(playerId: string) {
    const player = this.getPlayer(playerId);
    if (player) {
      this.players = this.players.filter((player) => player.socket.id !== playerId);
      this.emitHostState();
    }
    return player;
  }

  getPlayers() {
    return this.players;
  }
  getPlayer(playerId: string) {
    return this.players.find((player) => player.socket.id === playerId);
  }

  /**
   * Starts the game. Returns the same game if the game has already started.
   * @returns The game instance
   */
  startGame() {
    if (this.gameStarted) return this;
    if (!this.mainPlayerSocket) return this;
    // this.gameData.questionLive = true;
    this.gameStarted = true;
    this.gameState = "choose-player";
    this.emitStateUpdates();
    return this;
  }

  choosePlayerState() {
    this.mainPlayerSocket = undefined;
    this.mainPlayer = undefined;
    this.gameData = {
      ...this.gameData,
      showAnswer: false,
      mainAnswered: false,
      mainPlayerAnswer: undefined,
    };
    this.gameState = "choose-player";
    this.emitStateUpdates();
  }

  get currentQuestion() {
    if (this.gameData.question === 0) return undefined;
    return this.questions[this.gameData.question - 1];
  }

  chooseMainPlayer(socketId: string) {
    const player = this.players.find((player) => player.socket.id === socketId);
    if (!player) return this;
    this.mainPlayer = player;
    this.emitStateUpdates();
    this.nextQuestion();
  }

  private nextQuestion() {
    this.gameData = {
      playersAnswered: 0,
      questionLive: true,
      question: ++this.gameData.question,
      mainPlayerAnswer: undefined,
      mainAnswered: false,
      showAnswer: false,
    };
    this.gameState = "show-question";
    this.emitStateUpdates();
  }

  answerQuestion(socketId: string, answer: LetterAnswer) {
    if (!this.gameData.questionLive) return;
    const player = this.getPlayer(socketId);
    if (!player) return;
    if (!player.hasAnsweredQuestion(this.gameData.question)) {
      this.currentQuestion?.correctAnswer;
      const isCorrect = answer === this.currentQuestion?.correctAnswer;
      player.answerQuestion(this.gameData.question, answer, isCorrect);
      this.gameData.playersAnswered++;
    }
    this.emitStateUpdates();
  }

  mainPlayerAnwerQuestion(answer: LetterAnswer) {
    this.answerQuestion(this.mainPlayer!.socket.id, answer);
    this.gameData.mainAnswered = true;
    this.gameData.mainPlayerAnswer = answer;
    this.gameState = "main-answered";
    this.emitStateUpdates();
  }

  showAnswer() {
    this.gameData.questionLive = false;
    this.gameData.showAnswer = true;
    this.gameState = "show-answer";
    this.emitStateUpdates();
  }

  private emitHostState() {
    const hostState: HostState = {
      gameStarted: this.gameStarted,
      gameState: this.gameState,
      mainPlayer: this.mainPlayer
        ? ({
            username: this.mainPlayer?.username,
            socketId: this.mainPlayer?.socket.id,
          } as SimplePlayer)
        : undefined,
      players: this.getPlayers().map((p) => ({
        username: p.username,
        socketId: p.socket.id,
      })) as SimplePlayer[],
      gameData: this.gameData,
      currentQuestion: this.currentQuestion,
    };
    this.hostSocket.emit("change-host-state", hostState);
  }

  private emitPlayerState() {
    const playerState: PlayerState = {
      gameStarted: this.gameStarted,
      gameState: this.gameState,
      currentQuestion: this.currentQuestion
        ? {
            question: this.currentQuestion.question,
            answers: this.currentQuestion.answers,
          }
        : undefined,
      mainPlayer: this.mainPlayer
        ? ({
            username: this.mainPlayer?.username,
            socketId: this.mainPlayer?.socket.id,
          } as SimplePlayer)
        : undefined,
      correctAnswer:
        this.gameData.showAnswer && !this.gameData.questionLive
          ? this.currentQuestion?.correctAnswer
          : undefined,
      questionLive: this.gameData.questionLive,
    };
    this.hostSocket.in(this.pin).emit("change-player-state", playerState);
  }

  private emitStateUpdates() {
    this.emitHostState();
    this.emitPlayerState();
  }
}
