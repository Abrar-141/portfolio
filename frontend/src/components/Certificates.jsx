import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Moon, Sun, Github, Linkedin, Mail, Award, ExternalLink, X, Menu } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/Certificates.css';
import '../CSS/Responsive.css';

function Certificates({ darkMode, setDarkMode }) {
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
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    document.title = 'Certificates - Hafiz Abrar Iqbal';
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => setHomeData(data))
      .catch(err => console.error('Error fetching home data:', err));
    
    fetch(`${API_URL}/api/certificates`)
      .then(res => res.json())
      .then(data => setCertificates(data))
      .catch(err => console.error('Error fetching certificates:', err));
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
          <a onClick={() => handleNavClick('/education')} className="nav-item">
            <span className="nav-dot"></span>
            <span className="nav-text">Education</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/certificates')} className="nav-item active">
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

      {/* Certificates Content */}
      <section className="certificates-section">
        <div className="certificates-container">
          <div className="section-header">
            <h2 className="section-title">Professional Certificates</h2>
            <p className="section-subtitle">Verified achievements and certifications</p>
          </div>

          <div className="certificates-grid">
            {certificates.map((cert, idx) => (
              <div key={cert._id} className="certificate-card">
                {cert.image && (
                  <div className="cert-image" onClick={() => handleImageClick(cert.image)}>
                    <img src={cert.image} alt={cert.title} />
                    <div className="cert-overlay">
                      <Award size={32} />
                    </div>
                  </div>
                )}
                <div className="cert-content">
                  <h4>{cert.title}</h4>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <p className="cert-date">{cert.date}</p>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                      <ExternalLink size={16} />
                      <span>View Certificate</span>
                    </a>
                  )}
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
          <img src={selectedImage} alt="Certificate" onClick={(e) => e.stopPropagation()} />
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

export default Certificates;
