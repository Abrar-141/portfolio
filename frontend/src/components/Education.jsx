import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Moon, Sun, Github, Linkedin, Mail, GraduationCap, Award, BookOpen, Calendar, MapPin, X, Menu } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/Education.css';
import '../CSS/Responsive.css';

function Education({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [homeData, setHomeData] = useState({
    profileImage: '',
    name: 'Hafiz Abrar Iqbal',
    designation: 'Software Engineer',
    email: 'abrariqbal141@gmail.com',
    github: 'https://github.com/Abrar-afk-141',
    linkedin: 'https://www.linkedin.com/in/hâfîz-abrâr-449956281'
  });
  const [education, setEducation] = useState([]);

  useEffect(() => {
    document.title = 'Education - Hafiz Abrar Iqbal';
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => setHomeData(data))
      .catch(err => console.error('Error fetching home data:', err));
    
    fetch(`${API_URL}/api/education`)
      .then(res => res.json())
      .then(data => setEducation(data))
      .catch(err => console.error('Error fetching education:', err));
  }, []);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

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
          <a onClick={() => handleNavClick('/skills')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">Skills</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/projects')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">Projects</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/education')} className="nav-item active">
            <span className="nav-dot"></span>
            <span className="nav-text">Education</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/certificates')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">Certificates</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/contact')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">Contact</span>
            <span className="nav-line"></span>
          </a>
        </nav>

        <div className="sidebar-footer">
        </div>
      </aside>

      {/* Education Content */}
      <section className="education-section">
        <div className="education-container">
          <div className="section-header">
            <h2 className="section-title">Education</h2>
            <p className="section-subtitle">Academic Journey</p>
          </div>

          {/* Education Timeline */}
          <div className="education-timeline">
            {education.map((edu, idx) => (
              <div key={edu.id} className="timeline-card">
                <div className="edu-card-inner">
                  {edu.logo && (
                    <div className="edu-image" onClick={() => handleImageClick(edu.logo)}>
                      <img src={edu.logo} alt={edu.institution} onError={(e) => e.target.src = '/My Pic.png.webp'} />
                    </div>
                  )}
                  <div className="edu-content">
                    <div className="edu-icon">
                      <GraduationCap size={28} />
                    </div>
                    <h3>{edu.institution}</h3>
                    <div className="timeline-meta">
                      {edu.location && (
                        <span className="meta-item">
                          <MapPin size={16} />
                          {edu.location}
                        </span>
                      )}
                      <span className="meta-item">
                        <Calendar size={16} />
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                    {edu.description && (
                      <div className="timeline-description">
                        <p>{edu.description}</p>
                      </div>
                    )}
                    {edu.courses && edu.courses.length > 0 && (
                      <div className="timeline-highlights">
                        {edu.courses.map((course, i) => (
                          <span key={i} className="highlight-tag">{course}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <button className="modal-close" onClick={closeModal}>
            <X size={24} />
          </button>
          <img src={selectedImage} alt="Education Certificate" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      
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

export default Education;
