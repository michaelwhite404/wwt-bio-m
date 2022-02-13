import qs from "qs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocketIo } from "../hooks";
import { HostState } from "../../../types";
import QuestionPrompt from "../components/QuestionPrompt";
import ChoosePlayer from "../components/ChoosePlayer";
import Hexagon from "../components/Hexagon";

export default function Host() {
  const socket = useSocketIo();
  const location = useLocation();
  const [pin, setPin] = useState<number>();
  const [gameFound, setGameFound] = useState<boolean>();
  const [hostState, setHostState] = useState<HostState>();

  useEffect(() => {
    const queryStr = qs.parse(location.search.slice(1));
    socket?.emit("host-join", { gameId: queryStr.gameId });
    socket?.on("show-game-pin", ({ gamePin }) => {
      setPin(gamePin);
      setGameFound(true);
    });
    socket?.on("no-game-found", () => setGameFound(false));
    socket?.on("change-host-state", setHostState);
  }, [location.search, socket]);

  const startGame = () => socket?.emit("host-start-game");
  const showAnswer = () => socket?.emit("show-answer", pin);

  return (
    <div>
      {gameFound !== false ? (
        <>
          <div>I'm the host</div>
          <div>Game Pin: {pin}</div>
          <br />
          <div>Players</div>
          {hostState?.players.map((p, i) => (
            <div key={`user-${i}`}>{p.username}</div>
          ))}
          <button onClick={startGame}>Start Game</button>
        </>
      ) : (
        "No game found"
      )}
      {hostState?.currentQuestion && hostState.mainPlayer && hostState.gameData.questionLive && (
        <QuestionPrompt
          mainPlayer={hostState.mainPlayer}
          question={hostState.currentQuestion}
          players={hostState.players}
          gameData={hostState.gameData}
          mainPlayerAnswer={hostState.gameData.mainPlayerAnswer}
        />
      )}
      {hostState?.gameState === "choose-player" && (
        <ChoosePlayer hostSocket={socket} players={hostState.players} />
      )}
      {hostState?.gameData.mainAnswered && !hostState.gameData.showAnswer && (
        <button onClick={showAnswer}>Show Answer</button>
      )}
      {hostState?.gameData.showAnswer && (
        <div>
          <strong>The correct answer is {hostState?.currentQuestion?.correctAnswer}</strong>
          <div>
            <button onClick={() => socket?.emit("choose-player")}>Next Question</button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-around", margin: "15px 0" }}>
        <Hexagon letter="A" />
        <Hexagon letter="B" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "15px 0" }}>
        <Hexagon letter="C" />
        <Hexagon letter="D" />
      </div>
    </div>
  );
}
