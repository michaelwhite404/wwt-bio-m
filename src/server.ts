import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
});

const port = process.env.PORT || 7789;
server.listen(port, () => console.log(`App running on port ${port}`));
