import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoUrl from '/BacklogSteamLogo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    function checkOrientation() {
      const isMobile = /Android|iPhone|iPad|iPod|Xiaomi|Redmi/i.test(navigator.userAgent);
      const isLandscape = window.innerWidth > window.innerHeight;

      // Ocultar navbar si estoy en móvil horizontal
      if (isMobile && isLandscape) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
    }

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Si debe esconderse → no renderizar el navbar
  if (hideNavbar) return null;

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
    </nav>
  );
};

export default Navbar;
