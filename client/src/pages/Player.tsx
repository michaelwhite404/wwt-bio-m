import React, { useEffect, useState } from "react";
import { LetterAnswer, PlayerState } from "../../../types";
import PlayerQuestionPrompt from "../components/PlayerQuestionPrompt";
import { useSocketIo } from "../hooks";

export default function Player() {
  const socket = useSocketIo();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({ pin: "", username: "" });
  const [playerAnswer, setPlayerAnswer] = useState<LetterAnswer>();
  const [playerState, setPlayerState] = useState<PlayerState>();

  const selected = playerState?.mainPlayer?.socketId === socket?.id;

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("player-ready", () => setReady(true));
    socket?.on("change-player-state", setPlayerState);
  }, [socket]);

  useEffect(() => {
    if (playerState?.gameState === "choose-player") setPlayerAnswer(undefined);
  }, [playerState?.gameState]);

  const answerQuestion = (letterSelected: LetterAnswer) => {
    socket?.emit("player-answer-question", { pin: data.pin, answered: letterSelected });
    setPlayerAnswer(letterSelected);
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
      {playerState?.gameStarted && <div>THE GAME HAS STARTED</div>}
      {playerState?.currentQuestion &&
        playerState.gameState !== "choose-player" &&
        (!selected ? (
          <PlayerQuestionPrompt
            question={playerState?.currentQuestion}
            answerQuestion={answerQuestion}
            correctAnswer={playerState.correctAnswer}
            playerAnswer={playerAnswer}
          />
        ) : (
          "I have been selected"
        ))}
    </div>
  );
}
