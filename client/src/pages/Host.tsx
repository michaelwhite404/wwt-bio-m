import qs from "qs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocketIo } from "../hooks";
import { Question, SimplePlayer, GameData, LetterAnswer } from "../../../types";
import QuestionPrompt from "../components/QuestionPrompt";
import ChoosePlayer from "../components/ChoosePlayer";

export default function Host() {
  const socket = useSocketIo();
  const location = useLocation();
  const [pin, setPin] = useState<number>();
  const [players, setPlayers] = useState<SimplePlayer[]>([]);
  const [gameFound, setGameFound] = useState<boolean>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [choosingPlayer, setChoosingPlayer] = useState(false);
  const [chosenPlayer, setChosenPlayer] = useState<SimplePlayer>();
  const [mainPlayerAnswer, setMainPlayerAnswer] = useState<LetterAnswer>();
  const [gameData, setGameData] = useState<GameData>({
    playersAnswered: 0,
    questionLive: false,
    question: 0,
    mainAnswered: false,
  });
  const [renderAnswer, setRenderAnswer] = useState(false);

  useEffect(() => {
    const queryStr = qs.parse(location.search.slice(1));
    socket?.emit("host-join", { gameId: queryStr.gameId });
    socket?.on("show-game-pin", ({ gamePin }) => {
      setPin(gamePin);
      setGameFound(true);
    });
    socket?.on("update-lobby", setPlayers);
    socket?.on("no-game-found", () => setGameFound(false));
    socket?.on("choose-player", setChoosingPlayer);
    socket?.on("show-question", showQuestion);
    socket?.on("player-answer-question", setGameData);
    socket?.on("main-player-answer-question", setMainPlayerAnswer);
    socket?.on("show-answer", () => setRenderAnswer(true));
  }, [location.search, socket]);

  const startGame = () => socket?.emit("host-start-game");
  const showQuestion = (props: { mainPlayer: SimplePlayer; question: Question }) => {
    setChoosingPlayer(false);
    setChosenPlayer(props.mainPlayer);
    setCurrentQuestion(props.question);
    setGameData((data) => ({
      playersAnswered: 0,
      questionLive: true,
      question: ++data.question,
      mainAnswered: false,
    }));
  };

  const showAnswer = () => socket?.emit("show-answer", pin);

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
      {currentQuestion && chosenPlayer && (
        <QuestionPrompt
          mainPlayer={chosenPlayer}
          question={currentQuestion}
          players={players}
          gameData={gameData}
          mainPlayerAnswer={mainPlayerAnswer}
        />
      )}
      {choosingPlayer && <ChoosePlayer hostSocket={socket} players={players} />}
      {mainPlayerAnswer && !renderAnswer && <button onClick={showAnswer}>Show Answer</button>}
      {renderAnswer && <strong>The correct answer is {currentQuestion?.correctAnswer}</strong>}
    </div>
  );
}
