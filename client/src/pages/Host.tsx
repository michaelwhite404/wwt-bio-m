import qs from "qs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocketIo } from "../hooks";
import { Player } from "../../../src/utils";

export default function Host() {
  const socket = useSocketIo();
  const location = useLocation();
  const [pin, setPin] = useState<number>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameFound, setGameFound] = useState<boolean>();

  useEffect(() => {
    const queryStr = qs.parse(location.search.slice(1));
    socket?.emit("host-join", { gameId: queryStr.gameId });
    socket?.on("show-game-pin", ({ gamePin }) => {
      setPin(gamePin);
      setGameFound(true);
    });
    socket?.on("update-lobby", (players: any[]) => setPlayers(players));
    socket?.on("no-game-found", () => {
      setGameFound(false);
    });
  }, [location.search, socket]);

  return (
    <div>
      {gameFound !== false ? (
        <>
          <div>I'm the host</div>
          <div>Game Pin: {pin}</div>
          <br />
          <div>Players</div>
          {players.map((p) => (
            <div key={p.socketId}>{p.username}</div>
          ))}
        </>
      ) : (
        "No game found"
      )}
    </div>
  );
}
