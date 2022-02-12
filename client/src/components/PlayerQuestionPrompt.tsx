import classNames from "classnames";
import { LetterAnswer, Question } from "../../../types";
import "./AnswerButton.css";

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
          <AnswerButton
            key={answer.letter}
            answer={answer}
            whenClicked={answerQuestion}
            correctAnswer={correctAnswer}
            playerAnswer={playerAnswer}
          />
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
