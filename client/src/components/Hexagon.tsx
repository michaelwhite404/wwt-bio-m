import classNames from "classnames";
import { ReactNode } from "react";
import { LetterAnswer } from "../../../types";
import "./Hexagon.css";

export default function Hexagon(props: HexagonProps) {
  const { letter, children, onSelect, selected, wrong, correct, locked } = props;
  const className = classNames("hexagon", { selected, wrong, correct });
  return (
    <div className={className} onClick={() => !locked && onSelect?.(letter)}>
      <div style={{ display: "flex", height: 70, alignItems: "center" }}>
        <div style={{ marginRight: 10, color: "#F6B012", fontWeight: "bold" }}>{letter}: </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

interface HexagonProps {
  letter: LetterAnswer;
  children: ReactNode;
  onSelect?: (letter: LetterAnswer) => void;
  selected?: boolean;
  wrong?: boolean;
  correct?: boolean;
  locked?: boolean;
}
