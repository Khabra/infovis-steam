// /components/MarioPipe.jsx
import React from "react";
import pipe from "/pipe.svg";

export default function MarioPipe(props) {
  return (
    <image
      href={pipe}
      x={props.x}
      y={props.y - 20}   // Ajusta para que la tapa sobresalga
      width={props.width}
      height={props.height + 20}
      preserveAspectRatio="none"
    />
  );
}
