import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoUrl from '/BacklogSteamLogo.png';

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
            src={logoUrl}
            alt="Backlog Logo"
          />
        </div>
      </div>

      <div className="navbar-links">
        <button onClick={() => navigate('/backlog')}>Backlog General</button>
      </div>
    </nav>
  );
};

export default Navbar;
