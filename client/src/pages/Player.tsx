import React, { useEffect, useState } from "react";
import { Question } from "../../../types/Question";
import SimplePlayer from "../../../types/SimplePlayer";
import { useSocketIo } from "../hooks";

export default function Player() {
  const socket = useSocketIo();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({ pin: "", username: "" });
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("player-ready", () => setReady(true));
    socket?.on("player-start-game", () => setStarted(true));
    socket?.on("show-question", showQuestion);
  }, [socket]);

  const showQuestion = (props: { mainPlayer: SimplePlayer; question: Question }) => {
    if (socket?.id === props.mainPlayer.socketId) setSelected(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit("player-join", data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div>
      I like Playing
      <form onSubmit={handleSubmit}>
        Pin:
        <input type="text" value={data.pin} onChange={handleChange} name="pin" />
        Username:
        <input type="text" value={data.username} onChange={handleChange} name="username" />
        <button>Submit</button>
      </form>
      {ready && "I'M READDDDDYYYYYYY"}
      {started && <div>THE GAME HAS STARTED</div>}
      {selected && "I've been selected. Noooooo!!!!"}
    </div>
  );
}
