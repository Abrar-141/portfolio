import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Certificates from './components/Certificates';
import Contact from './components/Contact';

import './CSS/App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={darkMode ? 'dark' : 'light'}>
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/skills" element={<Skills darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/projects" element={<Projects darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/education" element={<Education darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/certificates" element={<Certificates darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} setDarkMode={setDarkMode} />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
