import React, { useEffect, useState } from "react";
import { LetterAnswer, PlayerState } from "../../../types";
import PlayerQuestionPrompt from "../components/PlayerQuestionPrompt";
import { useSocketIo } from "../hooks";

export default function MainPlayer() {
  const socket = useSocketIo();
  const [pin, setPin] = useState("");
  const [ready, setReady] = useState(false);
  const [playerAnswer, setPlayerAnswer] = useState<LetterAnswer>();
  const [playerState, setPlayerState] = useState<PlayerState>();

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("main-player-ready", () => setReady(true));
    socket?.on("change-player-state", setPlayerState);
  }, [socket]);

  useEffect(() => {
    if (playerState?.gameState === "choose-player") setPlayerAnswer(undefined);
  }, [playerState?.gameState]);

  const answerQuestion = (letterSelected: LetterAnswer) => {
    socket?.emit("main-player-answer-question", { pin, answered: letterSelected });
    setPlayerAnswer(letterSelected);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit("main-player-join", pin);
  };

  return (
    <div className="game-container">
      I'm the main player
      <div>Game State: {playerState?.gameState}</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pin">
          Pin:
          <input id="pin" value={pin} onChange={(e) => setPin(e.target.value)} name="pin" />
        </label>
        <button type="submit">Submit</button>
      </form>
      {ready && <div>Main Player Ready</div>}
      {playerState?.currentQuestion && playerState.gameState !== "choose-player" && (
        <div className="question-container">
          <PlayerQuestionPrompt
            question={playerState.currentQuestion}
            answerQuestion={answerQuestion}
            correctAnswer={playerState.correctAnswer}
            playerAnswer={playerAnswer}
          />
        </div>
      )}
    </div>
  );
}
