import qs from "qs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocketIo } from "../hooks";
import { Question } from "../../../types/Question";
import QuestionPrompt from "../components/QuestionPrompt";

export default function Host() {
  const socket = useSocketIo();
  const location = useLocation();
  const [pin, setPin] = useState<number>();
  const [players, setPlayers] = useState<{ username: string }[]>([]);
  const [gameFound, setGameFound] = useState<boolean>();
  const [currentQuestion, setCurentQuestion] = useState<Question>();

  useEffect(() => {
    const queryStr = qs.parse(location.search.slice(1));
    socket?.emit("host-join", { gameId: queryStr.gameId });
    socket?.on("show-game-pin", ({ gamePin }) => {
      setPin(gamePin);
      setGameFound(true);
    });
    socket?.on("update-lobby", setPlayers);
    socket?.on("no-game-found", () => {
      setGameFound(false);
    });
    socket?.on("new-question", setCurentQuestion);
  }, [location.search, socket]);

  const startGame = () => socket?.emit("host-start-game");

  return (
    <div>
      {gameFound !== false ? (
        <>
          <div>I'm the host</div>
          <div>Game Pin: {pin}</div>
          <br />
          <div>Players</div>
          {players.map((p, i) => (
            <div key={`user-${i}`}>{p.username}</div>
          ))}
          <button onClick={startGame}>Start Game</button>
        </>
      ) : (
        "No game found"
      )}
      {currentQuestion && <QuestionPrompt question={currentQuestion} />}
    </div>
  );
}
