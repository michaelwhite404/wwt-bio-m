import { Question, GameData, SimplePlayer } from "../../../types";

export default function QuestionPrompt({
  question,
  players,
  gameData,
}: {
  question: Question;
  players: SimplePlayer[];
  gameData: GameData;
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
      <br />
      {gameData.playersAnswered} / {players.length - 1} players selected
    </div>
  );
}
