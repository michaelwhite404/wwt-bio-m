import { Socket } from "socket.io-client";
import { LetterAnswer, HostState } from "../../../types";
import AnswerHex from "./AnswerHex";
import Hexagon from "./Hexagon";

export default function QuestionPrompt({ hostState, hostSocket, showAnswer }: QuestionPromptProps) {
  const isCorrect = (letterAnswer: LetterAnswer) => {
    if (!hostState.gameData.showAnswer) return undefined;
    return hostState.currentQuestion?.correctAnswer === letterAnswer;
  };

  const nextQuestion = () => hostSocket?.emit("choose-player");
  return (
    <div className="hex-container">
      <div style={{ width: 200, alignSelf: "flex-end", marginRight: "2.5vw", marginBottom: 15 }}>
        {hostState?.gameData.mainAnswered && !hostState.gameData.showAnswer && (
          <Hexagon align="center" onClick={showAnswer}>
            Show Answer
          </Hexagon>
        )}
        {hostState?.gameData.showAnswer && (
          <Hexagon align="center" onClick={nextQuestion}>
            Next Question
          </Hexagon>
        )}
      </div>
      <div className="hex-question">
        <Hexagon align="center">{hostState.currentQuestion?.question}</Hexagon>
      </div>
      <div className="hex-grid">
        {hostState.currentQuestion?.answers.map((answer) => (
          <AnswerHex
            key={answer.letter}
            letter={answer.letter}
            selected={hostState.gameData.mainPlayerAnswer === answer.letter}
            correct={isCorrect(answer.letter)}
          >
            {answer.answer}
          </AnswerHex>
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
