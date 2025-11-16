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

  const HITBOX_W = 27;
  const HITBOX_H = 24;

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
      });
  };

  // ---------- MOVIMIENTO + COLISIÓN ----------
  useEffect(() => {
    const player = document.getElementById("player");
    const chart = document.getElementById("chart-container");

    if (!player || !chart) return;

    let x = 5; // ✔ ahora comienza más a la izquierda
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

    function handleMotion(event) {
      const ax = event.accelerationIncludingGravity?.x ?? 0;
      const ay = event.accelerationIncludingGravity?.y ?? 0;

      // ROTACIÓN PARA MODO HORIZONTAL
      const dx = ay * 2;
      const dy = ax * -2; // invertido para corregir arriba/abajo

      if (Math.abs(dx) + Math.abs(dy) > 0.25) {
        x += dx;
        y += dy;

        x = Math.max(0, Math.min(x, chart.clientWidth - 45));
        y = Math.max(0, Math.min(y, chart.clientHeight - 40));

        player.style.left = `${x}px`;
        player.style.top = `${y}px`;

        updateSprite();
        checkCollisions();
      }
    }

    function checkCollisions() {
      let hit = false;

      for (let bar of window.__BAR_ZONES__ || []) {
        const coll =
          x < bar.x + bar.width &&
          x + HITBOX_W > bar.x &&
          y < bar.y + bar.height &&
          y + HITBOX_H > bar.y;

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

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  const closeCard = () => setSelectedGenero(null);

  return (
    <main className="landing-chart">

      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">
        Inclina tu celular para mover al personaje sobre las tuberías estilo Mario.
      </p>

      {(() => {
        window.__BAR_ZONES__ = [];
        return null;
      })()}

      <div
        id="chart-container"
        style={{
          position: "relative",
          width: "100%",
          height: "450px",
          overflow: "hidden",
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

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="porcentajeBL"
              stroke="#ff7bff"
              strokeWidth={4}
              dot={(p) => <MarioButtonDot {...p} />}
            />

            <Bar
              dataKey="Compradores"
              opacity={0}
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
                return <MarioPipe {...props} />;
              }}
            />

            <Bar dataKey="Jugadores" opacity={0} />
          </BarChart>
        </ResponsiveContainer>

        {/* PERSONAJE */}
        <img
          id="player"
          src={sprite1}
          style={{
            position: "absolute",
            width: "45px",
            height: "40px",
            top: "260px",
            left: "5px",
            zIndex: 999,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Popup más pequeño */}
      <GenderCard
        isOpen={!!selectedGenero}
        onClose={closeCard}
        {...selectedGenero}
      />

    </main>
  );
}
