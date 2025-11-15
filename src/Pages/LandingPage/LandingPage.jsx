import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";
import "./LandingPage.css";
import sonidoBase from "/CoinSound.mp3";
import GenderCard from "../../Components/GenderCard/GenderCard";
import GameCanvas from "../../Components/GameCanvas/GameCanvas";

// 📊 Imágenes
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
import sprite1 from "/sprite1.png";
import sprite2 from "/sprite2.png";
import sprite3 from "/sprite3.png";


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

// Ordenar de menor a mayor backlog
const sortedData = [...data].sort((a, b) => a.porcentajeBL - b.porcentajeBL);

const LandingPage = () => {
  const [selectedGenero, setSelectedGenero] = useState(null);

  // 🎵 Reproduce el sonido de hover
  const reproducirSonido = (porcentajeBL) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();

    fetch(sonidoBase)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        source.buffer = buffer;

        // tono más agudo si backlog bajo
        const ratio = porcentajeBL / 100;
        const curva = Math.pow(ratio, 1.6);
        const detune = (1 - curva) * 2400 - 1200;

        source.detune.value = detune;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.6;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.start(0);
      })
      .catch((err) => console.error("Error al reproducir sonido:", err));
  };

  // 🟣 Hover sobre un punto
  const handleDotHover = (entry) => {
    if (entry?.porcentajeBL) {
      reproducirSonido(entry.porcentajeBL);
    }
  };

  // 🟣 Click en un punto
  const handleDotClick = (entry, e) => {
    if (!entry) return;
    const rect = e?.target?.getBoundingClientRect?.();
    setSelectedGenero({
      ...entry,
      posX: rect ? rect.x + rect.width / 2 : window.innerWidth / 2,
      posY: rect ? rect.y : window.innerHeight / 2 - 100,
    });
  };

  // 🟣 Click en backlog general
  const handleBacklogClick = () => {
    setSelectedGenero({
      genero: "Backlog General",
      porcentajeBL: 20.9,
      graficoDona: graficoGeneral,
      rank: 0,
      posX: window.innerWidth / 2,
      posY: window.innerHeight / 2,
    });
  };

  useEffect(() => {
    const player = document.getElementById("player");
    let x = 50;
    let y = 300;
    let spriteIndex = 0;
    const sprites = [sprite1, sprite2, sprite3];

    function updateSprite() {
      spriteIndex = (spriteIndex + 1) % sprites.length;
      player.src = sprites[spriteIndex];
    }

    function handleMotion(event) {
      if (!player) return;
      const ax = event.accelerationIncludingGravity.x;
      const ay = event.accelerationIncludingGravity.y;

      if (Math.abs(ax) + Math.abs(ay) > 0.15) {
        x += ax * -2;
        y += ay * 2;

        player.style.left = `${x}px`;
        player.style.top = `${y}px`;

        updateSprite();
        checkCollisions();
      }
    }

    function checkCollisions() {
      if (!window.__BAR_ZONES__) return;

      let collided = false;

      for (const bar of window.__BAR_ZONES__) {
        const px = x;
        const py = y;

        const collision =
          px < bar.x + bar.width &&
          px + 40 > bar.x &&
          py < bar.y + bar.height &&
          py + 40 > bar.y;

        if (collision) {
          collided = true;

          navigator.vibrate?.(Math.min(300, bar.porcentajeBL * 10));
          reproducirSonido(bar.porcentajeBL);

          setSelectedGenero({
            genero: bar.genero,
            porcentajeBL: bar.porcentajeBL,
            graficoDona: bar.graficoDona,
            rank: bar.rank,
            posX: window.innerWidth / 2,
            posY: window.innerHeight / 2,
          });

          break;
        }
      }

      // Si NO colisiona, cerrar popup
      if (!collided) {
        setSelectedGenero(null);
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);


  const closeCard = () => setSelectedGenero(null);

  return (
    <main className="landing-chart">
      {window.DeviceMotionEvent && DeviceMotionEvent.requestPermission && (
        <button
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "12px 20px",
            background: "#ff7bff",
            color: "white",
            borderRadius: "10px",
            fontSize: "16px",
            border: "none"
          }}
          onClick={async () => {
            const res = await DeviceMotionEvent.requestPermission();
            if (res === "granted") {
              alert("Sensores activados ✔ Inclina el celular para moverte");
            }
          }}
        >
          Activar movimiento
        </button>
      )}
      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">
        Esta visualización muestra el nivel de backlog promedio por género en Steam. 
        Los puntos representan el porcentaje de backlog: al explorarlos, descubrirás qué géneros
        los jugadores tienden a acumular sin jugar.
      </p>
      window.__BAR_ZONES__ = [];
      <ResponsiveContainer width="90%" height={450}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis dataKey="genero" stroke="#d8b4fe" angle={-20} textAnchor="end" interval={0} />
          <YAxis stroke="#d8b4fe" />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#ff7bff"
            domain={[0, 35]}
            tickFormatter={(v) => `${v}%`}
          />

          {/* 🔮 Línea de backlog interactiva */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="porcentajeBL"
            stroke="#ff7bff"
            strokeWidth={3}
            dot={{
              r: 6,
              fill: "#ffb8ff",
              stroke: "#fff",
              strokeWidth: 1,
              cursor: "pointer",
            }}
            activeDot={{
              r: 9,
              stroke: "#ffb8ff",
              strokeWidth: 2,
              fill: "#ff7bff",
              cursor: "pointer",
              onMouseEnter: (e, payload) => handleDotHover(payload.payload),
              onClick: (e, payload) => handleDotClick(payload.payload, e),
            }}
            name="Backlog (%)"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1a001f",
              border: "1px solid #8b0fff",
              color: "#fff",
            }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ color: "#d8b4fe" }} />

          {/* Barras solo como contexto visual */}
          <Bar
            dataKey="Compradores"
            fill="#8b0fff"
            opacity={0.3}
            shape={(props) => {
              if (props?.payload) {
                const barInfo = {
                  genero: props.payload.genero,
                  porcentajeBL: props.payload.porcentajeBL,
                  x: props.x,
                  y: props.y,
                  width: props.width,
                  height: props.height,
                  graficoDona: props.payload.graficoDona,
                  rank: props.payload.rank,
                };
                if (!window.__BAR_ZONES__) window.__BAR_ZONES__ = [];
                window.__BAR_ZONES__.push(barInfo);
              }
              return <rect {...props} />;
            }}
          />
          <Bar dataKey="Jugadores" fill="#00c49f" opacity={0.3} />
        </BarChart>
      </ResponsiveContainer>


      <img
        id="player"
        src={sprite1}
        style={{
          position: "absolute",
          width: "60px",
          height: "60px",
          top: "300px",
          left: "50px",
          zIndex: 999,
          transition: "transform 0.05s linear",
        }}
      />

      <button className="backlog-button" onClick={handleBacklogClick}>
        B A C K L O G
      </button>

      <GameCanvas
        onCollision={(bar) => {
          navigator.vibrate?.(Math.min(300, bar.porcentajeBL * 10));
          reproducirSonido(bar.porcentajeBL);

          setSelectedGenero({
            genero: bar.genero,
            porcentajeBL: bar.porcentajeBL,
            graficoDona: bar.graficoDona,
            rank: bar.rank,
            posX: window.innerWidth / 2,
            posY: window.innerHeight / 2,
          });
        }}
      />

      <GenderCard
        isOpen={!!selectedGenero}
        onClose={closeCard}
        genero={selectedGenero?.genero}
        porcentajeBL={selectedGenero?.porcentajeBL}
        graficoDona={selectedGenero?.graficoDona}
        ranking={selectedGenero?.rank}
        posX={selectedGenero?.posX}
        posY={selectedGenero?.posY}
      />

      <div><br /></div>
    </main>
  );
};

export default LandingPage;
