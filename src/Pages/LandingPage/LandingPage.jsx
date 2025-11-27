// src/Pages/LandingPage/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
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

// Donut charts
import grafico8_7 from "/perc8_7.jpeg";
import grafico9_8 from "/perc9_8.jpeg";
import grafico19 from "/perc19.jpeg";
import grafico20 from "/perc20.jpeg";
import grafico23_4 from "/perc23_4.jpeg";
import grafico23 from "/perc23.jpeg";
import grafico25_9 from "/perc25_9.jpeg";
import grafico28_8 from "/perc28_8.jpeg";
import grafico29_5 from "/perc29_5.jpeg";

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
const SOCKET_URL = "http://192.168.0.16:3001";



export default function LandingPage() {
  const [selectedGenero, setSelectedGenero] = useState(null);
  const [interactionUnlocked, setInteractionUnlocked] = useState(false);

  // Detectar si somos "Control" (móvil) o "Pantalla" (PC)
  // Una forma simple es ver si la URL tiene ?role=controller
  const queryParams = new URLSearchParams(window.location.search);
  const isController = queryParams.get("role") === "controller";


  const audioBufferRef = useRef(null); // Guardaremos el sonido aquí
  const lastCollisionId = useRef(null); // Para recordar qué estamos tocando
  const scrollRef = useRef(null);
  const socketRef = useRef(null); 

  const HITBOX_W = 1;
  const HITBOX_H = 2;

  const isIOSDeviceMotionPermission =
    typeof window !== "undefined" &&
    window.DeviceMotionEvent &&
    typeof window.DeviceMotionEvent.requestPermission === "function";

  // ---------- Sonido ----------
const reproducirSonido = (porcentajeBL) => {
    if (!audioBufferRef.current) return; // Si no ha cargado, no hacer nada

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();
    
    source.buffer = audioBufferRef.current;
    
    // Calcular tono
    const ratio = porcentajeBL / 100;
    source.detune.value = (1 - Math.pow(ratio, 1.5)) * 2400 - 1200;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.75;

    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);
  };

//fix sonidos

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    fetch(sonidoBase)
      .then((r) => r.arrayBuffer())
      .then((buf) => audioCtx.decodeAudioData(buf))
      .then((decodedBuffer) => {
        audioBufferRef.current = decodedBuffer;
      })
      .catch((e) => console.error("Error cargando sonido:", e));
  }, []);


  // ---------- Movimiento ----------
  useEffect(() => {

    //Conectar al Socket
    socketRef.current = io(SOCKET_URL);


    const player = document.getElementById("player");
    // Si somos el control (celular), no necesitamos el elemento player visible necesariamente, 
    // pero si somos PC, sí.
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

    const updateScroll = (px) => {
      const scroll = scrollRef.current;
      if (!scroll) return;

      const maxScroll = scroll.scrollWidth - scroll.clientWidth;
      const ratio = px / scroll.clientWidth;

      scroll.scrollLeft = Math.min(maxScroll, Math.max(0, ratio * maxScroll));
    };
    const moveMario = (dx, dy) => {
        x += dx;
        y += dy;

        const container = scrollRef.current;
        // Seguridad
        if(!container) return; 
        
        // CAMBIO CLAVE: Usamos clientWidth (ancho visible) no scrollWidth
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Ajustamos los límites restando el tamaño de Mario
        // En tu CSS pusiste width: 70px y height: 75px para el player
        const marioW = 70;
        const marioH = 75;

        const maxX = containerWidth - marioW;
        const maxY = containerHeight - marioH;

        // CLAMPING (Mantener dentro de la caja)
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

      // ENVIAR AL SOCKET
      if (socketRef.current) {
          socketRef.current.emit('motion_data', { dx, dy });
      }
      

      // moveMario(dx, dy); descomentar para q salga mario en el celu dice
    }

    // --- RECIBIR DATOS (PC) ---
    if (!isController) {
        socketRef.current.on('update_mario', (data) => {
            // Recibimos los deltas calculados por el celular
            moveMario(data.dx, data.dy);
        });
    }

function checkCollisions(px, py) {
      let hit = false;
      let currentCollidedBtn = null;
      // Hacemos una hitbox lógica más pequeña en el centro de Mario
      // para que no choque "con el aire"
      const collisionX = px + 20; // +20px hacia la derecha
      const collisionY = py + 20; // +20px hacia abajo
      const collisionW = 20;      // Solo 20px de ancho efectivo
      const collisionH = 20;      // Solo 20px de alto efectivo

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
        // LÓGICA DE BLOQUEO:
        // Solo actuamos si la colisión es NUEVA (es diferente a la última registrada)
        if (lastCollisionId.current !== currentCollidedBtn.genero) {
            
            // 1. Guardamos el ID para no repetirlo en el siguiente frame
            lastCollisionId.current = currentCollidedBtn.genero;

            // 2. Ejecutamos efectos SOLO UNA VEZ
            if ("vibrate" in navigator) {
                // Enviar señal al socket para vibrar (si usas la lógica separada)
            }
            reproducirSonido(currentCollidedBtn.porcentajeBL);
            setSelectedGenero(currentCollidedBtn);
        }
      } else {
        // Si NO hay colisión (hit es false), reseteamos el bloqueo
        // Esto permite que si sales y vuelves a entrar, suene de nuevo.
        lastCollisionId.current = null;
      }
    }


    if (isController) {
        window.addEventListener("devicemotion", handleMotion);
    }

return () => {
        if (isController) window.removeEventListener("devicemotion", handleMotion);
        if (socketRef.current) socketRef.current.disconnect();
    };
  }, [interactionUnlocked, isController]); // Agregamos isController a dependencias


  const closeCard = () => setSelectedGenero(null);

  // ---------- Permisos ----------
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

  if (isController) {
    return (
        <div style={{display:'flex', flexDirection:'column', height:'100vh', justifyContent:'center', alignItems:'center', background:'#222', color:'white'}}>
            <h1>Modo Control</h1>
            <button className="motion-btn" onClick={handleActivateMotion} style={{padding: '20px', fontSize:'20px'}}>
                ACTIVAR CONTROL
            </button>
            <p>Mantén el celular horizontal e inclínalo para mover a Mario en la pantalla de tu PC.</p>
        </div>
      )





  }


    return (
    <main className="landing-chart">

      <button className="motion-btn" onClick={handleActivateMotion}>
        Activar movimiento
      </button>

      <h1 className="chart-title">Relación entre compradores y jugadores por género</h1>
      <p className="chart-description">
        Inclina tu celular para mover a Mario sobre el gráfico estilo nivel.
      </p>

      {(() => {
        window.__BUTTON_ZONES__ = [];
        return null;
      })()}

      <div id="chart-container" className="chart-container">
        <div ref={scrollRef} className="chart-scroll">
          <div className="parallax-layer layer-back"></div>
          <div className="parallax-layer layer-mid"></div>

          <div className="chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 20, right: 40, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                <XAxis dataKey="genero" stroke="#d8b4fe" angle={-20} textAnchor="end" />
                <YAxis stroke="#d8b4fe" />

                <YAxis yAxisId="right" orientation="right" stroke="#ff7bff" tick={false}/>

                <Bar
                  dataKey="Compradores"
                  fill="#8b00ff"
                  shape={(p) => <MarioPipe {...p} pipeColor="purple" />}
                />
                <Bar
                  dataKey="Jugadores"
                  fill="#00c49f"
                  shape={(p) => <MarioPipe {...p} pipeColor="green" />}
                />

                <Line
                  yAxisId="right"
                  dataKey="porcentajeBL"
                  type="monotone"
                  stroke="#ff7bff"
                  strokeWidth={3}
                  dot={(p) => <MarioButtonDot {...p} />}
                />
              </BarChart>
            </ResponsiveContainer>

            <img id="player" src={sprite1} className="player" />
          </div>
        </div>
      </div>

      <GenderCard isOpen={!!selectedGenero} onClose={closeCard} {...selectedGenero} />
    </main>
  );

}
