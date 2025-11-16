// src/Components/MarioButtonDot/MarioButtonDot.jsx
import React from "react";
import button from "/button.svg";

export default function MarioButtonDot(props) {
  const { cx, cy, payload } = props;

  // Registramos la hitbox del botón para colisiones con Mario
  if (typeof window !== "undefined" && payload) {
    if (!window.__BUTTON_ZONES__) window.__BUTTON_ZONES__ = [];

    const size = 30; // tamaño visual del botón
    const x = cx - size / 2;
    const y = cy - size / 2;

    window.__BUTTON_ZONES__.push({
      genero: payload.genero,
      porcentajeBL: payload.porcentajeBL,
      graficoDona: payload.graficoDona,
      rank: payload.rank,
      x,
      y,
      width: size,
      height: size,
    });
  }

  return (
    <image
      href={button}
      x={cx - 15}
      y={cy - 15}
      width={30}
      height={30}
      style={{ cursor: "pointer", pointerEvents: "none" }} // dibuja encima
    />
  );
}
