import qs from "qs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocketIo } from "../hooks";

export default function Host() {
  const socket = useSocketIo();
  const location = useLocation();
  const [pin, setPin] = useState<number>();

  useEffect(() => {
    const queryStr = qs.parse(location.search.slice(1));
    socket?.emit("host-join", { gameId: queryStr.gameId });

    socket?.on("show-game-pin", ({ gamePin }) => {
      setPin(gamePin);
    });
  }, [location.search, socket]);
  return (
    <div>
      <div>I'm the host</div>
      <div>Game Pin: {pin}</div>
    </div>
  );
}
