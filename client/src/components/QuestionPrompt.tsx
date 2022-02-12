import { Question, GameData, SimplePlayer, LetterAnswer } from "../../../types";

export default function QuestionPrompt({
  question,
  players,
  gameData,
  mainPlayer,
  mainPlayerAnswer,
}: {
  question: Question;
  players: SimplePlayer[];
  gameData: GameData;
  mainPlayer: SimplePlayer;
  mainPlayerAnswer?: LetterAnswer;
}) {
  return (
    <div>
      {mainPlayer.username}: Answer the following question
      <div>{question.question}</div>
      <div>
        {question.answers.map((answer) => (
          <div key={answer.letter}>
            {answer.letter}: {answer.answer}
          </div>
        ))}
      </div>
      <br />
      {!mainPlayerAnswer && (
        <div>
          {gameData.playersAnswered} / {players.length - 1} players selected
        </div>
      )}
    </div>
  );
}
