import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import randomInt from "./helpers/randomInt";

// Import classes
import { Game, LiveGames, Player } from "./utils";
import { SimplePlayer, LetterAnswer } from "../types";

const games = new LiveGames();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const findGame = (gameId: string) => {
  const pathname = path.join(__dirname, "../games");
  const files = fs.readdirSync(pathname);
  const arr = files.map((file) => {
    const raw = fs.readFileSync(`${pathname}/${file}`);
    return JSON.parse(raw.toString("utf-8"));
  });

  return arr.find((game) => game.gameId === gameId);
};

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("test", async (value) => {
    console.log("received");
    socket.join("my-room");

    io.to("my-room").emit("wow");

    // io.in("my-room")
    //   .fetchSockets()
    //   .then((sockets) => console.log(sockets.map((s) => s.id)));

    const sockets = await io.in("my-room").fetchSockets();
    console.log(sockets.map((s) => s.id));

    // const sockets = io.sockets.adapter.rooms.get("my-room");
    // console.log(sockets);

    console.log("LAST");
  });

  socket.on("host-join", async ({ gameId }) => {
    // console.log(`Host joined!: ${gameId}`);
    const foundGame = findGame(gameId);
    if (!foundGame) return socket.emit("no-game-found");

    const pin = randomInt(Math.pow(10, 6), Math.pow(10, 7) - 1);
    const game = games.addGame(new Game(socket, pin, foundGame.questions));

    socket.emit("show-game-pin", { gamePin: game.pin });

    // const sockets = await io.in(game.pin).fetchSockets();
    // console.log(sockets.map((s) => s.id));
  });

  socket.on("player-join", async ({ pin, username }) => {
    const game = games.getGame(pin);
    if (!game) return socket.emit("no-game-found");

    if (game.getPlayers().some((p) => p.socket.id === socket.id)) return;
    game.addPlayer(new Player(username, socket));

    socket.to(game.pin).emit(
      "update-lobby",
      game.getPlayers().map((p) => ({
        username: p.username,
        socketId: p.socket.id,
      }))
    );
  });

  socket.on("main-player-join", (pin: string) => {
    const game = games.getGame(pin);
    if (!game) return socket.emit("no-game-found");
    game.addMainPlayer(socket);
  });

  socket.on("host-start-game", () => {
    const game = games.getGameByHostId(socket.id);
    if (!game) return socket.emit("no-game-found");
    game.startGame();
  });

  socket.on("choose-player", () => {
    const game = games.getGameByHostId(socket.id);
    if (!game) return socket.emit("no-game-found");
    game.choosePlayerState();
  });

  socket.on("player-selected", (player: SimplePlayer) => {
    const game = games.getGameByHostId(socket.id);
    if (!game) return socket.emit("no-game-found");
    game.chooseMainPlayer(player.socketId);
  });

  socket.on("player-answer-question", (props: { answered: LetterAnswer; pin: string }) => {
    const game = games.getGame(props.pin);
    if (!game) return socket.emit("no-game-found");
    game.answerQuestion(socket.id, props.answered);
  });

  socket.on("main-player-answer-question", (props: { answered: LetterAnswer; pin: string }) => {
    const game = games.getGame(props.pin);
    if (!game) return socket.emit("no-game-found");
    game.mainPlayerAnwerQuestion(props.answered);
  });

  socket.on("show-answer", (pin: string) => {
    const game = games.getGame(pin);
    if (!game) return socket.emit("no-game-found");
    game.showAnswer();
  });
});

const port = process.env.PORT || 7789;
server.listen(port, () => console.log(`App running on port ${port}`));
