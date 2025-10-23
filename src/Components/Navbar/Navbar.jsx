import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoUrl from '/BacklogSteamLogo.png';
import GenderCard from '../../Components/GenderCard/GenderCard';
import graficoGeneral from '/perc_gen.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  const [showGeneralCard, setShowGeneralCard] = useState(false);

  const openGeneralCard = () => setShowGeneralCard(true);
  const closeGeneralCard = () => setShowGeneralCard(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div
            className="navbar-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="navbar-logo-img"
              src={logoUrl}
              alt="Backlog Logo"
            />
          </div>
        </div>
        {/*
        <div className="navbar-links">
          <button onClick={openGeneralCard}>Backlog General</button>
        </div>
        */}
      </nav>
    {/* 
      <GenderCard
        isOpen={showGeneralCard}
        onClose={closeGeneralCard}
        genero="Backlog General"
        porcentajeBL={20.9}
        graficoDona={graficoGeneral}
        ranking={0}
      />
    */}
    </>
  );
};

export default Navbar;
