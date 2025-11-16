import React from "react";
import "./GenderCard.css";

export default function GenderCard({
  isOpen,
  onClose,
  genero,
  porcentajeBL,
  graficoDona,
}) {
  if (!isOpen) return null;

  return (
    <div className="card-background" onClick={onClose}>
      <div className="gender-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{genero}</h2>
        <p><strong>Backlog:</strong> {porcentajeBL}%</p>

        {graficoDona && (
          <img src={graficoDona} className="small-chart" />
        )}
      </div>
    </div>
  );
}
