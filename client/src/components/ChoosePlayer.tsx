import React from "react";
import { Socket } from "socket.io-client";
import { SimplePlayer } from "../../../types";

interface ChoosePlayerProps {
  players: SimplePlayer[];
  hostSocket?: Socket;
}

export default function ChoosePlayer({ players, hostSocket }: ChoosePlayerProps) {
  const playerSelect = (player: SimplePlayer) => hostSocket?.emit("player-selected", player);

  return (
    <div>
      {players.map((player) => (
        <button key={player.socketId} onClick={() => playerSelect(player)}>
          {player.username}
        </button>
      ))}
    </div>
  );
}
