import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import '../CSS/Login.css';

function Signup() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: '',
    inviteToken: searchParams.get('token') || ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyInvite = async () => {
      const token = searchParams.get('token');
      if (!token) {
        // No token means first admin signup
        setInviteValid(true);
        setVerifying(false);
        return;
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${API_URL}/api/admin/verify-invite/${token}`);
        const data = await response.json();

        if (data.valid) {
          setInviteValid(true);
          setFormData(prev => ({ ...prev, email: data.email }));
        } else {
          setError(data.message || 'Invalid invite token');
        }
      } catch (error) {
        setError('Failed to verify invite token');
      }
      setVerifying(false);
    };

    verifyInvite();
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          inviteToken: formData.inviteToken || 'first-admin'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Server error. Please try again.');
    }
  };

  if (verifying) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Verifying Invite...</h1>
            <p>Please wait while we verify your invite token</p>
          </div>
        </div>
      </div>
    );
  }

  if (!inviteValid) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Invalid Invite</h1>
            <p>This invite link is not valid</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="auth-footer">
            <p>Contact the administrator for a valid invite link</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Create Admin Account</h1>
          <p>Register to access the admin dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSignup} className="login-form" autoComplete="off">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <UserPlus size={20} />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={20} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!searchParams.get('token')}
                autoComplete="off"
                style={searchParams.get('token') ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
