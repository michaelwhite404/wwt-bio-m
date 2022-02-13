import { ReactNode } from "react";
import { LetterAnswer } from "../../../types";
import Hexagon from "./Hexagon";

export default function AnswerHex(props: AnswerHexProps) {
  const { letter, children, locked, onClick, selected, correct } = props;
  return (
    <Hexagon<LetterAnswer>
      onClick={onClick}
      locked={locked}
      value={letter}
      selected={selected}
      correct={correct}
    >
      <div style={{ marginRight: 10, color: "#F6B012", fontWeight: "bold" }}>{letter}: </div>
      <div>{children}</div>
    </Hexagon>
  );
}

interface AnswerHexProps {
  letter: LetterAnswer;
  children: ReactNode;
  locked?: boolean;
  selected?: boolean;
  correct?: boolean;
  onClick?: (value?: LetterAnswer) => void;
}
