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

const games = new LiveGames();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const findGame = (gameId: string) => {
  // const;
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
    const game = games.addGame(new Game(socket.id, pin));

    socket.join(game.pin); //The host is joining a room based on the pin

    socket.emit("show-game-pin", {
      gamePin: pin,
    });

    // const sockets = await io.in(`${game.pin}`).fetchSockets();
    // console.log(sockets.map((s) => s.id));
  });

  socket.on("player-join", ({ pin, username }) => {
    const game = games.getGame(pin);
    if (!game) return socket.emit("no-game-found");

    if (game.getPlayers().some((p) => p.socketId === socket.id)) return;
    const player = game.addPlayer(new Player(username, socket.id));
    socket.join(game.pin);
    console.log(`${username} joined`);

    socket.to(game.pin).emit("update-lobby", game.getPlayers());
  });
});

const port = process.env.PORT || 7789;
server.listen(port, () => console.log(`App running on port ${port}`));
