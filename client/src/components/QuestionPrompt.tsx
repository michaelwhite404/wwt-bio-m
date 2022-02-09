import { Question } from "../../../types/Question";

export default function QuestionPrompt({ question }: { question: Question }) {
  return (
    <div>
      <div>{question.question}</div>
      <div>
        {question.answers.map((answer) => (
          <div key={answer.letter}>
            {answer.letter}: {answer.answer}
          </div>
        ))}
      </div>
    </div>
  );
}
