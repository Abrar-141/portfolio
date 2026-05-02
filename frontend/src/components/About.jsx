import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Palette, Smartphone, Award, Briefcase, GraduationCap, Sparkles, Moon, Sun, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/About.css';
import '../CSS/Responsive.css';

function About({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeData, setHomeData] = useState({
    profileImage: '',
    name: 'Hafiz Abrar Iqbal',
    designation: 'Software Engineer',
    email: 'abrariqbal141@gmail.com',
    github: 'https://github.com/Abrar-afk-141',
    linkedin: 'https://www.linkedin.com/in/hâfîz-abrâr-449956281'
  });
  const [aboutData, setAboutData] = useState({
    profileImage: '',
    name: 'Hafiz Abrar Iqbal',
    title: 'Software Engineer | UI/UX Designer',
    bio: '',
    quote: '',
    focus: [],
    stats: []
  });

  useEffect(() => {
    document.title = 'About - Hafiz Abrar Iqbal';
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => setHomeData(data))
      .catch(err => console.error('Error fetching home data:', err));
    
    fetch(`${API_URL}/api/about`)
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(err => console.error('Error fetching about data:', err));
  }, []);

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <MobileNavbar darkMode={darkMode} setDarkMode={setDarkMode} homeData={homeData} />
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-glow"></div>
        <div className="profile-section">
          <div className="profile-img-outer">
            <div className="profile-img-container">
              {homeData.profileImage && <img src={homeData.profileImage} alt={homeData.name} style={{ imageRendering: 'high-quality' }} />}
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
          <a onClick={() => handleNavClick('/')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">Home</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/about')} className="nav-item active">
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

        <div className="sidebar-footer">
        </div>
      </aside>

      {/* About Content */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">Get to know me better</p>
          </div>

          {/* Modern Profile Layout */}
          <div className="profile-layout-modern">
            <div className="profile-content-left">
              <div className="profile-info-box">
                <h1 className="profile-name-large">{aboutData.name}</h1>
                <p className="profile-title-large">{aboutData.title}</p>
              </div>
            </div>
            
            <div className="profile-left">
              <div className="profile-image-wrapper">
                <div className="image-glow-effect"></div>
                {aboutData.profileImage && (
                  <img 
                    src={aboutData.profileImage} 
                    alt={aboutData.name} 
                    className="profile-img-large"
                    loading="eager"
                    fetchpriority="high"
                    style={{ imageRendering: 'high-quality' }}
                  />
                )}
                <div className="image-border-animation"></div>
              </div>
            </div>
          </div>
          
          {(aboutData.bioHeading || aboutData.bio) && (
            <div className="bio-box-full">
              {aboutData.bioHeading && (
                <h3 className="bio-heading">{aboutData.bioHeading}</h3>
              )}
              
              {aboutData.bio && (
                <p className="bio-text-large">{aboutData.bio}</p>
              )}
            </div>
          )}

          {aboutData.focus && aboutData.focus.length > 0 && aboutData.focus[0].title && (
            <div className="focus-grid-modern">
              {aboutData.focus.map((item, idx) => (
                <div key={idx} className="focus-card-modern">
                  <div className="focus-icon-modern">
                    {idx === 0 && <Code2 size={32} />}
                    {idx === 1 && <Palette size={32} />}
                    {idx === 2 && <GraduationCap size={32} />}
                  </div>
                  <h3 className="focus-title-modern">{item.title}</h3>
                  <p className="focus-value-modern">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {aboutData.stats && aboutData.stats.length > 0 && aboutData.stats[0].number && (
            <div className="stats-grid-modern">
              {aboutData.stats.map((stat, idx) => (
                <div key={idx} className="stat-card-modern">
                  <div className="stat-number-modern">{stat.number}</div>
                  <div className="stat-label-modern">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {aboutData.quote && (
            <div className="quote-card-modern">
              <div className="quote-icon">"</div>
              <p className="quote-text-modern">{aboutData.quote}</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="cta-section-modern">
            <div className="cta-content">
              <h2>Let's Work Together</h2>
              <p>Have a project in mind? Let's create something amazing together!</p>
              <div className="cta-buttons">
                <button onClick={() => navigate('/contact')} className="cta-btn-primary">
                  <Mail size={20} />
                  Get In Touch
                </button>
                <button onClick={() => navigate('/projects')} className="cta-btn-secondary">
                  <Briefcase size={20} />
                  View Projects
                </button>
              </div>
            </div>
          </div>
          
          <div className="page-footer-content">
            <div className="social-links">
              <a href={`mailto:${homeData.email}`} className="social-icon" title="Email" target="_blank" rel="noopener noreferrer">
                <Mail size={18} />
                <span className="icon-tooltip">Email</span>
              </a>
              <a href={homeData.github} className="social-icon" title="GitHub" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
                <span className="icon-tooltip">GitHub</span>
              </a>
              <a href={homeData.linkedin} className="social-icon" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
                <span className="icon-tooltip">LinkedIn</span>
              </a>
            </div>
            <p className="copyright">
              © 2026 <br />
              Powered by Hafiz Abrar Iqbal
            </p>
          </div>
        </div>
      </section>
      
      {/* Mobile Page Footer - Only visible on mobile */}
      <footer className="mobile-page-footer">
        <div className="social-links">
          <a href={`mailto:${homeData.email}`} className="social-icon" title="Email" target="_blank" rel="noopener noreferrer">
            <Mail size={20} />
          </a>
          <a href={homeData.github} className="social-icon" title="GitHub" target="_blank" rel="noopener noreferrer">
            <Github size={20} />
          </a>
          <a href={homeData.linkedin} className="social-icon" title="LinkedIn" target="_blank" rel="noopener noreferrer">
            <Linkedin size={20} />
          </a>
        </div>
        <p className="copyright">
          © 2026 <br />
          Powered by Hafiz Abrar Iqbal
        </p>
      </footer>
    </div>
  );
}

export default About;
