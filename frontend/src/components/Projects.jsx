import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Moon, Sun, Github, Linkedin, Mail, ExternalLink, FileText, Eye, ChevronLeft, ChevronRight, X, Menu } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/Projects.css';
import '../CSS/Responsive.css';

function Projects({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [autoSlide, setAutoSlide] = useState({});
  const [homeData, setHomeData] = useState({
    profileImage: '',
    name: 'Hafiz Abrar Iqbal',
    designation: 'Software Engineer',
    email: 'abrariqbal141@gmail.com',
    github: 'https://github.com/Abrar-afk-141',
    linkedin: 'https://www.linkedin.com/in/hâfîz-abrâr-449956281'
  });

  useEffect(() => {
    document.title = 'Projects - Hafiz Abrar Iqbal';
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));
    
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => setHomeData(data))
      .catch(err => console.error('Error fetching home data:', err));
  }, []);

  useEffect(() => {
    const intervals = {};
    projects.forEach(project => {
      if (project.images && project.images.length > 1) {
        intervals[project._id] = setInterval(() => {
          setCurrentImageIndex(prev => {
            const current = prev[project._id] || 0;
            const next = current === project.images.length - 1 ? 0 : current + 1;
            return {...prev, [project._id]: next};
          });
        }, 3000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [projects]);

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
          <a onClick={() => handleNavClick('/projects')} className="nav-item active">
            <span className="nav-dot"></span>
            <span className="nav-text">Projects</span>
            <span className="nav-line"></span>
          </a>
          <a onClick={() => handleNavClick('/education')} className="nav-item">
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

      {/* Projects Content */}
      <section className="projects-section">
        <div className="projects-container">
          <div className="section-header">
            <h2 className="section-title">My Projects</h2>
            <p className="section-subtitle">Showcasing my development journey</p>
          </div>

          <div className="projects-grid-modern">
            {projects.map((project, idx) => (
              <div key={project._id} className="project-card-modern">
                <div className="project-number">{String(idx + 1).padStart(2, '0')}</div>
                
                <div className="project-header-modern">
                  <h3 className="project-title-modern">{project.title}</h3>
                  <p className="project-description-modern">{project.description}</p>
                </div>

                {project.tech && project.tech.length > 0 && (
                  <div className="project-tech-modern">
                    {project.tech.map((tech, techIdx) => (
                      <span key={techIdx} className="tech-badge-modern">{tech}</span>
                    ))}
                  </div>
                )}

                {project.video && (
                  <div className="project-video-modern">
                    <video src={project.video} controls className="project-video-player" />
                  </div>
                )}

                {project.images && project.images.length > 0 && (
                  <div className="project-screenshots-modern">
                    <h4 className="screenshots-title">Screenshots</h4>
                    <div className="carousel-container">
                      <button 
                        className="carousel-arrow left-arrow"
                        onClick={() => {
                          const current = currentImageIndex[project._id] || 0;
                          const newIndex = current === 0 ? project.images.length - 1 : current - 1;
                          setCurrentImageIndex({...currentImageIndex, [project._id]: newIndex});
                        }}
                      >
                        <ChevronLeft size={32} />
                      </button>
                      
                      <div className="carousel-image-wrapper" onClick={() => {
                        setLightboxImage(project.images[currentImageIndex[project._id] || 0]);
                        setLightboxOpen(true);
                      }}>
                        <img 
                          src={project.images[currentImageIndex[project._id] || 0]} 
                          alt={`${project.title} screenshot ${(currentImageIndex[project._id] || 0) + 1}`}
                          className="carousel-main-image"
                        />
                        <div className="carousel-counter">
                          {(currentImageIndex[project._id] || 0) + 1} / {project.images.length}
                        </div>
                        <div className="expand-overlay">
                          <div className="expand-icon">
                            <Eye size={40} />
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="carousel-arrow right-arrow"
                        onClick={() => {
                          const current = currentImageIndex[project._id] || 0;
                          const newIndex = current === project.images.length - 1 ? 0 : current + 1;
                          setCurrentImageIndex({...currentImageIndex, [project._id]: newIndex});
                        }}
                      >
                        <ChevronRight size={32} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="project-links-modern">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-btn-modern link-btn">
                      <ExternalLink size={18} />
                      <span>View Project</span>
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-btn-modern github-btn">
                      <Github size={18} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-btn-modern live-btn">
                      <ExternalLink size={18} />
                      <span>Live Demo</span>
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={32} />
          </button>
          
          <button 
            className="lightbox-arrow lightbox-left"
            onClick={(e) => {
              e.stopPropagation();
              const currentProject = projects.find(p => p.images.includes(lightboxImage));
              if (currentProject) {
                const currentIdx = currentProject.images.indexOf(lightboxImage);
                const newIdx = currentIdx === 0 ? currentProject.images.length - 1 : currentIdx - 1;
                setLightboxImage(currentProject.images[newIdx]);
                setCurrentImageIndex({...currentImageIndex, [currentProject._id]: newIdx});
              }
            }}
          >
            <ChevronLeft size={40} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt="Full size" className="lightbox-image" />
          </div>
          
          <button 
            className="lightbox-arrow lightbox-right"
            onClick={(e) => {
              e.stopPropagation();
              const currentProject = projects.find(p => p.images.includes(lightboxImage));
              if (currentProject) {
                const currentIdx = currentProject.images.indexOf(lightboxImage);
                const newIdx = currentIdx === currentProject.images.length - 1 ? 0 : currentIdx + 1;
                setLightboxImage(currentProject.images[newIdx]);
                setCurrentImageIndex({...currentImageIndex, [currentProject._id]: newIdx});
              }
            }}
          >
            <ChevronRight size={40} />
          </button>
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

export default Projects;
