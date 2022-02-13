import { LetterAnswer } from "../../../types";
import "./Hexagon.css";

export default function Hexagon({ letter }: HexagonProps) {
  return (
    <div className="hexagon">
      <div style={{ display: "flex", height: 70, alignItems: "center" }}>
        <div style={{ marginRight: 10, color: "#F6B012", fontWeight: "bold" }}>{letter}: </div>
        <div>This is an answer</div>
      </div>
    </div>
  );
}

interface HexagonProps {
  letter: LetterAnswer;
}
