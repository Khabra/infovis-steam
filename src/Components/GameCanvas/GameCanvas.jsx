import React, { useEffect, useRef, useState } from "react";
import sprite1 from "/sprite1.png";
import sprite2 from "/sprite2.png";
import sprite3 from "/sprite3.png";

const sprites = [sprite1, sprite2, sprite3];

export default function GameCanvas({ onCollision }) {
  const canvasRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 300 });
  const [spriteIndex, setSpriteIndex] = useState(0);
  const [collisionEnabled, setCollisionEnabled] = useState(false);

  // Esperar 1 segundo antes de activar colisiones
  useEffect(() => {
    const t = setTimeout(() => setCollisionEnabled(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Dibujo del personaje y detección de colisiones
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- PERSONAJE ---
      const img = new Image();
      img.src = sprites[spriteIndex];

      ctx.drawImage(img, pos.x, pos.y, 60, 60);

      // --- COLISIONES ---
      if (collisionEnabled) {
        const bars = window.__BAR_ZONES__ || [];

        for (let bar of bars) {
          const collision =
            pos.x < bar.x + bar.width &&
            pos.x + 60 > bar.x &&
            pos.y < bar.y + bar.height &&
            pos.y + 60 > bar.y;

          if (collision) onCollision(bar);
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }, [pos, spriteIndex, collisionEnabled]);


  // Movimiento por acelerómetro
  useEffect(() => {
    function handleMotion(event) {
      const ax = event.accelerationIncludingGravity.x;
      const ay = event.accelerationIncludingGravity.y;

      if (Math.abs(ax) + Math.abs(ay) > 0.15) {
        setPos(prev => ({
          x: Math.max(0, Math.min(prev.x + ax * -2, window.innerWidth - 80)),
          y: Math.max(0, Math.min(prev.y + ay * 2, window.innerHeight - 80)),
        }));
        setSpriteIndex(i => (i + 1) % sprites.length);
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);


  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "300px",
        marginTop: "30px",
        background: "rgba(255,255,255,0.1)",
        border: "3px solid #ff7bff",
        zIndex: 10,
        position: "relative",
      }}
    />
  );
}
