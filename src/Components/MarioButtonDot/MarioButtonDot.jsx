// /components/MarioButtonDot.jsx
import React from "react";
import button from "/button.svg";

export default function MarioButtonDot(props) {
  const { cx, cy, payload, onMouseEnter, onClick } = props;

  return (
    <image
      href={button}
      x={cx - 15}
      y={cy - 15}
      width={30}
      height={30}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => onMouseEnter?.(null, { payload })}
      onClick={(e) => onClick?.(e, { payload })}
    />
  );
}
