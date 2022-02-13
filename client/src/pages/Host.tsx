import qs from "qs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocketIo } from "../hooks";
import { HostState } from "../../../types";
import QuestionPrompt from "../components/QuestionPrompt";
import ChoosePlayer from "../components/ChoosePlayer";
import Hexagon from "../components/Hexagon";
import PinHeader from "../components/PinHeader";

export default function Host() {
  const socket = useSocketIo();
  const location = useLocation();
  const [pin, setPin] = useState<string>();
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
    <div className="game-container">
      {gameFound !== false ? (
        <>
          {pin && <PinHeader pin={pin} />}
          <div>Players</div>
          {hostState?.players.map((p, i) => (
            <div key={`user-${i}`}>{p.username}</div>
          ))}
          {!hostState?.gameStarted && (
            <Hexagon align="center" onClick={startGame}>
              Start Game
            </Hexagon>
          )}
        </>
      ) : (
        "No game found"
      )}
      {hostState?.gameState === "choose-player" && (
        <ChoosePlayer hostSocket={socket} players={hostState.players} />
      )}
      {hostState?.currentQuestion &&
        hostState.gameState !== "choose-player" &&
        hostState.mainPlayer && (
          <div className="question-container">
            <QuestionPrompt hostState={hostState} hostSocket={socket} showAnswer={showAnswer} />
          </div>
        )}
    </div>
  );
}
