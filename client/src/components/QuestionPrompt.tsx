import { Question, GameData, SimplePlayer, LetterAnswer } from "../../../types";
import Hexagon from "./Hexagon";

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
  const isCorrect = (letterAnswer: LetterAnswer) => {
    if (!gameData.showAnswer) return undefined;
    return question.correctAnswer === letterAnswer;
  };

  const isWrong = (letterAnswer: LetterAnswer) => {
    if (!gameData.showAnswer) return undefined;
    return question.correctAnswer !== letterAnswer && mainPlayerAnswer === letterAnswer;
  };

  return (
    <div>
      {mainPlayer.username}: Answer the following question
      <div>{question.question}</div>
      <div>
        <div className="hex-grid">
          {question.answers.map((answer) => (
            <Hexagon
              key={answer.letter}
              letter={answer.letter}
              selected={mainPlayerAnswer === answer.letter}
              wrong={isWrong(answer.letter)}
              correct={isCorrect(answer.letter)}
            >
              {answer.answer}
            </Hexagon>
          ))}
        </div>
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
