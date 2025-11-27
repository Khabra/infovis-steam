import React from "react";

export default function MarioButtonDot(props) {
  const { cx, cy, payload, image } = props;

  // Registrar Hitbox
  if (typeof window !== "undefined" && payload) {
    if (!window.__BUTTON_ZONES__) window.__BUTTON_ZONES__ = [];

    const size = 30; 
    const x = cx - size / 2;
    const y = cy - size / 2;

    window.__BUTTON_ZONES__.push({
      genero: payload.genero,
      porcentajeBL: payload.porcentajeBL,
      graficoDona: payload.graficoDona,
      rank: payload.rank,
      x, y, width: size, height: size,
    });
  }

  if (!image || !cx || !cy) return null;

  const coinSize = 30; // Tamaño de la moneda

  return (
    <image
      href={image}
      x={cx - coinSize / 2} // Centrado horizontal
      // AJUSTE VERTICAL: cy es el tope de la barra.
      // Restamos el tamaño de la moneda (-30) y sumamos un poquito (+2) para que se apoye.
      y={cy - coinSize + 2} 
      width={coinSize}
      height={coinSize}
      style={{ cursor: "pointer", pointerEvents: "none" }}
    />
  );
}