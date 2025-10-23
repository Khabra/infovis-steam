import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./LandingPage.css";
import sonidoBase from "/CoinSound.mp3";
import GenderCard from "../../Components/GenderCard/GenderCard";

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
  { genero: "Action", compradores: 1005, jugadores: 805, porcentajeBL: 20, graficoDona: grafico20, rank: -1 },
  { genero: "Adventure", compradores: 367, jugadores: 272, porcentajeBL: 25.9, graficoDona: grafico25_9, rank: 1 },
  { genero: "Casual", compradores: 218, jugadores: 156, porcentajeBL: 29.5, graficoDona: grafico29_5, rank: 2 },
  { genero: "Free to Play", compradores: 46, jugadores: 42, porcentajeBL: 8.7, graficoDona: grafico8_7, rank: -2 },
  { genero: "Indie", compradores: 259, jugadores: 210, porcentajeBL: 19, graficoDona: grafico19, rank: -1 },
  { genero: "RPG", compradores: 73, jugadores: 52, porcentajeBL: 28.8, graficoDona: grafico28_8, rank: 1 },
  { genero: "Racing", compradores: 30, jugadores: 23, porcentajeBL: 23.4, graficoDona: grafico23_4, rank: 1 },
  { genero: "Simulation", compradores: 82, jugadores: 74, porcentajeBL: 9.8, graficoDona: grafico9_8, rank: -1 },
  { genero: "Strategy", compradores: 74, jugadores: 57, porcentajeBL: 23, graficoDona: grafico23, rank: 1 },
];

// Ordenar de menor a mayor backlog
const sortedData = [...data].sort((a, b) => a.porcentajeBL - b.porcentajeBL);

const LandingPage = () => {
  const [selectedGenero, setSelectedGenero] = useState(null);
  const [hoveredGenero, setHoveredGenero] = useState(null);

  const reproducirSonido = (porcentajeBL) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();

    fetch(sonidoBase)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        source.buffer = buffer;

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

  const handleMouseEnterBar = (entry) => {
    reproducirSonido(entry.porcentajeBL);
    setHoveredGenero(entry.genero);
  };

  const handleMouseLeaveBar = () => setHoveredGenero(null);

  const handleChartClick = (state) => {
    if (!state?.activePayload?.length || !state.activeCoordinate) return;

    const entry = state.activePayload[0].payload;
    const { x, y } = state.activeCoordinate;

    setSelectedGenero({
      ...entry,
      posX: x,
      posY: y + 100,
    });
  };

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


  const closeCard = () => setSelectedGenero(null);

  return (
    <main className="landing-chart">
      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">
        Esta visualización muestra el nivel de backlog promedio por género en Steam. 
        Al explorar cada barra, descubrirás qué tipos de juegos los usuarios tienden a postergar.
      </p>

      <ResponsiveContainer width="90%" height={450}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis dataKey="genero" stroke="#d8b4fe" angle={-20} textAnchor="end" interval={0} />
          <YAxis stroke="#d8b4fe" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a001f",
              border: "1px solid #8b0fff",
              color: "#fff",
            }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ color: "#d8b4fe" }} />

          <Bar
            dataKey="compradores"
            fill="#8b0fff"
            cursor="pointer"
            isAnimationActive={true}
            animationDuration={800}
            onMouseEnter={(data) => handleMouseEnterBar(data.payload)}
            onMouseLeave={handleMouseLeaveBar}
            onClick={(data) => {
              const entry = data.payload;
              setSelectedGenero({
                ...entry,
                posX: window.innerWidth / 2,
                posY: window.innerHeight / 2 - 100,
              });
            }}
          />

          <Bar
            dataKey="jugadores"
            fill="#00c49f"
            cursor="pointer"
            isAnimationActive={true}
            animationDuration={800}
            onMouseEnter={(data) => handleMouseEnterBar(data.payload)}
            onMouseLeave={handleMouseLeaveBar}
            onClick={(data) => {
              const entry = data.payload;
              setSelectedGenero({
                ...entry,
                posX: window.innerWidth / 2,
                posY: window.innerHeight / 2 - 100,
              });
            }}
          />

        </BarChart>
      </ResponsiveContainer>

      <button className="backlog-button" onClick={handleBacklogClick}>
         B A C K L O G 
      </button>

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

      <div>
        <br/>
      </div>

    </main>
  );
};

export default LandingPage;
