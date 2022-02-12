import React, { useEffect, useState } from "react";
import { Question, SimplePlayer, LetterAnswer } from "../../../types";
import PlayerQuestionPrompt from "../components/PlayerQuestionPrompt";
import { useSocketIo } from "../hooks";

export default function Player() {
  const socket = useSocketIo();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({ pin: "", username: "" });
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Omit<Question, "correctAnswer">>();
  const [correctAnswer, setCorrectAnswer] = useState<LetterAnswer>();
  const [playerAnswer, setPlayerAnswer] = useState<LetterAnswer>();

  useEffect(() => {
    socket?.on("no-game-found", () => console.log("No Game Found"));
    socket?.on("player-ready", () => setReady(true));
    socket?.on("player-start-game", () => setStarted(true));
    socket?.on("show-question", (props: { mainPlayer: SimplePlayer; question: Question }) => {
      if (socket?.id === props.mainPlayer.socketId) setSelected(true);
      const { correctAnswer, ...question } = props.question;
      setCurrentQuestion(question);
    });
    socket?.on("show-answer", (question: Question) => {
      setCorrectAnswer(question.correctAnswer);
    });
    socket?.on("choose-player", reset);
  }, [socket]);

  const answerQuestion = (letterSelected: LetterAnswer) => {
    socket?.emit("player-answer-question", { pin: data.pin, answered: letterSelected });
    setPlayerAnswer(letterSelected);
  };

  const reset = () => {
    setSelected(false);
    setCurrentQuestion(undefined);
    setCorrectAnswer(undefined);
    setPlayerAnswer(undefined);
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
      {currentQuestion &&
        (!selected ? (
          <PlayerQuestionPrompt
            question={currentQuestion}
            answerQuestion={answerQuestion}
            correctAnswer={correctAnswer}
            playerAnswer={playerAnswer}
          />
        ) : (
          "I have been selected"
        ))}
    </div>
  );
}
