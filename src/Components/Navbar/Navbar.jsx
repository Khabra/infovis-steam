import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoUrl from '/BacklogSteamLogo.png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img className="navbar-logo-img" src={logoUrl} alt="Backlog Logo" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
