import React from 'react';
import './GenderCard.css';

const GenderCard = ({ isOpen, onClose, genero, porcentajeBL, graficoDona }) => {
  if (!isOpen || !genero) return null; // no mostrar si no hay datos

  return (
    <div className="overlay" onClick={onClose}>
      <div className="gender-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="card-content">
          {/* 📄 Sección de texto */}
          <div className="card-info">
            <h2>{genero}</h2>
            <p><strong>Backlog promedio:</strong> {porcentajeBL}%</p>
            <p className="extra-info">
              Este género presenta un backlog promedio del {porcentajeBL}%, lo que indica
              la proporción de jugadores que compraron un título pero aún no lo han jugado.
            </p>
          </div>

          {/* 📊 Sección de gráfico */}
          <div className="card-image">
            {graficoDona ? (
              <img src={graficoDona} alt={`Gráfico del género ${genero}`} />
            ) : (
              <p style={{ color: '#bbb' }}>No hay gráfico disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderCard;
