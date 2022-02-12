import Player from "./Player";
import { Socket } from "socket.io";
import { Question, SimplePlayer, LetterAnswer, GameData, GameState, HostState } from "../../types";

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
    this.changeHostState();
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
    this.changeHostState();
    return player;
  }

  addMainPlayer(socket: Socket) {
    if (!this.mainPlayerSocket) {
      this.mainPlayerSocket = socket;
      socket.join(this.pin);
      socket.emit("main-player-ready");
      socket.emit("update-game-state", this.gameState);
      this.changeHostState();
    }

    return this;
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
    this.hostSocket.in(this.pin).emit("player-start-game");
    this.updateGameState("choose-player");
    this.hostSocket.emit("choose-player");
    this.changeHostState();
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
    this.updateGameState("choose-player");
    this.emitAll("choose-player");
    this.changeHostState();
  }

  get currentQuestion() {
    if (this.gameData.question === 0) return undefined;
    return this.questions[this.gameData.question - 1];
  }

  chooseMainPlayer(socketId: string) {
    const player = this.players.find((player) => player.socket.id === socketId);
    if (!player) return this;
    this.mainPlayer = player;
    this.changeHostState();
    this.nextQuestion();
  }

  /**
   * Updates the state of the game and emits the state to the sockets in this game's
   * room
   * @param state The state the game is updating to
   */
  private updateGameState(state: GameState) {
    this.gameState = state;
    this.emitAll("update-game-state", state);
    return this;
  }

  private nextQuestion() {
    this.gameData = {
      playersAnswered: 0,
      questionLive: true,
      question: ++this.gameData.question,
      mainAnswered: false,
      showAnswer: false,
    };
    const data = {
      mainPlayer: {
        username: this.mainPlayer!.username,
        socketId: this.mainPlayer!.socket.id,
      } as SimplePlayer,
      question: this.currentQuestion,
    };
    this.emitAll("show-question", data);
    this.updateGameState("show-question");
    this.changeHostState();
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
      this.hostSocket.emit("player-answer-question", this.gameData);
    }
    this.changeHostState();
  }

  mainPlayerAnwerQuestion(answer: LetterAnswer) {
    this.answerQuestion(this.mainPlayer!.socket.id, answer);
    this.gameData.mainAnswered = true;
    this.gameData.mainPlayerAnswer = answer;
    this.updateGameState("main-answered");
    this.emitAll("main-player-answer-question", answer);
    this.changeHostState();
  }

  showAnswer() {
    this.gameData.questionLive = false;
    this.gameData.showAnswer = true;
    this.updateGameState("show-answer");
    this.emitAll("show-answer", this.currentQuestion);
    this.changeHostState();
  }

  private changeHostState() {
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
}
