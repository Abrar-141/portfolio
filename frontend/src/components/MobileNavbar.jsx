import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, Moon, Sun, Menu, X } from 'lucide-react';
import './MobileNavbar.css';

function MobileNavbar({ darkMode, setDarkMode, homeData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    console.log('Navigating to:', path);
    setMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked, current state:', menuOpen);
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="mobile-navbar">
        {/* Top Bar */}
        <div className="mobile-top-bar">
          <div className="mobile-profile-mini">
            {homeData.profileImage && <img src={homeData.profileImage} alt={homeData.name} />}
            <div>
              <h3>{homeData.name}</h3>
              <span className="mobile-status">
                <span className="pulse-dot"></span>
                Available
              </span>
            </div>
          </div>
          <div className="mobile-actions">
            <button onClick={() => setDarkMode(!darkMode)} className="mobile-theme-btn">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleMenuToggle} className="mobile-hamburger">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`mobile-menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={handleMenuToggle}
      ></div>

      {/* Sliding Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-profile">
            {homeData.profileImage && <img src={homeData.profileImage} alt={homeData.name} />}
            <div>
              <h2>{homeData.name}</h2>
              <p>
                <Code2 size={14} />
                {homeData.designation}
              </p>
            </div>
          </div>
          <button onClick={handleMenuToggle} className="drawer-close-btn">
            <X size={24} />
          </button>
        </div>

        <nav className="drawer-nav">
          <button onClick={() => handleNavClick('/')} className={isActive('/') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            Home
          </button>
          <button onClick={() => handleNavClick('/about')} className={isActive('/about') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            About
          </button>
          <button onClick={() => handleNavClick('/skills')} className={isActive('/skills') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            Skills
          </button>
          <button onClick={() => handleNavClick('/projects')} className={isActive('/projects') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            Projects
          </button>
          <button onClick={() => handleNavClick('/education')} className={isActive('/education') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            Education
          </button>
          <button onClick={() => handleNavClick('/certificates')} className={isActive('/certificates') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            Certificates
          </button>
          <button onClick={() => handleNavClick('/contact')} className={isActive('/contact') ? 'active' : ''}>
            <span className="nav-indicator"></span>
            Contact
          </button>
        </nav>
      </div>
    </>
  );
}

export default MobileNavbar;
