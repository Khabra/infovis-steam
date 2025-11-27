// src/Components/MarioButtonDot/MarioButtonDot.jsx
import React from "react";

export default function MarioButtonDot(props) {
  const { cx, cy, payload, image } = props;

  // Registrar Hitbox (Esto sigue igual)
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

  // --- AJUSTE DE ALTURA AQUÍ ---
  // 'cy' es el punto exacto del tope de la tubería más alta.
  // Para que la moneda flote, restamos su tamaño y unos pixeles extra.
  const liftAmount = 8; // Cuántos pixeles quieres levantarla sobre la tubería

  return (
    <image
      href={image}
      x={cx - coinSize / 2} // Centrado horizontal
      
      // CAMBIO: Restamos el tamaño total y luego restamos el espacio extra (liftAmount)
      y={cy - coinSize - liftAmount} 
      
      width={coinSize}
      height={coinSize}
      style={{ cursor: "pointer", pointerEvents: "none" }}
    />
  );
}