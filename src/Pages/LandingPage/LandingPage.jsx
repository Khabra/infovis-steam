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

// Sprites del personaje
import sprite1 from "/sprite1.png";
import sprite2 from "/sprite2.png";
import sprite3 from "/sprite3.png";

// Imágenes del gráfico
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

// Datos
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
  const [worldX, setWorldX] = useState(0); // 🔥 desplazamiento del mundo

  const HITBOX_W = 27;
  const HITBOX_H = 24;

  // ----- SONIDO -----
  const reproducirSonido = (porcentajeBL) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();

    fetch(sonidoBase)
      .then((res) => res.arrayBuffer())
      .then((buf) => audioCtx.decodeAudioData(buf))
      .then((audioBuffer) => {
        source.buffer = audioBuffer;

        const ratio = porcentajeBL / 100;
        const curva = Math.pow(ratio, 1.6);
        const detune = (1 - curva) * 2400 - 1200;

        source.detune.value = detune;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.8;

        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.start(0);
      });
  };

  // -----------------------
  //   MOVIMIENTO PARALLAX
  // -----------------------
  useEffect(() => {
    const chart = document.getElementById("chart-container");
    if (!chart) return;

    let spriteIndex = 0;
    const sprites = [sprite1, sprite2, sprite3];
    let lastSpriteChange = 0;

    const player = document.getElementById("player");

    function updateSprite() {
      const now = Date.now();
      if (now - lastSpriteChange > 90) {
        spriteIndex = (spriteIndex + 1) % sprites.length;
        if (player) player.src = sprites[spriteIndex];
        lastSpriteChange = now;
      }
    }

    function checkCollisions(worldPos) {
      const bars = window.__BAR_ZONES__ || [];
      let hit = false;

      const xPlayer = window.innerWidth / 2 - HITBOX_W / 2;

      for (let bar of bars) {
        const coll =
          xPlayer < (bar.x + worldPos) + bar.width &&
          xPlayer + HITBOX_W > (bar.x + worldPos) &&
          260 < bar.y + bar.height &&
          260 + HITBOX_H > bar.y;

        if (coll) {
          hit = true;

          navigator.vibrate?.(Math.min(400, bar.porcentajeBL * 12));
          reproducirSonido(bar.porcentajeBL);

          setSelectedGenero({
            ...bar,
            posX: window.innerWidth / 2,
            posY: window.innerHeight / 2,
          });

          break;
        }
      }

      if (!hit) setSelectedGenero(null);
    }

    function handleMotion(event) {
      const ax = event.accelerationIncludingGravity?.x ?? 0;
      const ay = event.accelerationIncludingGravity?.y ?? 0;

      // 🔥 Ejes rotados
      const dx = ay * 3;

      const worldWidth = sortedData.length * 280;
      const limitLeft = -(worldWidth - window.innerWidth);
      const limitRight = 0;

      if (Math.abs(dx) > 0.25) {
        setWorldX((prev) => {
          const next = Math.max(limitLeft, Math.min(prev - dx, limitRight));
          checkCollisions(next);
          return next;
        });

        updateSprite();
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  const closeCard = () => setSelectedGenero(null);

  return (
    <main className="landing-chart">

      {/* Permiso en iPhone */}
      {window.DeviceMotionEvent &&
        DeviceMotionEvent.requestPermission && (
          <button
            className="motion-btn"
            onClick={async () => {
              const res = await DeviceMotionEvent.requestPermission();
              if (res === "granted") alert("Sensores activados.");
            }}
          >
            Activar movimiento
          </button>
      )}

      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">
        Inclina el celular para recorrer el nivel y descubrir información.
      </p>

      {/* Reset zonas */}
      {(() => {
        window.__BAR_ZONES__ = [];
        return null;
      })()}

      {/* ---------------------------
             CONTENEDOR (ventana)
      ---------------------------- */}
      <div
        id="chart-container"
        style={{
          position: "relative",
          width: "100%",
          height: "450px",
          overflow: "hidden",
        }}
      >
        {/* ---------------------------
                MUNDO desplazable
        ---------------------------- */}
        <div
          id="world"
          style={{
            position: "absolute",
            top: 0,
            left: `${worldX}px`,
            height: "450px",
            width: `${sortedData.length * 280}px`,
            transition: "left 0.03s linear",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="genero" stroke="#d8b4fe" angle={-20} textAnchor="end" />
              <YAxis stroke="#d8b4fe" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ff7bff"
                domain={[0, 35]}
                tickFormatter={(v) => `${v}%`}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="porcentajeBL"
                stroke="#ff7bff"
                strokeWidth={3}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a001f",
                  border: "1px solid #8b0fff",
                  color: "#fff",
                }}
              />

              {/* Registro de zonas */}
              <Bar
                dataKey="Compradores"
                fill="#8b0fff"
                opacity={0.25}
                shape={(props) => {
                  window.__BAR_ZONES__.push({
                    genero: props.payload.genero,
                    porcentajeBL: props.payload.porcentajeBL,
                    graficoDona: props.payload.graficoDona,
                    rank: props.payload.rank,
                    x: props.x,
                    y: props.y,
                    width: props.width,
                    height: props.height,
                  });
                  return <rect {...props} />;
                }}
              />

              <Bar dataKey="Jugadores" fill="#00c49f" opacity={0.25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---------------------------
                 PERSONAJE
        ---------------------------- */}
        <img
          id="player"
          src={sprite1}
          style={{
            position: "absolute",
            width: "45px",
            height: "40px",
            top: "260px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Popup */}
      <GenderCard
        isOpen={!!selectedGenero}
        onClose={closeCard}
        {...selectedGenero}
      />
    </main>
  );
}
