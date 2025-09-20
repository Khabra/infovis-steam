import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div
          className="navbar-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img
            className="navbar-logo-img"
            src="/BacklogSteamLogo.png"
            alt="Backlog Logo"
          />
        </div>

        <button onClick={() => navigate('/about')}>About Us</button>
      </div>

      <div className="navbar-links">
        <button onClick={() => navigate('/backlog')}>Backlog General</button>
        <button onClick={() => navigate('/generos')}>Géneros</button>
      </div>
    </nav>
  );
};

export default Navbar;
