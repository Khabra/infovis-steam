// src/Pages/LandingPage/LandingPage.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

import "./LandingPage.css";
import sonidoBase from "/CoinSound.mp3";
import GenderCard from "../../Components/GenderCard/GenderCard";
import MarioPipe from "../../Components/MarioPipe/MarioPipe";
import MarioButtonDot from "../../Components/MarioButtonDot/MarioButtonDot";

// Sprites
import sprite1 from "/sprite1.png";
import sprite2 from "/sprite2.png";
import sprite3 from "/sprite3.png";

// Imágenes del gráfico (donas)
import grafico8_7 from "/perc8_7.jpeg";
import grafico9_8 from "/perc9_8.jpeg";
import grafico19 from "/perc19.jpeg";
import grafico20 from "/perc20.jpeg";
import grafico23_4 from "/perc23_4.jpeg";
import grafico23 from "/perc23.jpeg";
import grafico25_9 from "/perc25_9.jpeg";
import grafico28_8 from "/perc28_8.jpeg";
import grafico29_5 from "/perc29_5.jpeg";
import graficoGeneral from "/perc_gen.jpeg";

const data = [
  { genero: "Action", Compradores: 1005, Jugadores: 805, porcentajeBL: 20, graficoDona: grafico20, rank: -1 },
  { genero: "Adventure", Compradores: 367, Jugadores: 272, porcentajeBL: 25.9, graficoDona: grafico25_9, rank: 1 },
  { genero: "Casual", Compradores: 218, Jugadores: 153, porcentajeBL: 29.5, graficoDona: grafico29_5, rank: 2 },
  { genero: "Free to Play", Compradores: 46, Jugadores: 42, porcentajeBL: 8.7, graficoDona: grafico8_7, rank: -2 },
  { genero: "Indie", Compradores: 259, Jugadores: 210, porcentajeBL: 19, graficoDona: grafico19, rank: -1 },
  { genero: "RPG", Compradores: 73, Jugadores: 52, porcentajeBL: 28.8, graficoDona: grafico28_8, rank: 1 },
  { genero: "Racing", Compradores: 30, Jugadores: 23, porcentajeBL: 23.4, graficoDona: grafico23_4, rank: 1 },
  { genero: "Simulation", Compradores: 82, Jugadores: 74, porcentajeBL: 9.8, graficoDona: grafico9_8, rank: -1 },
  { genero: "Strategy", Compradores: 74, Jugadores: 57, porcentajeBL: 23, graficoDona: grafico23, rank: 1 },
];

const sortedData = [...data].sort((a, b) => a.porcentajeBL - b.porcentajeBL);

export default function LandingPage() {
  const [selectedGenero, setSelectedGenero] = useState(null);
  const [interactionUnlocked, setInteractionUnlocked] = useState(false);

  const HITBOX_W = 27;
  const HITBOX_H = 24;

  const isIOSDeviceMotionPermission =
    typeof window !== "undefined" &&
    window.DeviceMotionEvent &&
    typeof window.DeviceMotionEvent.requestPermission === "function";

  // ---------- SONIDO ----------
  const reproducirSonido = (porcentajeBL) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();

    fetch(sonidoBase)
      .then((r) => r.arrayBuffer())
      .then((buf) => audioCtx.decodeAudioData(buf))
      .then((audioBuffer) => {
        source.buffer = audioBuffer;

        const ratio = porcentajeBL / 100;
        source.detune.value = (1 - Math.pow(ratio, 1.5)) * 2400 - 1200;

        const gain = audioCtx.createGain();
        gain.gain.value = 0.7;

        source.connect(gain);
        gain.connect(audioCtx.destination);

        source.start(0);
      })
      .catch(() => {});
  };

  // ---------- MOVIMIENTO + COLISIÓN SOLO CON BOTONES ----------
  useEffect(() => {
    const player = document.getElementById("player");
    const chart = document.getElementById("chart-container");
    const layerBack = document.querySelector("#chart-container .layer-back");
    const layerMid = document.querySelector("#chart-container .layer-mid");

    if (!player || !chart) return;

    let x = 5;    // casi borde izquierdo
    let y = 260;

    let spriteIndex = 0;
    const sprites = [sprite1, sprite2, sprite3];
    let lastSprite = 0;

    function updateSprite() {
      const now = Date.now();
      if (now - lastSprite > 95) {
        spriteIndex = (spriteIndex + 1) % sprites.length;
        player.src = sprites[spriteIndex];
        lastSprite = now;
      }
    }

    function updateParallax(px) {
      if (!layerBack || !layerMid) return;
      const w = chart.clientWidth || 1;
      const t = px / w; // 0 → izquierda, 1 → derecha

      const backShift = -t * 30; // capa lejana: se mueve menos
      const midShift = -t * 60;  // capa media: se mueve más

      layerBack.style.transform = `translateX(${backShift}px)`;
      layerMid.style.transform = `translateX(${midShift}px)`;
    }

    function handleMotion(event) {
      const ax = event.accelerationIncludingGravity?.x ?? 0;
      const ay = event.accelerationIncludingGravity?.y ?? 0;

      // Móvil en horizontal:
      // derecha/izquierda ← ay
      // arriba/abajo      ← ax
      const dx = ay * 2;
      const dy = ax * 2;

      if (Math.abs(dx) + Math.abs(dy) > 0.25) {
        x += dx;
        y += dy;

        x = Math.max(0, Math.min(x, chart.clientWidth - 45));
        y = Math.max(0, Math.min(y, chart.clientHeight - 40));

        player.style.left = `${x}px`;
        player.style.top = `${y}px`;

        updateSprite();
        updateParallax(x);
        checkCollisions(x, y);
      }
    }

    function checkCollisions(px, py) {
      let hit = false;

      for (let btn of window.__BUTTON_ZONES__ || []) {
        const coll =
          px < btn.x + btn.width &&
          px + HITBOX_W > btn.x &&
          py < btn.y + btn.height &&
          py + HITBOX_H > btn.y;

        if (coll) {
          hit = true;

          if (interactionUnlocked && "vibrate" in navigator) {
            const ms = Math.min(400, btn.porcentajeBL * 15);
            navigator.vibrate(ms);
          }

          reproducirSonido(btn.porcentajeBL);

          setSelectedGenero({
            genero: btn.genero,
            porcentajeBL: btn.porcentajeBL,
            graficoDona: btn.graficoDona,
            rank: btn.rank,
            posX: window.innerWidth / 2,
            posY: window.innerHeight / 2,
          });

          break;
        }
      }

      if (!hit) setSelectedGenero(null);
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [interactionUnlocked]);

  const closeCard = () => setSelectedGenero(null);

  // ---------- HANDLER PARA ACTIVAR MOVIMIENTO / VIBRACIÓN ----------
  const handleActivateMotion = async () => {
    let ok = true;

    if (isIOSDeviceMotionPermission) {
      try {
        const res = await window.DeviceMotionEvent.requestPermission();
        ok = res === "granted";
      } catch {
        ok = false;
      }
    }

    if (ok) {
      setInteractionUnlocked(true);
      window.__INTERACTION_UNLOCKED__ = true;
      alert("Sensores activados. Inclina el celular para moverte.");
    } else {
      alert("No se pudieron activar los sensores (permiso denegado).");
    }
  };

  // ---------- RENDER ----------
  return (
    <main className="landing-chart">

      {/* Botón de permisos / desbloqueo interacción */}
      <button
        className="motion-btn"
        onClick={handleActivateMotion}
      >
        Activar movimiento
      </button>

      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">
        Inclina tu celular para mover al personaje sobre las tuberías estilo Mario y presiona los botones luminosos del gráfico.
      </p>

      {/* Reset de zonas de botones en cada render */}
      {(() => {
        if (typeof window !== "undefined") {
          window.__BUTTON_ZONES__ = [];
        }
        return null;
      })()}

      <div
        id="chart-container"
        className="chart-container"
      >
        {/* PARALLAX SOLO DENTRO DEL CONTENEDOR */}
        <div className="chart-parallax">
          <div className="parallax-layer layer-back" />
          <div className="parallax-layer layer-mid" />
        </div>

        <div className="chart-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />

              <XAxis
                dataKey="genero"
                stroke="#d8b4fe"
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#d8b4fe" />

              {/* Barras primero (para quedar debajo) */}
              <Bar
                dataKey="Compradores"
                fill="#8b0fff"
                shape={(props) => (
                  <MarioPipe {...props} pipeColor="purple" />
                )}
              />

              <Bar
                dataKey="Jugadores"
                fill="#00c49f"
                shape={(props) => (
                  <MarioPipe {...props} pipeColor="green" />
                )}
              />

              {/* Línea y puntos encima de las barras */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="porcentajeBL"
                stroke="#ff7bff"
                strokeWidth={3}
                dot={(p) => <MarioButtonDot {...p} />}
                activeDot={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a001f",
                  border: "1px solid #8b0fff",
                  color: "#fff",
                  fontSize: 12,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PERSONAJE SOBRE EL GRÁFICO */}
        <img
          id="player"
          src={sprite1}
          style={{
            position: "absolute",
            width: "45px",
            height: "40px",
            top: "260px",
            left: "5px",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Popup de info (ya reducido y sin oscurecer tanto el fondo en tu versión previa) */}
      <GenderCard
        isOpen={!!selectedGenero}
        onClose={closeCard}
        {...selectedGenero}
      />
    </main>
  );
}
