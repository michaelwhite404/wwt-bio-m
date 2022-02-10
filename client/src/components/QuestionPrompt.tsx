import { Question } from "../../../types/Question";
import SimplePlayer from "../../../types/SimplePlayer";

export default function QuestionPrompt({
  question,
  players,
}: {
  question: Question;
  players: SimplePlayer[];
}) {
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
      <br />0 / {players.length - 1} players selected
    </div>
  );
}
