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
          {/* <AnswerHex letter="B">{question.question}</AnswerHex> */}
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
              {/* <Hexagon
                key={answer.letter}
                letter={answer.letter}
                onSelect={answerQuestion}
                selected={playerAnswer === answer.letter}
                wrong={
                  correctAnswer && playerAnswer === answer.letter && correctAnswer !== playerAnswer
                }
                correct={correctAnswer && correctAnswer === answer.letter}
                locked={Boolean(playerAnswer)}
              >
                {answer.answer}
              </Hexagon> */}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
