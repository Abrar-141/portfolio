require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectDB = require('./config/db');

// Import Models
const Admin = require('./models/Admin');
const InviteToken = require('./models/InviteToken');
const PasswordReset = require('./models/PasswordReset');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Education = require('./models/Education');
const Certificate = require('./models/Certificate');
const HomeData = require('./models/HomeData');
const AboutData = require('./models/AboutData');
const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://portfolio-hafiz-abrar.vercel.app',
    'https://portfolio-abrar-admin.vercel.app'
  ],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

// Serve static files with proper headers
app.use(express.static(path.join(__dirname, '../frontend/public'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Admin Signup with validation (Invite-Only)
app.post('/api/admin/signup', [
  body('fullName').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('inviteToken').notEmpty().withMessage('Invite token is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  
  try {
    const { fullName, username, email, password, inviteToken } = req.body;
    
    // Check if this is first admin (no admins exist)
    const adminCount = await Admin.countDocuments();
    const isFirstAdmin = adminCount === 0;
    
    // Verify invite token only if not first admin
    if (!isFirstAdmin) {
      const invite = await InviteToken.findOne({ token: inviteToken });
      if (!invite) {
        return res.status(400).json({ success: false, message: 'Invalid invite token' });
      }
      
      if (invite.isUsed) {
        return res.status(400).json({ success: false, message: 'Invite token already used' });
      }
      
      if (new Date() > invite.expiresAt) {
        return res.status(400).json({ success: false, message: 'Invite token expired' });
      }
      
      if (invite.email !== email) {
        return res.status(400).json({ success: false, message: 'Email does not match invite' });
      }
    }
    
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    
    // Hash password manually
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = new Admin({ fullName, username, email, password: hashedPassword });
    await newAdmin.save();
    
    // Mark invite as used (only if not first admin)
    if (!isFirstAdmin) {
      const invite = await InviteToken.findOne({ token: inviteToken });
      invite.isUsed = true;
      invite.usedBy = newAdmin._id;
      await invite.save();
    }
    
    res.json({ success: true, message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Login with validation
app.post('/api/admin/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username);
    
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    console.log('Admin found, comparing password...');
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Login successful, token generated');
    
    res.json({ 
      success: true, 
      token, 
      admin: { fullName: admin.fullName, email: admin.email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Projects CRUD (Protected)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Skills CRUD (Protected)
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/skills', async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    await newSkill.save();
    res.json(newSkill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Home Data APIs
app.get('/api/home', async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (!homeData) {
      homeData = new HomeData({
        profileImage: '/My Pic.png.webp',
        heroImage: '/My Pic.png.webp',
        cvFile: '/Hafiz Abrar CV.pdf',
        heroTitle: 'Crafting Digital',
        heroSubtitle: 'Experiences',
        heroDescription: 'Full-Stack Developer specializing in MERN Stack & React Native.',
        email: 'abrariqbal141@gmail.com',
        github: 'https://github.com/abrar-iqbal-151',
        linkedin: 'https://www.linkedin.com/in/hâfîz-abrâr-449956281?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        projectsCount: '5+',
        name: 'Hafiz Abrar Iqbal',
        designation: 'Software Engineer'
      });
      await homeData.save();
    }
    res.json(homeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/home', async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (!homeData) {
      homeData = new HomeData(req.body);
    } else {
      Object.assign(homeData, req.body);
    }
    await homeData.save();
    res.json(homeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// About Data APIs
app.get('/api/about', async (req, res) => {
  try {
    let aboutData = await AboutData.findOne();
    if (!aboutData) {
      aboutData = new AboutData({
        profileImage: '/My Pic.png.webp',
        name: 'Hafiz Abrar Iqbal',
        title: 'Software Engineer | UI/UX Designer',
        bio: 'Full-Stack Developer specializing in MERN Stack & React Native.',
        quote: 'Building scalable solutions that users love.',
        focus: [
          { title: 'Development Focus', value: 'MERN Stack & React Native' },
          { title: 'Design Expertise', value: 'Figma, Photoshop & Illustrator' },
          { title: 'Academic Strength', value: 'Software Development Lifecycle' }
        ],
        stats: [
          { number: '6', label: 'Projects Completed' },
          { number: '2+', label: 'Years Experience' },
          { number: '100%', label: 'Client Satisfaction' }
        ]
      });
      await aboutData.save();
    }
    res.json(aboutData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/about', async (req, res) => {
  try {
    let aboutData = await AboutData.findOne();
    if (!aboutData) {
      aboutData = new AboutData(req.body);
    } else {
      Object.assign(aboutData, req.body);
    }
    await aboutData.save();
    res.json(aboutData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Education CRUD
app.get('/api/education', async (req, res) => {
  try {
    const education = await Education.find();
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/education', async (req, res) => {
  try {
    const newEdu = new Education(req.body);
    await newEdu.save();
    res.json(newEdu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/education/:id', async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!edu) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.json(edu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/education/:id', async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Certificate CRUD
app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const newCert = new Certificate(req.body);
    await newCert.save();
    res.json(newCert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/certificates/:id', async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// File upload endpoint
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../frontend/public'));
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, Date.now() + '-' + cleanName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG, PNG, WEBP) and PDF files are allowed'));
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const filePath = '/' + req.file.filename;
    res.json({ success: true, filePath });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});

// Contact endpoint with validation
app.post('/api/contact', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('subject').trim().isLength({ min: 3 }).withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  
  const { name, email, subject, message } = req.body;
  
  try {
    // Save to database
    const contactMessage = new ContactMessage({ name, email, subject, message });
    await contactMessage.save();
    
    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio: ${subject}`,
        html: `<h3>New Contact Message</h3>
               <p><strong>From:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`
      });
    }
    
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all contact messages (Protected)
app.get('/api/contact/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update message status (Protected)
app.put('/api/contact/messages/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact message (Protected)
app.delete('/api/contact/messages/:id', authMiddleware, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate Invite Token (Protected)
app.post('/api/admin/generate-invite', authMiddleware, [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  
  try {
    const { email } = req.body;
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const inviteToken = new InviteToken({
      token,
      email,
      createdBy: req.adminId,
      expiresAt
    });
    
    await inviteToken.save();
    
    const inviteLink = `${process.env.ADMIN_URL || 'https://portfolio-doxa-six.vercel.app'}/signup?token=${token}&email=${encodeURIComponent(email)}`;
    
    res.json({ 
      success: true, 
      inviteLink,
      token,
      email,
      expiresAt
    });
  } catch (error) {
    console.error('Generate invite error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all invite tokens (Protected)
app.get('/api/admin/invites', authMiddleware, async (req, res) => {
  try {
    const invites = await InviteToken.find()
      .populate('createdBy', 'fullName email')
      .populate('usedBy', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify invite token (Public)
app.get('/api/admin/verify-invite/:token', async (req, res) => {
  try {
    const invite = await InviteToken.findOne({ token: req.params.token });
    
    if (!invite) {
      return res.json({ valid: false, message: 'Invalid invite token' });
    }
    
    if (invite.isUsed) {
      return res.json({ valid: false, message: 'Invite token already used' });
    }
    
    if (new Date() > invite.expiresAt) {
      return res.json({ valid: false, message: 'Invite token expired' });
    }
    
    res.json({ valid: true, email: invite.email });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
});

// Delete invite token (Protected)
app.delete('/api/admin/invites/:id', authMiddleware, async (req, res) => {
  try {
    await InviteToken.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invite deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password - Send reset link
app.post('/api/admin/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  
  try {
    const { email } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Don't reveal if email exists or not for security
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }
    
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    const passwordReset = new PasswordReset({
      admin: admin._id,
      token,
      expiresAt
    });
    
    await passwordReset.save();
    
    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const resetLink = `${process.env.ADMIN_URL || 'http://localhost:3001'}/reset-password/${token}`;
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - Portfolio Admin',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${admin.fullName},</p>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
          <p>Or copy this link: ${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br/>Portfolio Admin Team</p>
        `
      });
    }
    
    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify reset token
app.get('/api/admin/verify-reset-token/:token', async (req, res) => {
  try {
    const resetToken = await PasswordReset.findOne({ token: req.params.token });
    
    if (!resetToken) {
      return res.status(400).json({ valid: false, message: 'Invalid reset token' });
    }
    
    if (resetToken.used) {
      return res.status(400).json({ valid: false, message: 'Reset token already used' });
    }
    
    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ valid: false, message: 'Reset token expired' });
    }
    
    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
});

// Reset Password
app.post('/api/admin/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  
  try {
    const { token, password } = req.body;
    
    const resetToken = await PasswordReset.findOne({ token });
    
    if (!resetToken) {
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }
    
    if (resetToken.used) {
      return res.status(400).json({ success: false, message: 'Reset token already used' });
    }
    
    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ success: false, message: 'Reset token expired' });
    }
    
    const admin = await Admin.findById(resetToken.admin);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    // Hash new password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    admin.password = hashedPassword;
    await admin.save();
    
    // Mark token as used
    resetToken.used = true;
    await resetToken.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
