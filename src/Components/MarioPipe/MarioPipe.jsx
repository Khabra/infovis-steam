import React from "react";
import pipeGreen from "/pipe_green.svg";
import pipePurple from "/pipe_purple.svg";

export default function MarioPipe(props) {
  const { x, y, width, height, pipeColor = "green" } = props;

  const href = pipeColor === "purple" ? pipePurple : pipeGreen;

  return (
    <image
      href={href}
      x={x}
      y={y - 18}              // que sobresalga un poquito por arriba
      width={width}
      height={height + 18}
      preserveAspectRatio="none"
      style={{ pointerEvents: "none" }}
    />
  );
}
