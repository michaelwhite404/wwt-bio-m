import React, { useEffect, useState } from "react";
import { useSocketIo } from "../hooks";

export default function Player() {
  const socket = useSocketIo();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({ pin: "", username: "" });

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("player-ready", () => setReady(true));
  }, [socket]);

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
    </div>
  );
}
