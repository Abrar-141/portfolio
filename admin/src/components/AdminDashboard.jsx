import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Plus, Trash2, Edit, Home, Upload, Image, Briefcase, Code, GraduationCap, User, Mail, Save, CheckCircle, Crop, X, UserPlus, Copy, Link as LinkIcon } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../CSS/AdminDashboard.css';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [homeData, setHomeData] = useState({ 
    profileImage: '', heroImage: '', cvFile: '',
    heroTitle: '', heroSubtitle: '', heroDescription: '',
    email: '', github: '', linkedin: '', projectsCount: '',
    name: '', designation: ''
  });
  const [aboutData, setAboutData] = useState({
    profileImage: '',
    name: '', title: '', bio: '', quote: '',
    focus: [
      { title: '', value: '' },
      { title: '', value: '' },
      { title: '', value: '' }
    ],
    stats: [
      { number: '', label: '' },
      { number: '', label: '' },
      { number: '', label: '' }
    ]
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [saveStatus, setSaveStatus] = useState('');

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', tech: '', github: '', live: '', link: '', images: [], video: ''
  });

  const [skillForm, setSkillForm] = useState({
    category: '', name: '', level: 50, customCategory: '', expertise: ''
  });
  const [editingSkill, setEditingSkill] = useState(null);
  
  const [eduForm, setEduForm] = useState({
    institution: '', logo: '', startDate: '', endDate: '', location: '', description: '', courses: ''
  });
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', date: '', image: '', link: ''
  });
  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const [invites, setInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedInvite, setGeneratedInvite] = useState(null);
  
  // Image cropping states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropField, setCropField] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    document.title = 'Admin Dashboard - Portfolio';
    fetchProjects();
    fetchSkills();
    fetchHomeData();
    fetchAboutData();
    fetchEducation();
    fetchCertificates();
    fetchContactMessages();
    fetchInvites();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('http://localhost:5001/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const fetchSkills = async () => {
    const res = await fetch('http://localhost:5001/api/skills');
    const data = await res.json();
    setSkills(data);
  };

  const fetchHomeData = async () => {
    const res = await fetch('http://localhost:5001/api/home');
    const data = await res.json();
    setHomeData(data);
  };

  const fetchAboutData = async () => {
    const res = await fetch('http://localhost:5001/api/about');
    const data = await res.json();
    setAboutData(data);
  };

  const fetchEducation = async () => {
    const res = await fetch('http://localhost:5001/api/education');
    const data = await res.json();
    setEducation(data);
  };

  const fetchCertificates = async () => {
    const res = await fetch('http://localhost:5001/api/certificates');
    const data = await res.json();
    setCertificates(data);
  };

  const fetchContactMessages = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5001/api/contact/messages', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    setContactMessages(data);
  };

  const updateMessageStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5001/api/contact/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchContactMessages();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5001/api/contact/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setSelectedMessage(null);
    fetchContactMessages();
  };

  const fetchInvites = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5001/api/admin/invites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    setInvites(data);
  };

  const generateInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setSaveStatus('saving');
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5001/api/admin/generate-invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email: inviteEmail })
    });
    
    const data = await res.json();
    if (data.success) {
      setGeneratedInvite(data);
      setInviteEmail('');
      fetchInvites();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const copyInviteLink = (link) => {
    navigator.clipboard.writeText(link);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const deleteInvite = async (id) => {
    if (!window.confirm('Delete this invite?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5001/api/admin/invites/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchInvites();
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json'
    };
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const techArray = projectForm.tech.split(',').map(t => t.trim());
    const payload = { ...projectForm, tech: techArray };
    
    const url = editingProject 
      ? `http://localhost:5001/api/projects/${editingProject._id}`
      : 'http://localhost:5001/api/projects';
    
    await fetch(url, {
      method: editingProject ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    
    setProjectForm({ title: '', description: '', tech: '', github: '', live: '', link: '', images: [], video: '' });
    setShowProjectForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = skillForm.category === 'Other' ? skillForm.customCategory : skillForm.category;
    
    const url = editingSkill 
      ? `http://localhost:5001/api/skills/${editingSkill._id}`
      : 'http://localhost:5001/api/skills';
    
    await fetch(url, {
      method: editingSkill ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ category: finalCategory, name: skillForm.name, level: skillForm.level, expertise: skillForm.expertise })
    });
    
    setSkillForm({ category: '', name: '', level: 50, customCategory: '', expertise: '' });
    setShowSkillForm(false);
    setEditingSkill(null);
    fetchSkills();
  };

  const deleteProject = async (id) => {
    await fetch(`http://localhost:5001/api/projects/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    fetchProjects();
  };

  const deleteSkill = async (id) => {
    await fetch(`http://localhost:5001/api/skills/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    fetchSkills();
  };

  const editSkill = (skill) => {
    setEditingSkill(skill);
    const isCustomCategory = !['Frontend', 'Backend', 'Design', 'Tools', 'Core'].includes(skill.category);
    setSkillForm({
      category: isCustomCategory ? 'Other' : skill.category,
      name: skill.name,
      level: skill.level || 50,
      customCategory: isCustomCategory ? skill.category : '',
      expertise: skill.expertise || ''
    });
    setShowSkillForm(true);
  };

  const editProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      ...project,
      tech: project.tech.join(', ')
    });
    setShowProjectForm(true);
  };

  const handleHomeUpdate = (field, value) => {
    setHomeData({ ...homeData, [field]: value });
  };

  const saveHomeData = async () => {
    setSaveStatus('saving');
    const updatedAbout = { ...aboutData, profileImage: homeData.profileImage };
    setAboutData(updatedAbout);
    
    await fetch('http://localhost:5001/api/home', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(homeData)
    });
    
    await fetch('http://localhost:5001/api/about', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedAbout)
    });
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const saveAboutData = async () => {
    setSaveStatus('saving');
    await fetch('http://localhost:5001/api/about', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(aboutData)
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    const coursesArray = eduForm.courses.split(',').map(c => c.trim());
    const payload = { ...eduForm, courses: coursesArray };
    
    const url = editingEdu ? `http://localhost:5001/api/education/${editingEdu._id}` : 'http://localhost:5001/api/education';
    await fetch(url, {
      method: editingEdu ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    
    setEduForm({ institution: '', logo: '', startDate: '', endDate: '', location: '', description: '', courses: '' });
    setShowEduForm(false);
    setEditingEdu(null);
    fetchEducation();
  };

  const deleteEducation = async (id) => {
    await fetch(`http://localhost:5001/api/education/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    fetchEducation();
  };

  const editEducation = (edu) => {
    setEditingEdu(edu);
    setEduForm({ ...edu, courses: edu.courses?.join(', ') || '' });
    setShowEduForm(true);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    const url = editingCert ? `http://localhost:5001/api/certificates/${editingCert._id}` : 'http://localhost:5001/api/certificates';
    await fetch(url, {
      method: editingCert ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(certForm)
    });
    
    setCertForm({ title: '', issuer: '', date: '', image: '', link: '' });
    setShowCertForm(false);
    setEditingCert(null);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
    fetchCertificates();
  };

  const deleteCertificate = async (id) => {
    await fetch(`http://localhost:5001/api/certificates/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    fetchCertificates();
  };

  const editCertificate = (cert) => {
    setEditingCert(cert);
    setCertForm(cert);
    setShowCertForm(true);
  };

  const handleCertImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSaveStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setCertForm({ ...certForm, image: data.filePath });
        setSaveStatus('uploaded');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveStatus('');
    }
    e.target.value = '';
  };

  const handleEduImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSaveStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setEduForm({ ...eduForm, logo: data.filePath });
        setSaveStatus('uploaded');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveStatus('');
    }
    e.target.value = '';
  };

  const handleProjectImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setSaveStatus('uploading');
    const uploadedImages = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          uploadedImages.push(data.filePath);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setProjectForm({ ...projectForm, images: [...projectForm.images, ...uploadedImages] });
    setSaveStatus('uploaded');
    setTimeout(() => setSaveStatus(''), 2000);
    e.target.value = '';
  };
  
  const handleProjectVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSaveStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setProjectForm({ ...projectForm, video: data.filePath });
        setSaveStatus('uploaded');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveStatus('');
    }
    e.target.value = '';
  };
  
  const removeProjectImage = (index) => {
    const newImages = projectForm.images.filter((_, i) => i !== index);
    setProjectForm({ ...projectForm, images: newImages });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For PDF files, upload directly
    if (field === 'cvFile') {
      setSaveStatus('uploading');
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (data.success) {
          const updated = { ...homeData, cvFile: data.filePath };
          setHomeData(updated);
          
          await fetch('http://localhost:5001/api/home', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updated)
          });
          
          await fetchHomeData();
          setSaveStatus('uploaded');
          setTimeout(() => setSaveStatus(''), 2000);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setSaveStatus('');
      }
      return;
    }
    
    // For images, open crop modal
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
      setCropField(field);
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };
  
  const handleEditImage = (field) => {
    // Load current image for editing
    const currentImage = homeData[field];
    if (!currentImage) return;
    
    // Add cache buster to force reload
    const imageUrl = currentImage.startsWith('http') ? currentImage : `http://localhost:3000${currentImage}?t=${Date.now()}`;
    setImageSrc(imageUrl);
    setCropField(field);
    setCrop({ unit: '%', width: 50, aspect: field === 'profileImage' ? 1 : undefined });
    setCompletedCrop(null);
    setCropModalOpen(true);
  };
  
  const handleAboutImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
      setCropField('aboutProfileImage');
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  
  const handleEditAboutImage = () => {
    const currentImage = aboutData.profileImage;
    if (!currentImage) return;
    
    const imageUrl = currentImage.startsWith('http') ? currentImage : `http://localhost:3000${currentImage}?t=${Date.now()}`;
    setImageSrc(imageUrl);
    setCropField('aboutProfileImage');
    setCrop({ unit: '%', width: 50, aspect: undefined });
    setCompletedCrop(null);
    setCropModalOpen(true);
  };
  
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Use higher resolution for better quality
    const pixelRatio = window.devicePixelRatio || 2;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(pixelRatio, pixelRatio);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    });
  };
  
  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;
    
    setSaveStatus('uploading');
    setCropModalOpen(false);
    
    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const formData = new FormData();
      formData.append('file', croppedBlob, 'cropped-image.png');
      
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        if (cropField === 'aboutProfileImage') {
          // Update About page profile image
          const updatedAbout = { ...aboutData, profileImage: data.filePath };
          setAboutData(updatedAbout);
          
          await fetch('http://localhost:5001/api/about', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedAbout)
          });
          
          await fetchAboutData();
        } else {
          // Update Home page images
          const updated = { ...homeData, [cropField]: data.filePath };
          setHomeData(updated);
          
          if (cropField === 'profileImage') {
            const updatedAbout = { ...aboutData, profileImage: data.filePath };
            setAboutData(updatedAbout);
            await fetch('http://localhost:5001/api/about', {
              method: 'PUT',
              headers: getAuthHeaders(),
              body: JSON.stringify(updatedAbout)
            });
          }
          
          await fetch('http://localhost:5001/api/home', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updated)
          });
          
          await fetchHomeData();
          await fetchAboutData();
        }
        
        setSaveStatus('uploaded');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveStatus('');
    }
    
    setImageSrc(null);
    setCropField('');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </header>

      <nav className="admin-nav">
        <button className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
          <User size={20} />
          <span>About</span>
        </button>
        <button className={`nav-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
          <Code size={20} />
          <span>Skills</span>
        </button>
        <button className={`nav-tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <Briefcase size={20} />
          <span>Projects</span>
        </button>
        <button className={`nav-tab ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
          <GraduationCap size={20} />
          <span>Education</span>
        </button>
        <button className={`nav-tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
          <Mail size={20} />
          <span>Contact</span>
        </button>
        <button className={`nav-tab ${activeTab === 'invites' ? 'active' : ''}`} onClick={() => setActiveTab('invites')}>
          <UserPlus size={20} />
          <span>Invites</span>
        </button>
      </nav>

      <div className="admin-content">
        {activeTab === 'home' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Home Page Settings</h2>
            <button onClick={saveHomeData} className="save-btn" disabled={saveStatus === 'saving'}>
              {saveStatus === 'saved' ? <CheckCircle size={20} /> : <Save size={20} />}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
          {saveStatus === 'uploaded' && <div className="status-message success">✓ File uploaded successfully!</div>}
          <div className="home-settings">
            <div className="setting-card">
              <div className="setting-header">
                <Image size={20} />
                <h3>Profile Image (Sidebar)</h3>
              </div>
              <div className="image-preview">
                {homeData.profileImage && <img src={`${homeData.profileImage}?t=${Date.now()}`} alt="Profile" key={homeData.profileImage} />}
              </div>
              <div className="image-actions">
                <label className="upload-btn">
                  <Upload size={16} />
                  <span>Upload New</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} style={{display: 'none'}} />
                </label>
                {homeData.profileImage && (
                  <button onClick={() => handleEditImage('profileImage')} className="edit-image-btn">
                    <Edit size={16} />
                    <span>Edit/Crop</span>
                  </button>
                )}
              </div>
              <p className="hint">Upload image file (JPG, PNG, WEBP)</p>
            </div>
            <div className="setting-card">
              <div className="setting-header">
                <Image size={20} />
                <h3>Hero Image (Main Page)</h3>
              </div>
              <div className="image-preview">
                {homeData.heroImage && <img src={`${homeData.heroImage}?t=${Date.now()}`} alt="Hero" key={homeData.heroImage} />}
              </div>
              <div className="image-actions">
                <label className="upload-btn">
                  <Upload size={16} />
                  <span>Upload New</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'heroImage')} style={{display: 'none'}} />
                </label>
                {homeData.heroImage && (
                  <button onClick={() => handleEditImage('heroImage')} className="edit-image-btn">
                    <Edit size={16} />
                    <span>Edit/Crop</span>
                  </button>
                )}
              </div>
              <p className="hint">Upload image file (JPG, PNG, WEBP)</p>
            </div>
            <div className="setting-card">
              <div className="setting-header">
                <Upload size={20} />
                <h3>CV/Resume File</h3>
              </div>
              <div className="cv-preview">
                {homeData.cvFile && <a href={homeData.cvFile} target="_blank" rel="noopener noreferrer" className="cv-link">📄 Current CV: {homeData.cvFile}</a>}
              </div>
              <label className="upload-btn full-width">
                <Upload size={16} />
                <span>Upload New CV</span>
                <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'cvFile')} style={{display: 'none'}} />
              </label>
              <p className="hint">Upload PDF file</p>
            </div>
          </div>
          
          <div className="text-settings">
            <h3>Profile Info</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={homeData.name} onChange={(e) => handleHomeUpdate('name', e.target.value)} placeholder="e.g., Hafiz Abrar Iqbal" className="text-input" />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input type="text" value={homeData.designation} onChange={(e) => handleHomeUpdate('designation', e.target.value)} placeholder="e.g., Software Engineer" className="text-input" />
            </div>
          </div>
          
          <div className="text-settings">
            <h3>Hero Section Text</h3>
            <div className="form-group">
              <label>Hero Title</label>
              <input type="text" value={homeData.heroTitle} onChange={(e) => handleHomeUpdate('heroTitle', e.target.value)} placeholder="e.g., Crafting Digital" className="text-input" />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <input type="text" value={homeData.heroSubtitle} onChange={(e) => handleHomeUpdate('heroSubtitle', e.target.value)} placeholder="e.g., Experiences" className="text-input" />
            </div>
            <div className="form-group">
              <label>Hero Description</label>
              <textarea value={homeData.heroDescription} onChange={(e) => handleHomeUpdate('heroDescription', e.target.value)} placeholder="Enter description..." className="text-input" rows="4" />
            </div>
          </div>
          
          <div className="text-settings">
            <h3>Social Links & Stats</h3>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={homeData.email} onChange={(e) => handleHomeUpdate('email', e.target.value)} placeholder="your.email@example.com" className="text-input" />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input type="text" value={homeData.github} onChange={(e) => handleHomeUpdate('github', e.target.value)} placeholder="https://github.com/username" className="text-input" />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input type="text" value={homeData.linkedin} onChange={(e) => handleHomeUpdate('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" className="text-input" />
            </div>
            <div className="form-group">
              <label>Projects Count</label>
              <input type="text" value={homeData.projectsCount} onChange={(e) => handleHomeUpdate('projectsCount', e.target.value)} placeholder="e.g., 5+" className="text-input" />
            </div>
          </div>
        </section>
        )}

        {activeTab === 'about' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>About Page</h2>
            <button onClick={saveAboutData} className="save-btn" disabled={saveStatus === 'saving'}>
              {saveStatus === 'saved' ? <CheckCircle size={20} /> : <Save size={20} />}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
          
          <div className="home-settings">
            <div className="setting-card">
              <div className="setting-header">
                <Image size={20} />
                <h3>About Page Profile Image</h3>
              </div>
              <div className="image-preview">
                {aboutData.profileImage && <img src={`${aboutData.profileImage}?t=${Date.now()}`} alt="About Profile" key={aboutData.profileImage} />}
              </div>
              <div className="image-actions">
                <label className="upload-btn">
                  <Upload size={16} />
                  <span>Upload New</span>
                  <input type="file" accept="image/*" onChange={(e) => handleAboutImageUpload(e)} style={{display: 'none'}} />
                </label>
                {aboutData.profileImage && (
                  <button onClick={() => handleEditAboutImage()} className="edit-image-btn">
                    <Edit size={16} />
                    <span>Edit/Crop</span>
                  </button>
                )}
              </div>
              <p className="hint">This image shows on About page (uses Hero Image from Home)</p>
            </div>
          </div>
          
          <div className="text-settings">
            <div className="form-group">
              <div className="field-header">
                <h3>Name</h3>
              </div>
              <textarea value={aboutData.name} onChange={(e) => setAboutData({...aboutData, name: e.target.value})} placeholder="Hafiz Abrar Iqbal" className="text-input modern-textarea" rows="2" />
            </div>
            <div className="form-group">
              <div className="field-header">
                <h3>Title</h3>
              </div>
              <textarea value={aboutData.title} onChange={(e) => setAboutData({...aboutData, title: e.target.value})} placeholder="Software Engineer | UI/UX Designer" className="text-input modern-textarea" rows="2" />
            </div>
            <div className="form-group">
              <div className="field-header">
                <h3>Bio</h3>
              </div>
              <textarea value={aboutData.bio} onChange={(e) => setAboutData({...aboutData, bio: e.target.value})} placeholder="Write your bio here..." className="text-input modern-textarea" rows="5" />
            </div>
            <div className="form-group">
              <div className="field-header">
                <h3>Bio Heading</h3>
              </div>
              <textarea value={aboutData.bioHeading || ''} onChange={(e) => setAboutData({...aboutData, bioHeading: e.target.value})} placeholder="Enter bio heading..." className="text-input modern-textarea" rows="2" />
            </div>
          </div>
        </section>
        )}

        {activeTab === 'skills' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Skills Management</h2>
            <button onClick={() => setShowSkillForm(!showSkillForm)} className="add-btn">
              <Plus size={20} /> Add Skill
            </button>
          </div>
          {showSkillForm && (
            <form onSubmit={handleSkillSubmit} className="admin-form skill-form">
              <div className="form-group">
                <label>Category</label>
                <select value={skillForm.category} onChange={(e) => setSkillForm({...skillForm, category: e.target.value, customCategory: ''})} required className="text-input">
                  <option value="">Select Category</option>
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend Development</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Tools">Tools & Technologies</option>
                  <option value="Core">Core Competencies</option>
                  <option value="Other">Other (Custom)</option>
                </select>
              </div>
              {skillForm.category === 'Other' && (
                <div className="form-group">
                  <label>Custom Category Name</label>
                  <input placeholder="Type your category name..." value={skillForm.customCategory} onChange={(e) => setSkillForm({...skillForm, customCategory: e.target.value})} required className="text-input" />
                </div>
              )}
              <div className="form-group">
                <label>Skill Name</label>
                <input placeholder="e.g., React" value={skillForm.name} onChange={(e) => setSkillForm({...skillForm, name: e.target.value})} required className="text-input" />
              </div>
              <div className="form-group">
                <label>Proficiency Level: {skillForm.level}%</label>
                <input type="range" min="0" max="100" value={skillForm.level} onChange={(e) => setSkillForm({...skillForm, level: e.target.value})} className="range-slider" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="What you know about this skill..." value={skillForm.expertise} onChange={(e) => setSkillForm({...skillForm, expertise: e.target.value})} className="text-input" rows="4" />
              </div>
              <button type="submit" className="submit-btn"><Plus size={18} /> {editingSkill ? 'Update' : 'Add'} Skill</button>
            </form>
          )}
          
          <div className="items-grid">
            {skills.map(skill => (
              <div key={skill._id} className="item-card">
                <h3>{skill.name}</h3>
                <p>{skill.category}</p>
                {skill.level && <p className="skill-level">Level: {skill.level}%</p>}
                <div className="item-actions">
                  <button onClick={() => editSkill(skill)} className="edit-btn"><Edit size={16} /></button>
                  <button onClick={() => deleteSkill(skill._id)} className="delete-btn"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {activeTab === 'projects' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Projects</h2>
            <button onClick={() => setShowProjectForm(!showProjectForm)} className="add-btn">
              <Plus size={20} /> Add Project
            </button>
          </div>
          {showProjectForm && (
            <form onSubmit={handleProjectSubmit} className="admin-form project-form-modern">
              <div className="form-group">
                <label>Project Title</label>
                <input placeholder="e.g., E-Commerce Website" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} required className="text-input" />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your project..." value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} required className="text-input" rows="4" />
              </div>
              
              <div className="form-group">
                <label>Technologies (comma separated)</label>
                <input placeholder="e.g., React, Node.js, MongoDB" value={projectForm.tech} onChange={(e) => setProjectForm({...projectForm, tech: e.target.value})} required className="text-input" />
              </div>
              
              <div className="form-group">
                <label>Project Link (Any URL)</label>
                <input type="url" placeholder="https://your-project-link.com" value={projectForm.link} onChange={(e) => setProjectForm({...projectForm, link: e.target.value})} className="text-input" />
              </div>
              
              <div className="form-group">
                <label>GitHub Link</label>
                <input type="url" placeholder="https://github.com/username/repo" value={projectForm.github} onChange={(e) => setProjectForm({...projectForm, github: e.target.value})} className="text-input" />
              </div>
              
              <div className="form-group">
                <label>Live Demo Link</label>
                <input type="url" placeholder="https://live-demo.com" value={projectForm.live} onChange={(e) => setProjectForm({...projectForm, live: e.target.value})} className="text-input" />
              </div>
              
              <div className="form-group">
                <label>Project Screenshots</label>
                <label className="upload-btn-media full-width">
                  <Image size={16} />
                  <span>Upload Screenshots (Multiple)</span>
                  <input type="file" accept="image/*" multiple onChange={handleProjectImageUpload} style={{display: 'none'}} />
                </label>
                {projectForm.images.length > 0 && (
                  <div className="uploaded-images-grid">
                    {projectForm.images.map((img, idx) => (
                      <div key={idx} className="uploaded-image-item">
                        <img src={img} alt={`Screenshot ${idx + 1}`} />
                        <button type="button" onClick={() => removeProjectImage(idx)} className="remove-image-btn">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Project Video</label>
                <label className="upload-btn-video full-width">
                  <Upload size={16} />
                  <span>Upload Video</span>
                  <input type="file" accept="video/*" onChange={handleProjectVideoUpload} style={{display: 'none'}} />
                </label>
                {projectForm.video && (
                  <div className="uploaded-video-preview">
                    <video src={projectForm.video} controls style={{width: '100%', maxHeight: '300px', borderRadius: '12px', marginTop: '10px'}} />
                    <button type="button" onClick={() => setProjectForm({...projectForm, video: ''})} className="remove-video-btn">
                      <X size={16} /> Remove Video
                    </button>
                  </div>
                )}
              </div>
              
              <button type="submit" className="submit-btn">{editingProject ? 'Update' : 'Add'} Project</button>
            </form>
          )}
          <div className="items-grid">
            {projects.map(project => (
              <div key={project._id} className="item-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="item-actions">
                  <button onClick={() => editProject(project)} className="edit-btn"><Edit size={16} /></button>
                  <button onClick={() => deleteProject(project._id)} className="delete-btn"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {activeTab === 'education' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Education & Certificates</h2>
          </div>
          
          {/* Education Section */}
          <div className="subsection">
            <div className="section-header">
              <h3>Education</h3>
              <button onClick={() => setShowEduForm(!showEduForm)} className="add-btn">
                <Plus size={20} /> Add Education
              </button>
            </div>
            {showEduForm && (
              <form onSubmit={handleEduSubmit} className="admin-form">
                <div className="form-group">
                  <label>Institution Name</label>
                  <input placeholder="e.g., University of Punjab" value={eduForm.institution} onChange={(e) => setEduForm({...eduForm, institution: e.target.value})} required className="text-input" />
                </div>
                <div className="form-group">
                  <label>Institution Logo</label>
                  <label className="upload-btn-media full-width">
                    <Image size={16} />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleEduImageUpload} style={{display: 'none'}} />
                  </label>
                  {eduForm.logo && (
                    <div className="uploaded-image-preview">
                      <img src={eduForm.logo} alt="Logo" style={{width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', marginTop: '10px'}} />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input placeholder="e.g., Lahore, Pakistan" value={eduForm.location} onChange={(e) => setEduForm({...eduForm, location: e.target.value})} className="text-input" />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input placeholder="e.g., 2020" value={eduForm.startDate} onChange={(e) => setEduForm({...eduForm, startDate: e.target.value})} required className="text-input" />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input placeholder="e.g., 2024 or Present" value={eduForm.endDate} onChange={(e) => setEduForm({...eduForm, endDate: e.target.value})} required className="text-input" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Describe your education..." value={eduForm.description} onChange={(e) => setEduForm({...eduForm, description: e.target.value})} className="text-input" rows="3" />
                </div>
                <div className="form-group">
                  <label>Courses (comma separated)</label>
                  <input placeholder="e.g., Data Structures, Algorithms, Web Development" value={eduForm.courses} onChange={(e) => setEduForm({...eduForm, courses: e.target.value})} className="text-input" />
                </div>
                <button type="submit" className="submit-btn"><Plus size={18} /> {editingEdu ? 'Update' : 'Add'} Education</button>
              </form>
            )}
            <div className="items-grid">
              {education.map(edu => (
                <div key={edu._id} className="item-card">
                  <h3>{edu.institution}</h3>
                  <p>{edu.startDate} - {edu.endDate}</p>
                  {edu.location && <p>{edu.location}</p>}
                  <div className="item-actions">
                    <button onClick={() => editEducation(edu)} className="edit-btn"><Edit size={16} /></button>
                    <button onClick={() => deleteEducation(edu._id)} className="delete-btn"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Certificates Section */}
          <div className="subsection" style={{marginTop: '60px'}}>
            <div className="section-header">
              <h3>Certificates</h3>
              <button onClick={() => setShowCertForm(!showCertForm)} className="add-btn">
                <Plus size={20} /> Add Certificate
              </button>
            </div>
            {showCertForm && (
              <form onSubmit={handleCertSubmit} className="admin-form">
                <div className="form-group">
                  <label>Certificate Title</label>
                  <input placeholder="e.g., AWS Certified Developer" value={certForm.title} onChange={(e) => setCertForm({...certForm, title: e.target.value})} required className="text-input" />
                </div>
                <div className="form-group">
                  <label>Issuer</label>
                  <input placeholder="e.g., Amazon Web Services" value={certForm.issuer} onChange={(e) => setCertForm({...certForm, issuer: e.target.value})} required className="text-input" />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input placeholder="e.g., January 2024" value={certForm.date} onChange={(e) => setCertForm({...certForm, date: e.target.value})} required className="text-input" />
                </div>
                <div className="form-group">
                  <label>Certificate Image</label>
                  <label className="upload-btn-media full-width">
                    <Image size={16} />
                    <span>Upload Certificate Image</span>
                    <input type="file" accept="image/*" onChange={handleCertImageUpload} style={{display: 'none'}} />
                  </label>
                  {certForm.image && (
                    <div className="uploaded-image-preview">
                      <img src={certForm.image} alt="Certificate" style={{width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', marginTop: '10px'}} />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Certificate Link (Optional)</label>
                  <input type="url" placeholder="https://verify-certificate.com" value={certForm.link} onChange={(e) => setCertForm({...certForm, link: e.target.value})} className="text-input" />
                </div>
                <button type="submit" className="submit-btn" disabled={saveStatus === 'saving'}>
                  <Plus size={18} /> {saveStatus === 'saving' ? 'Saving...' : editingCert ? 'Update' : 'Add'} Certificate
                </button>
                {saveStatus === 'saved' && <div className="status-message success" style={{marginTop: '15px'}}>✓ Certificate saved successfully!</div>}
              </form>
            )}
            <div className="items-grid">
              {certificates.map(cert => (
                <div key={cert._id} className="item-card">
                  {cert.image && <img src={cert.image} alt={cert.title} style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}} />}
                  <h3>{cert.title}</h3>
                  <p>{cert.issuer}</p>
                  <p>{cert.date}</p>
                  <div className="item-actions">
                    <button onClick={() => editCertificate(cert)} className="edit-btn"><Edit size={16} /></button>
                    <button onClick={() => deleteCertificate(cert._id)} className="delete-btn"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {activeTab === 'contact' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Contact Messages</h2>
            <span className="badge">{contactMessages.filter(m => m.status === 'unread').length} Unread</span>
          </div>
          
          {contactMessages.length === 0 ? (
            <div className="placeholder-content">
              <Mail size={64} style={{opacity: 0.3}} />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="messages-layout">
              <div className="messages-list">
                {contactMessages.map(msg => (
                  <div 
                    key={msg._id} 
                    className={`message-item ${msg.status === 'unread' ? 'unread' : ''} ${selectedMessage?._id === msg._id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') updateMessageStatus(msg._id, 'read');
                    }}
                  >
                    <div className="message-header">
                      <h4>{msg.name}</h4>
                      {msg.status === 'unread' && <span className="unread-dot"></span>}
                    </div>
                    <p className="message-subject">{msg.subject}</p>
                    <p className="message-preview">{msg.message.substring(0, 60)}...</p>
                    <span className="message-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
              
              {selectedMessage && (
                <div className="message-detail">
                  <div className="message-detail-header">
                    <div>
                      <h3>{selectedMessage.subject}</h3>
                      <p className="sender-info">
                        <strong>{selectedMessage.name}</strong> &lt;{selectedMessage.email}&gt;
                      </p>
                      <p className="message-date-full">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="message-actions">
                      <select 
                        value={selectedMessage.status} 
                        onChange={(e) => updateMessageStatus(selectedMessage._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <button onClick={() => deleteMessage(selectedMessage._id)} className="delete-btn">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="message-body">
                    <p>{selectedMessage.message}</p>
                  </div>
                  <div className="message-footer">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="reply-btn">
                      <Mail size={16} /> Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        )}

        {activeTab === 'invites' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Invite Management</h2>
          </div>
          
          <div className="invite-generator">
            <h3>Generate New Invite</h3>
            <form onSubmit={generateInvite} className="admin-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email to invite"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="text-input"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={saveStatus === 'saving'}>
                <UserPlus size={18} /> {saveStatus === 'saving' ? 'Generating...' : 'Generate Invite Link'}
              </button>
            </form>
            
            {generatedInvite && (
              <div className="generated-invite">
                <h4>✅ Invite Link Generated!</h4>
                <div className="invite-link-box">
                  <LinkIcon size={20} />
                  <input type="text" value={generatedInvite.inviteLink} readOnly className="invite-link-input" />
                  <button onClick={() => copyInviteLink(generatedInvite.inviteLink)} className="copy-btn">
                    <Copy size={18} /> Copy
                  </button>
                </div>
                <p className="invite-info">Send this link to <strong>{generatedInvite.email}</strong></p>
                <p className="invite-expiry">Expires: {new Date(generatedInvite.expiresAt).toLocaleString()}</p>
              </div>
            )}
          </div>
          
          <div className="invites-list">
            <h3>All Invites</h3>
            {invites.length === 0 ? (
              <div className="placeholder-content">
                <UserPlus size={64} style={{opacity: 0.3}} />
                <p>No invites generated yet</p>
              </div>
            ) : (
              <div className="items-grid">
                {invites.map(invite => (
                  <div key={invite._id} className={`item-card invite-card ${invite.isUsed ? 'used' : invite.expiresAt < new Date() ? 'expired' : 'active'}`}>
                    <div className="invite-status">
                      {invite.isUsed ? '✅ Used' : new Date(invite.expiresAt) < new Date() ? '⏰ Expired' : '🔗 Active'}
                    </div>
                    <h3>{invite.email}</h3>
                    <p><strong>Created:</strong> {new Date(invite.createdAt).toLocaleDateString()}</p>
                    <p><strong>Expires:</strong> {new Date(invite.expiresAt).toLocaleDateString()}</p>
                    {invite.isUsed && invite.usedBy && (
                      <p className="used-by"><strong>Used by:</strong> {invite.usedBy.fullName}</p>
                    )}
                    <div className="item-actions">
                      {!invite.isUsed && new Date(invite.expiresAt) > new Date() && (
                        <button onClick={() => copyInviteLink(`http://localhost:3001/signup?token=${invite.token}&email=${encodeURIComponent(invite.email)}`)} className="edit-btn">
                          <Copy size={16} /> Copy Link
                        </button>
                      )}
                      <button onClick={() => deleteInvite(invite._id)} className="delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        )}
      </div>
      
      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="crop-modal-overlay" onClick={() => setCropModalOpen(false)}>
          <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crop-modal-header">
              <h3><Crop size={20} /> Crop Image</h3>
              <button onClick={() => setCropModalOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="crop-container">
              {imageSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={cropField === 'profileImage' ? 1 : undefined}
                >
                  <img 
                    ref={imgRef} 
                    src={imageSrc} 
                    alt="Crop" 
                    crossOrigin="anonymous"
                    onLoad={() => console.log('Image loaded for cropping')}
                    onError={(e) => console.error('Image load error:', e)}
                  />
                </ReactCrop>
              )}
            </div>
            <div className="crop-modal-footer">
              <button onClick={() => setCropModalOpen(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleCropComplete} className="save-btn">Crop & Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
