import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Github, Linkedin, Mail, Download, ExternalLink, MapPin, Phone, Sparkles, Code2, Zap, Menu, X } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/Home.css';
import '../CSS/Responsive.css';

function Home({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeData, setHomeData] = useState({
    profileImage: '',
    heroImage: '',
    cvFile: '',
    heroTitle: 'Crafting Digital',
    heroSubtitle: 'Experiences',
    heroDescription: 'Full-Stack Developer specializing in MERN Stack & React Native. Transforming ideas into scalable, high-performance applications with modern design principles.',
    email: 'abrariqbal141@gmail.com',
    github: 'https://github.com/Abrar-afk-141',
    linkedin: 'https://www.linkedin.com/in/hâfîz-abrâr-449956281',
    projectsCount: '5+',
    name: 'Hafiz Abrar Iqbal',
    designation: 'Software Engineer'
  });
  const fullText = 'a Developer';

  useEffect(() => {
    document.title = 'Home - Hafiz Abrar Iqbal';
    setIsVisible(true);
    
    // Fetch home data from API
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched home data:', data);
        setHomeData(data);
      })
      .catch(err => console.error('Error fetching home data:', err));
    
    // Typing animation
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    // Mouse tracking
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(typingInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleNavClick = (path) => {
    setMenuOpen(false);
    if (path === '/') {
      navigate('/');
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <MobileNavbar darkMode={darkMode} setDarkMode={setDarkMode} homeData={homeData} />
      {/* High-Class Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-glow"></div>
        <div className="profile-section">
          <div className="profile-img-outer">
            <div className="profile-img-container">
              {homeData.profileImage && (
                <img 
                  src={homeData.profileImage} 
                  alt="Hafiz Abrar Iqbal" 
                  style={{ imageRendering: 'high-quality' }}
                />
              )}
              <div className="img-border-animation"></div>
            </div>
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              <span>Available</span>
            </div>
          </div>
          <h2 className="name">{homeData.name}</h2>
          <p className="title">
            <Code2 size={14} className="title-icon" />
            {homeData.designation}
          </p>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="theme-btn-compact">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <a onClick={() => handleNavClick('/')} className="nav-item active">
            <span className="nav-dot"></span>
            <span className="nav-text">Home</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/about')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">About</span>
            <span className="nav-line"></span>
          </a>
          {['Skills', 'Projects', 'Education', 'Certificates', 'Contact'].map((item, idx) => (
            <a 
              key={item} 
              onClick={() => handleNavClick(`/${item.toLowerCase()}`)} 
              className="nav-item"
            >
              <span className="nav-dot"></span>
              <span className="nav-text">{item}</span>
              <span className="nav-line"></span>
            </a>
          ))}
        </nav>

        
      </aside>

      {/* Hero Section */}
      <main className="hero-section">
        {/* Animated Background */}
        <div className="bg-animated">
          <div className="gradient-sphere sphere-1"></div>
          <div className="gradient-sphere sphere-2"></div>
          <div className="gradient-sphere sphere-3"></div>
        </div>
        <div className="floating-shapes">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="shape" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
        <div 
          className="cursor-glow" 
          style={{ left: mousePos.x, top: mousePos.y }}
        ></div>

        <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>

          
          <h1 className="hero-text">
            <span className="text-line-1">{homeData.heroTitle}</span> <br />
            <span className="gradient-text typing-text">
              {homeData.heroSubtitle}
              <span className="cursor-blink">_</span>
            </span>
          </h1>
          
          <p className="hero-description">
            {homeData.heroDescription}
          </p>

          <div className="hero-btns">
            <a href={homeData.cvFile} download="Hafiz_Abrar_CV.pdf" className="btn-sub">
              <span>CV Download</span>
              <Download size={18} />
              <div className="btn-border-animation"></div>
            </a>
          </div>
          
          {/* Footer Info Inline */}
          <div className="footer-info-inline">
            <div className="social-links-inline">
              <a href={`mailto:${homeData.email}`} className="social-icon-inline" title="Email" target="_blank" rel="noopener noreferrer">
                <Mail size={20} />
              </a>
              <a href={homeData.github} className="social-icon-inline" title="GitHub" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href={homeData.linkedin} className="social-icon-inline" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
            <p className="copyright-inline">
              © 2026 Powered by Hafiz Abrar Iqbal
            </p>
          </div>
        </div>

        {/* Right Side Full Adjusted Image */}
        <div className="hero-image-frame">
            <div className="image-decoration">
              <div className="deco-corner deco-tl"></div>
              <div className="deco-corner deco-tr"></div>
              <div className="deco-corner deco-bl"></div>
              <div className="deco-corner deco-br"></div>
            </div>
            <div className="image-glow-ring"></div>
            {homeData.heroImage && (
              <img 
                src={homeData.heroImage} 
                alt="Hafiz Abrar Iqbal" 
                className="portrait-img"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                style={{ imageRendering: 'high-quality' }}
              />
            )}
            <div className="overlay-shade">
              <div className="overlay-gradient"></div>
            </div>
            <div className="floating-stats">
              <div className="stat-item">
                <span className="stat-number">{homeData.projectsCount}</span>
                <span className="stat-label">Projects</span>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}

export default Home;