// src/Components/MarioButtonDot/MarioButtonDot.jsx
import React from "react";
// BORRA O COMENTA ESTA LÍNEA (Ya no queremos el botón fijo)
// import button from "/button.svg"; 

export default function MarioButtonDot(props) {
  // 1. AÑADE "image" AQUÍ PARA RECIBIRLA
  const { cx, cy, payload, image } = props; 

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

  // Si por alguna razón no llega la imagen o las coordenadas, no dibujamos nada para evitar errores
  if (!image || !cx || !cy) return null;

  return (
    <image
      href={image} // <--- 2. CAMBIO CLAVE: Usamos la prop 'image' en vez de 'button'
      x={cx - 15}
      y={cy - 15}
      width={30}
      height={30}
      style={{ cursor: "pointer", pointerEvents: "none" }} 
    />
  );
}