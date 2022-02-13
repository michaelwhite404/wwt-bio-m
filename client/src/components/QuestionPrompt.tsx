import { Socket } from "socket.io-client";
import { LetterAnswer, HostState } from "../../../types";
import Hexagon from "./Hexagon";

export default function QuestionPrompt({ hostState, hostSocket, showAnswer }: QuestionPromptProps) {
  const isCorrect = (letterAnswer: LetterAnswer) => {
    if (!hostState.gameData.showAnswer) return undefined;
    return hostState.currentQuestion?.correctAnswer === letterAnswer;
  };

  const isWrong = (letterAnswer: LetterAnswer) => {
    if (!hostState.gameData.showAnswer) return undefined;
    return (
      hostState.currentQuestion?.correctAnswer !== letterAnswer &&
      hostState.gameData.mainPlayerAnswer === letterAnswer
    );
  };

  return (
    <div className="hex-container">
      {hostState?.gameData.mainAnswered && !hostState.gameData.showAnswer && (
        <button onClick={showAnswer}>Show Answer</button>
      )}
      {hostState?.gameData.showAnswer && (
        <button onClick={() => hostSocket?.emit("choose-player")}>Next Question</button>
      )}
      <div className="hex-question">
        <Hexagon letter="B">{hostState.currentQuestion?.question}</Hexagon>
      </div>
      <div className="hex-grid">
        {hostState.currentQuestion?.answers.map((answer) => (
          <Hexagon
            key={answer.letter}
            letter={answer.letter}
            selected={hostState.gameData.mainPlayerAnswer === answer.letter}
            wrong={isWrong(answer.letter)}
            correct={isCorrect(answer.letter)}
          >
            {answer.answer}
          </Hexagon>
        ))}
      </div>
    </div>
  );
}

interface QuestionPromptProps {
  hostState: HostState;
  hostSocket?: Socket;
  showAnswer: () => any;
}
