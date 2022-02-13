import classNames from "classnames";
import { ReactNode } from "react";
import "./Hexagon.css";

export default function Hexagon<T>(props: HexagonProps<T>) {
  const { children, onClick, selected, correct, locked, value, align = "start", className } = props;
  const classN = classNames("hexagon", className, { selected, correct });
  return (
    <div className={classN} onClick={() => !locked && onClick?.(value)}>
      <div style={{ display: "flex", height: 70, alignItems: "center", justifyContent: align }}>
        {children}
      </div>
    </div>
  );
}

interface HexagonProps<T> {
  value?: T;
  children: ReactNode;
  onClick?: (value?: T) => void;
  selected?: boolean;
  correct?: boolean;
  locked?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
}
