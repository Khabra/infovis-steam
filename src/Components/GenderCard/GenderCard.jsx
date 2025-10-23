import React, { useEffect } from "react";
import "./GenderCard.css";
import goodSound from "/GoodGame.mp3";
import badSound from "/BadGame.mp3";

const GenderCard = ({ isOpen, onClose, genero, porcentajeBL, graficoDona, ranking, posX, posY }) => {
  if (!isOpen || !genero) return null;

  let mensaje = "";
  if (ranking === 2) mensaje = `${genero} tiene el mayor porcentaje de backlog...`;
  else if (ranking === 1) mensaje = `El porcentaje de backlog de ${genero} es mayor al promedio.`;
  else if (ranking === 0) mensaje = `El porcentaje de backlog de ${genero} es exactamente el promedio.`;
  else if (ranking === -1) mensaje = `¡El porcentaje de backlog de ${genero} es menor al promedio!`;
  else mensaje = `¡${genero} tiene el menor porcentaje de backlog!`;

  let mensajeGeneral =
    "Este género refleja el comportamiento de los jugadores en relación con su disposición a iniciar nuevos juegos dentro de su biblioteca de Steam.";

  if (genero === "Backlog General") {
    mensajeGeneral =
      "Si miramos de manera panorámica el backlog a lo largo de todos los videojuegos de Steam, nos encontramos con que el porcentaje de backlog ronda el 20.9%.";
  }

  // 🎵 Reproduce sonidos al abrir la tarjeta según el género
  useEffect(() => {
    if (!isOpen || !genero) return;

    let sonidoSeleccionado = null;

    if (genero.toLowerCase() === "free to play") {
      sonidoSeleccionado = goodSound; // sonido positivo
    } else if (genero.toLowerCase() === "casual") {
      sonidoSeleccionado = badSound; // sonido negativo
    }

    if (sonidoSeleccionado) {
      const audio = new Audio(sonidoSeleccionado);
      audio.volume = 0.7;
      audio.play().catch(() => {});
    }
  }, [isOpen, genero]);

  const cardStyle = {
    transformOrigin: `${posX}px ${posY}px`,
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="gender-card"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="card-content">
          <div className="card-info">
            <h2>{genero}</h2>
            <p>
              <strong>Backlog promedio:</strong> {porcentajeBL}%
            </p>
            <p className="extra-info">{mensaje}</p>
            <p>{mensajeGeneral}</p>
          </div>

          <div className="card-image">
            {graficoDona ? (
              <img src={graficoDona} alt={`Gráfico del género ${genero}`} />
            ) : (
              <p style={{ color: "#bbb" }}>No hay gráfico disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderCard;
