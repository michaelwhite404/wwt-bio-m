import { LetterAnswer, Question } from "../../../types";

export default function PlayerQuestionPrompt({
  question,
  answerQuestion,
}: {
  question: Omit<Question, "correctAnswer">;
  answerQuestion: (letterSelected: LetterAnswer) => void;
}) {
  return (
    <div>
      <div>{question.question}</div>
      <div>
        {question.answers.map((answer) => (
          <button
            key={answer.letter}
            value={answer.letter}
            onClick={() => answerQuestion(answer.letter)}
          >
            {answer.letter}: {answer.answer}
          </button>
        ))}
      </div>
    </div>
  );
}
