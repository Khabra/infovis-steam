import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <main className="landing">
      <section className="landing-content">
        <div className="landing-text">
          <h1>Backlog en los juegos de Steam</h1>
          <p>
            En videojuegos, el Backlog corresponde al conjunto de títulos adquiridos que aún 
            no han sido iniciados o finalizados, evidenciando la acumulación de contenidos 
            pendientes de jugar.
          </p>
          <p>
            En esta página se presenta un análisis por géneros de videojuegos, con el objetivo
            de examinar y visualizar el backlog asociado a cada uno, a partir de la información
            recopilada.
          </p>
          <p>
            Para comenzar, se muestra un gráfico general sobre el backlog en videojuegos de Steam. 
            Además, podrás explorar distintos géneros mediante los botones disponibles, con el fin 
            de responder a la pregunta: ¿Cuál es el género más acumulado en los backlogs?
          </p>

        </div>

        <div className="landing-media">
          <div className="image-box">
            <span>Espacio para gráfico insano así damn...</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
