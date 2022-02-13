import { LetterAnswer, Question } from "../../../types";
import "./AnswerButton.css";
import AnswerHex from "./AnswerHex";
import Hexagon from "./Hexagon";

export default function PlayerQuestionPrompt({
  question,
  answerQuestion,
  correctAnswer,
  playerAnswer,
}: {
  question: Omit<Question, "correctAnswer">;
  answerQuestion: (letterSelected?: LetterAnswer) => void;
  correctAnswer?: LetterAnswer;
  playerAnswer?: LetterAnswer;
}) {
  return (
    <div>
      <div className="hex-container">
        <div className="hex-question">
          <Hexagon align="center">{question.question}</Hexagon>
        </div>
        <div className="hex-grid">
          {question.answers.map((answer) => (
            <>
              <AnswerHex
                key={answer.letter}
                letter={answer.letter}
                selected={playerAnswer === answer.letter}
                onClick={answerQuestion}
                locked={Boolean(playerAnswer)}
                correct={correctAnswer && correctAnswer === answer.letter}
              >
                {answer.answer}
              </AnswerHex>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
