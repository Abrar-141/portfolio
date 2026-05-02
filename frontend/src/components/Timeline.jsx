import React from 'react';
import '../CSS/Timeline.css';

function Timeline() {
  return (
    <section id="timeline" className="timeline-section">
      <h2>Professional Timeline</h2>
      <div className="timeline">
        <div className="timeline-item">
          <h3>SZABIST - BSSE Final Semester</h3>
          <p className="date">2020 - Present</p>
          <p>Bachelor of Science in Software Engineering. Specialized in MERN Stack development and cloud technologies.</p>
        </div>
        <div className="timeline-item">
          <h3>SMIT - Graphic Design Certification</h3>
          <p className="date">2019</p>
          <p>Completed professional certification in Graphic Design, mastering Adobe Photoshop and Illustrator.</p>
        </div>
        <div className="timeline-item">
          <h3>AjwaHub - Full Stack Developer</h3>
          <p className="date">2023</p>
          <p>Built complete e-commerce platform with payment integration using MERN stack.</p>
        </div>
        <div className="timeline-item">
          <h3>SRE Modernization Project</h3>
          <p className="date">2023</p>
          <p>Worked on modernizing legacy systems and implementing DevOps practices.</p>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
