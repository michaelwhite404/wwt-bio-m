import React, { useEffect, useState } from "react";
import { Question, GameState, LetterAnswer } from "../../../types";
import PlayerQuestionPrompt from "../components/PlayerQuestionPrompt";
import { useSocketIo } from "../hooks";

export default function MainPlayer() {
  const socket = useSocketIo();
  const [pin, setPin] = useState("");
  const [ready, setReady] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Omit<Question, "correctAnswer">>();
  const [gameState, setGameState] = useState<GameState>();

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("main-player-ready", () => setReady(true));
    socket?.on("update-game-state", setGameState);
    socket?.on("show-question", (props: { question: Question }) => {
      const { correctAnswer, ...question } = props.question;
      setCurrentQuestion(question);
    });
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
      <div>Game State: {gameState}</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pin">
          Pin:
          <input id="pin" value={pin} onChange={(e) => setPin(e.target.value)} name="pin" />
        </label>
        <button type="submit">Submit</button>
      </form>
      {ready && <div>Main Player Ready</div>}
      {gameState === "question" && currentQuestion && (
        <div>
          <PlayerQuestionPrompt question={currentQuestion} answerQuestion={answerQuestion} />
        </div>
      )}
    </div>
  );
}
