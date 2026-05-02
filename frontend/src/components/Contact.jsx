import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Moon, Sun, Github, Linkedin, Mail, Send, MapPin, Phone, MessageCircle, Briefcase, Award, CheckCircle, Menu, X } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import API_URL from '../config/api';
import '../CSS/Contact.css';
import '../CSS/Responsive.css';

function Contact({ darkMode, setDarkMode }) {
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
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Contact - Hafiz Abrar Iqbal';
    fetch(`${API_URL}/api/home`)
      .then(res => res.json())
      .then(data => {
        setHomeData({
          profileImage: data.profileImage || '',
          name: data.name || 'Hafiz Abrar Iqbal',
          designation: data.designation || 'Software Engineer',
          email: data.email || 'abrariqbal141@gmail.com',
          github: data.github || 'https://github.com/Abrar-afk-141',
          linkedin: data.linkedin || 'https://www.linkedin.com/in/hâfîz-abrâr-449956281'
        });
      })
      .catch(err => console.error('Error fetching home data:', err));
  }, []);

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setStatus('');
    
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
          {['Skills', 'Projects', 'Education', 'Certificates'].map((item, idx) => (
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
          <a onClick={() => handleNavClick('/contact')} className="nav-item active">
            <span className="nav-dot"></span>
            <span className="nav-text">Contact</span>
            <span className="nav-line"></span>
          </a>
        </nav>

        
      </aside>

      {/* Contact Content */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="section-header">
            <h2 className="section-title">Let's Work Together</h2>
            <p className="section-subtitle">Open for opportunities and collaborations</p>
          </div>

          <div className="contact-layout">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="form-header">
                <MessageCircle size={32} />
                <h3>Send Me a Message</h3>
                <p>Fill out the form below and I'll get back to you within 24 hours</p>
              </div>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => {
                        setForm({...form, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: ''});
                      }}
                      className={errors.name ? 'error' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  <div className="form-field">
                    <label>Your Email *</label>
                    <input
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({...form, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                      className={errors.email ? 'error' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <label>Subject *</label>
                  <input
                    type="text"
                    placeholder="Job Opportunity / Project Inquiry / Collaboration"
                    value={form.subject}
                    onChange={(e) => {
                      setForm({...form, subject: e.target.value});
                      if (errors.subject) setErrors({...errors, subject: ''});
                    }}
                    className={errors.subject ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>
                <div className="form-field">
                  <label>Your Message *</label>
                  <textarea
                    placeholder="Tell me about the opportunity, project details, or how we can work together..."
                    rows="6"
                    value={form.message}
                    onChange={(e) => {
                      setForm({...form, message: e.target.value});
                      if (errors.message) setErrors({...errors, message: ''});
                    }}
                    className={errors.message ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
                {status === 'success' && (
                  <div className="status-message success">
                    <CheckCircle size={20} />
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="status-message error">
                    <span>Failed to send message. Please try again or email me directly.</span>
                  </div>
                )}
              </form>
            </div>
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

export default Contact;
