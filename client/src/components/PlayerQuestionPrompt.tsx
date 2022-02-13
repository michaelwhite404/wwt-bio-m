import classNames from "classnames";
import { LetterAnswer, Question } from "../../../types";
import "./AnswerButton.css";
import Hexagon from "./Hexagon";

type Answer = Question["answers"][0];

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
      <div>
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
  );
}

const AnswerButton = ({
  answer,
  whenClicked,
  correctAnswer,
  playerAnswer,
  ...props
}: AnswerButtonProps) => {
  const className = classNames("answer-button", {
    selected: playerAnswer === answer.letter,
    correct: correctAnswer && correctAnswer === answer.letter,
    wrong: correctAnswer && playerAnswer === answer.letter && correctAnswer !== playerAnswer,
  });
  return (
    <button
      value={answer.letter}
      onClick={() => whenClicked?.(answer.letter)}
      {...props}
      className={className}
      disabled={Boolean(playerAnswer)}
    >
      {answer.letter}: {answer.answer}
    </button>
  );
};

interface AnswerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  answer: Answer;
  whenClicked?: (letter: LetterAnswer) => void;
  correctAnswer?: LetterAnswer;
  playerAnswer?: LetterAnswer;
}
