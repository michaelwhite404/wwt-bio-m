import { LetterAnswer, Question } from "../../../types";
import "./AnswerButton.css";
import Hexagon from "./Hexagon";

export default function PlayerQuestionPrompt({
  question,
  answerQuestion,
  correctAnswer,
  playerAnswer,
}: {
  question: Omit<Question, "correctAnswer">;
  answerQuestion: (letterSelected: LetterAnswer) => void;
  correctAnswer?: LetterAnswer;
  playerAnswer?: LetterAnswer;
}) {
  return (
    <div>
      <div>{question.question}</div>
      <div className="hex-container">
        <div className="hex-question">
          <Hexagon letter="B">{question.question}</Hexagon>
        </div>
        <div className="hex-grid">
          {question.answers.map((answer) => (
            <Hexagon
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
            </Hexagon>
          ))}
        </div>
      </div>
    </div>
  );
}
