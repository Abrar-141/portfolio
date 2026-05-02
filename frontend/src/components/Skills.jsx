import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Palette, Smartphone, Moon, Sun, Github, Linkedin, Mail, Layers, Brain, Terminal, Wrench, Sparkles, TrendingUp, Menu, X } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/Skills.css';
import '../CSS/Responsive.css';

function Skills({ darkMode, setDarkMode }) {
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
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    document.title = 'Skills - Hafiz Abrar Iqbal';
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => setHomeData(data))
      .catch(err => console.error('Error fetching home data:', err));
    
    fetch(`${API_URL}/api/skills`)
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Error fetching skills:', err));
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
              {homeData.profileImage && <img src={homeData.profileImage} alt={homeData.name} />}
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
          <a onClick={() => handleNavClick('/about')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">About</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/skills')} className="nav-item active">
            <span className="nav-dot"></span>
            <span className="nav-text">Skills</span>
            <span className="nav-line"></span>
          </a>
          {['Projects', 'Education', 'Certificates', 'Contact'].map((item, idx) => (
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

      {/* Skills Content */}
      <section className="skills-section">
        <div className="skills-container">
          <div className="section-header">
            <Sparkles className="header-icon" size={32} />
            <h2 className="section-title">Skills & Expertise</h2>
            <p className="section-subtitle">Technical & Creative Mastery</p>
          </div>

          {/* Skills Grid */}
          <div className="skills-grid-modern">
            {['Frontend', 'Backend', 'Design', 'Tools', 'Core', ...new Set(skills.map(s => s.category).filter(c => !['Frontend', 'Backend', 'Design', 'Tools', 'Core'].includes(c)))].map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;
              
              const categoryName = category === 'Frontend' ? 'Frontend Development' : category === 'Backend' ? 'Backend Development' : category === 'Design' ? 'UI/UX Design' : category === 'Tools' ? 'Tools & Technologies' : category === 'Core' ? 'Core Competencies' : category;
              const IconComponent = category === 'Frontend' ? Code2 : category === 'Backend' ? Terminal : category === 'Design' ? Palette : category === 'Tools' ? Wrench : category === 'Core' ? Brain : Layers;
              
              return (
                <div key={category} className="skill-category-modern">
                  <div className="category-header-modern">
                    <div className="category-icon-modern">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="category-title-modern">{categoryName}</h3>
                  </div>
                  <div className="skills-list-modern">
                    {categorySkills.map(skill => (
                      <div key={skill._id} className="skill-item-modern">
                        <div className="skill-header-modern">
                          <h4 className="skill-name-modern">{skill.name}</h4>
                          <span className="skill-percentage-modern">{skill.level}%</span>
                        </div>
                        {skill.expertise && (
                          <p className="skill-description-modern">{skill.expertise}</p>
                        )}
                        <div className="progress-bar-modern">
                          <div className="progress-fill-modern" style={{width: `${skill.level}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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

export default Skills;
