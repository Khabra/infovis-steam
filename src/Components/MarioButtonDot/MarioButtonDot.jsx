import React from "react";
import button from "/button.svg";

export default function MarioButtonDot(props) {
  const { cx, cy } = props;

  return (
    <image
      href={button}
      x={cx - 15}
      y={cy - 15}
      width={30}
      height={30}
      style={{ cursor: "pointer" }}
    />
  );
}
