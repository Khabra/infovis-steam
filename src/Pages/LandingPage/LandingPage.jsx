import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  Customized
} from "recharts";

import "./LandingPage.css";

// --- SONIDOS ---
import sonidoBase from "/CoinSound.mp3";

// --- COMPONENTES ---
import GenderCard from "../../Components/GenderCard/GenderCard";
import MarioPipe from "../../Components/MarioPipe/MarioPipe";
import MarioButtonDot from "../../Components/MarioButtonDot/MarioButtonDot";

// --- IMÁGENES (Assets) ---
import sprite1 from "/sprite1.png";
import sprite2 from "/sprite2.png";
import sprite3 from "/sprite3.png";

import coin from "../../assets/coin.png";
import floorImg from "../../assets/floor.png";
// (Eliminado bgImg)

// --- IMÁGENES DONAS ---
import grafico8_7 from "/perc8_7.jpeg";
import grafico9_8 from "/perc9_8.jpeg";
import grafico19 from "/perc19.jpeg";
import grafico20 from "/perc20.jpeg";
import grafico23_4 from "/perc23_4.jpeg";
import grafico23 from "/perc23.jpeg";
import grafico25_9 from "/perc25_9.jpeg";
import grafico28_8 from "/perc28_8.jpeg";
import grafico29_5 from "/perc29_5.jpeg";

const rawData = [
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

const sortedData = [...rawData]
  .sort((a, b) => a.porcentajeBL - b.porcentajeBL)
  .map(item => ({
    ...item,
    maxBarHeight: Math.max(item.Compradores, item.Jugadores)
  }));

// --- SOCKET CONFIG AUTOMÁTICA ---
// Esto arregla el error ERR_CONNECTION_REFUSED
const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    return "https://infovis-steam.onrender.com";
  }
  // En local, usa la misma IP que estás usando en el navegador (sea localhost o 10.15...)
  return `http://${window.location.hostname}:3001`;
};

const SOCKET_URL = getSocketUrl();

export default function LandingPage() {
  const [selectedGenero, setSelectedGenero] = useState(null);
  const [interactionUnlocked, setInteractionUnlocked] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const isController = queryParams.get("role") === "controller";

  const audioBufferRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastCollisionId = useRef(null);
  const scrollRef = useRef(null);
  const socketRef = useRef(null); 

  const FLOOR_HEIGHT = 40;

  const isIOSDeviceMotionPermission =
    typeof window !== "undefined" &&
    window.DeviceMotionEvent &&
    typeof window.DeviceMotionEvent.requestPermission === "function";

  // --- CARGA DE SONIDO ---
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();

    fetch(sonidoBase)
      .then((r) => r.arrayBuffer())
      .then((buf) => audioCtxRef.current.decodeAudioData(buf))
      .then((decodedBuffer) => {
        audioBufferRef.current = decodedBuffer;
      })
      .catch((e) => console.error("Error cargando sonido:", e));
  }, []);

  const reproducirSonido = (porcentajeBL) => {
    if (!audioBufferRef.current || !audioCtxRef.current) return;
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    
    const ratio = porcentajeBL / 100;
    source.detune.value = (1 - Math.pow(ratio, 1.5)) * 2400 - 1200;

    const gain = audioCtxRef.current.createGain();
    gain.gain.value = 0.6; 

    source.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    source.start(0);
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    const player = document.getElementById("player");
    if (!player && !isController) return;

    let x = 40;
    let y = 200;
    let spriteIndex = 0;
    const sprites = [sprite1, sprite2, sprite3];
    let lastSprite = 0;

    const updateSprite = () => {
      const now = Date.now();
      if (now - lastSprite > 95) {
        spriteIndex = (spriteIndex + 1) % sprites.length;
        player.src = sprites[spriteIndex];
        lastSprite = now;
      }
    };

    const moveMario = (dx, dy) => {
        x += dx;
        y += dy;

        const container = scrollRef.current;
        if(!container) return; 
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const marioW = 70;
        const marioH = 75;
        const maxX = containerWidth - marioW;
        const maxY = containerHeight - marioH;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        if(player) {
            player.style.left = `${x}px`;
            player.style.top = `${y}px`;
        }

        updateSprite();
        checkCollisions(x, y);
    };

    function handleMotion(event) {
      if (!interactionUnlocked) return;
      const ax = event.accelerationIncludingGravity?.x ?? 0;
      const ay = event.accelerationIncludingGravity?.y ?? 0;
      const dx = ay * 2; 
      const dy = ax * 2;

      if (socketRef.current) {
          socketRef.current.emit('motion_data', { dx, dy });
      }
    }

    if (!isController) {
        socketRef.current.on('update_mario', (data) => {
            moveMario(data.dx, data.dy);
        });
    }

    function checkCollisions(px, py) {
      let hit = false;
      let currentCollidedBtn = null;
      
      const collisionX = px + 20; 
      const collisionY = py + 20; 
      const collisionW = 20;      
      const collisionH = 20;      

      for (let btn of window.__BUTTON_ZONES__ || []) {
        const coll =
          collisionX < btn.x + btn.width &&
          collisionX + collisionW > btn.x &&
          collisionY < btn.y + btn.height &&
          collisionY + collisionH > btn.y;

        if (coll) {
          hit = true;
          currentCollidedBtn = btn;
          break; 
        }
      }

      if (hit && currentCollidedBtn) {
        if (lastCollisionId.current !== currentCollidedBtn.genero) {
            lastCollisionId.current = currentCollidedBtn.genero;
            reproducirSonido(currentCollidedBtn.porcentajeBL);
            setSelectedGenero(currentCollidedBtn);
            
            if (socketRef.current) {
                socketRef.current.emit('feedback_event', { type: 'collision' });
            }
        }
      } else {
        lastCollisionId.current = null;
      }
    }

    if (isController) {
        window.addEventListener("devicemotion", handleMotion);
        socketRef.current.on('trigger_feedback', () => {
             if ("vibrate" in navigator) navigator.vibrate(50);
        });
    }

    return () => {
        if (isController) window.removeEventListener("devicemotion", handleMotion);
        if (socketRef.current) socketRef.current.disconnect();
    };
  }, [interactionUnlocked, isController]);

  const closeCard = () => setSelectedGenero(null);

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
      alert("Sensores activados. Inclina el celular.");
    } else {
      alert("No se pudieron activar los sensores.");
    }
  };


  const DrawFloor = (props) => {
    const { height, margin } = props;
    if (!margin || !height) return null;

    return (
      <g>
        <defs>
            <pattern id="floorPattern" patternUnits="userSpaceOnUse" width={FLOOR_HEIGHT} height={FLOOR_HEIGHT}>
                <rect width={FLOOR_HEIGHT} height={FLOOR_HEIGHT} fill="#5C3A1E" />
                <image href={floorImg} x={0} y={0} width={FLOOR_HEIGHT} height={FLOOR_HEIGHT} />
            </pattern>
        </defs>
        <rect 
            x={0} 
            y={height + margin.top} 
            width="100%" 
            height={FLOOR_HEIGHT} 
            fill="url(#floorPattern)" 
        />
      </g>
    );
  };


  if (isController) {
    return (
        <div className="controllerBG">
            <img src="/dpad.png" className="dpad" alt="dpad"></img>
            <div className="rectcontainer">
              <p className="rectangle"></p>
              <p className="rectangle"><span>SELECT</span><span>START</span></p>
              <div className="rectangleouterbox">
                <div className="rectangleinnerbox">
                  <button className="controllerbutton"></button>
                  <button className="controllerbutton" onClick={handleActivateMotion}></button>
                </div>
              </div>
              <p className="rectangle"></p>
            </div>
            <div className="buttoncontainer">
              <div className="buttongrey"><div className="buttonred"></div><p className="buttonlabel">B</p></div>
              <div className="buttongrey"><div className="buttonred"></div><p className="buttonlabel">A</p></div>
            </div>
          </div>
      )
  }


  return (
    <main className="landing-chart">
      <button className="motion-btn" onClick={handleActivateMotion}>Activar movimiento</button>
      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">Inclina tu celular para mover a Mario sobre el gráfico estilo nivel.</p>

      {(() => { window.__BUTTON_ZONES__ = []; return null; })()}

      <div id="chart-container" className="chart-container">
        <div ref={scrollRef} className="chart-scroll">
          <div className="parallax-layer layer-back"></div>
          <div className="parallax-layer layer-mid"></div>

          <div className="chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData} 
                margin={{ top: 20, right: 40, left: 10, bottom: FLOOR_HEIGHT }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                

                <Bar dataKey="Compradores" fill="#8b00ff" shape={(p) => <MarioPipe {...p} pipeColor="purple" />} />
                <Bar dataKey="Jugadores" fill="#00c49f" shape={(p) => <MarioPipe {...p} pipeColor="green" />} />

  
                <Customized component={DrawFloor} />


                <XAxis dataKey="genero" stroke="#d8b4fe" angle={-20} textAnchor="end" tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} dy={5} />
                <YAxis stroke="#d8b4fe" />


                <Line
                  dataKey="maxBarHeight"
                  type="monotone"
                  stroke="none"
                  dot={(p) => <MarioButtonDot {...p} image={coin} />} 
                />
              </BarChart>
            </ResponsiveContainer>

            <img id="player" src={sprite1} className="player" alt="mario" />
          </div>
        </div>
      </div>

      <GenderCard isOpen={!!selectedGenero} onClose={closeCard} {...selectedGenero} />
    </main>
  );
}