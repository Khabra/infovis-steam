import React, { useEffect, useRef, useState } from "react";
import sprite1 from "/sprite1.png";
import sprite2 from "/sprite2.png";
import sprite3 from "/sprite3.png";

const sprites = [sprite1, sprite2, sprite3];

export default function GameCanvas({ onCollision }) {
  const canvasRef = useRef(null);
  const [pos, setPos] = useState({ x: 100, y: 300 });
  const [spriteIndex, setSpriteIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let currentSprite = new Image();
    currentSprite.src = sprites[spriteIndex];

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar personaje
      ctx.drawImage(currentSprite, pos.x, pos.y, 50, 50);

      // Barras guardadas por Recharts
      const bars = window.__BAR_ZONES__ || [];

      // Colisión
      for (let bar of bars) {
        const collision =
          pos.x < bar.x + bar.width &&
          pos.x + 50 > bar.x &&
          pos.y < bar.y + bar.height &&
          pos.y + 50 > bar.y;

        if (collision) {
          onCollision(bar);
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }, [pos, spriteIndex]);

  // Mover personaje con acelerómetro
  useEffect(() => {
    function handleMotion(event) {
      const ax = event.accelerationIncludingGravity.x;
      const ay = event.accelerationIncludingGravity.y;

      if (Math.abs(ax) + Math.abs(ay) > 0.2) {
        setPos(prev => ({
          x: prev.x + ax * 2,
          y: prev.y + ay * 2,
        }));

        // Cambiar sprite para animación
        setSpriteIndex(i => (i + 1) % sprites.length);
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{
        border: "2px solid #ff7bff",
        marginTop: "20px",
        background: "rgba(255,255,255,0.05)"
      }}
    />
  );
}
