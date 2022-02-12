import React, { useEffect, useState } from "react";
import { LetterAnswer, PlayerState } from "../../../types";
import PlayerQuestionPrompt from "../components/PlayerQuestionPrompt";
import { useSocketIo } from "../hooks";

export default function MainPlayer() {
  const socket = useSocketIo();
  const [pin, setPin] = useState("");
  const [ready, setReady] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>();

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("main-player-ready", () => setReady(true));
    socket?.on("change-player-state", setPlayerState);
  }, [socket]);

  const answerQuestion = (letterSelected: LetterAnswer) => {
    socket?.emit("main-player-answer-question", { pin, answered: letterSelected });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit("main-player-join", pin);
  };

  return (
    <div>
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
      {playerState?.gameState === "show-question" && playerState?.currentQuestion && (
        <div>
          <PlayerQuestionPrompt
            question={playerState.currentQuestion}
            answerQuestion={answerQuestion}
          />
        </div>
      )}
    </div>
  );
}
