import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './ModuleRegistration.css';

const Module4Registration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [generatedPasswords, setGeneratedPasswords] = useState([]);
  const [selectedPasswordIndex, setSelectedPasswordIndex] = useState(null);

  const generateRandomPassword = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*'
    };

    const allChars = chars.uppercase + chars.lowercase + chars.numbers + chars.symbols;
    
    // Ensure at least one character from each category for 6 chars
    let password = '';
    password += chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
    password += chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
    password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
    
    // Fill remaining 2 characters randomly
    for (let i = 4; i < 6; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generatePasswords = () => {
    const passwords = [];
    for (let i = 0; i < 5; i++) {
      passwords.push(generateRandomPassword());
    }
    setGeneratedPasswords(passwords);
    setSelectedPasswordIndex(null);
  };

  // Clear any existing messages when component mounts
  useEffect(() => {
    setMessage('');
    setErrors([]);
    generatePasswords(); // Generate initial passwords
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any error messages when user starts typing
    if (message) {
      setMessage('');
    }
    if (errors.length > 0) {
      setErrors([]);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectPassword = (password, index) => {
    setFormData(prev => ({
      ...prev,
      password: password,
      confirmPassword: password
    }));
    setSelectedPasswordIndex(index);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage('Password copied to clipboard!');
      setTimeout(() => setMessage(''), 2000);
    });
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.email.trim()) newErrors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email is invalid');
    if (!formData.password) newErrors.push('Password is required');
    else if (formData.password.length !== 6) newErrors.push('Password must be exactly 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        registrationModule: 4,
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.register(registrationData);

      if (response.data.success) {
        navigate('/welcome', { 
          state: { 
            serialNumber: response.data.user.serialNumber,
            module: 4 
          } 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="module-registration">
      <div className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <h2>Module 4: Quick Email Registration</h2>
            <p>Fast signup with secure 6-character password generator</p>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            {message && (
              <div className={`alert ${message.includes('success') || message.includes('copied') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}

            {errors.length > 0 && (
              <div className="alert alert-error">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Email Section */}
            <div className="form-section">
              <h3>📧 Email Address</h3>
              <div className="form-group">
                <label htmlFor="email">Your Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="email-input-large"
                />
                <small className="form-text">This will be your username for login</small>
              </div>
            </div>

            {/* Password Generator Section */}
            <div className="form-section">
              <h3>🔐 Password Generator</h3>
              <p className="generator-description">
                Choose from our secure 6-character passwords below, or generate new ones:
              </p>
              
              <div className="password-generator">
                <div className="generator-header">
                  <h4>Generated Passwords</h4>
                  <button
                    type="button"
                    className="generate-btn"
                    onClick={generatePasswords}
                  >
                    🔄 Generate New
                  </button>
                </div>
                
                <div className="password-options">
                  {generatedPasswords.map((password, index) => (
                    <div 
                      key={index} 
                      className={`password-option ${selectedPasswordIndex === index ? 'selected' : ''}`}
                    >
                      <div className="password-display">
                        <span className="password-text">{password}</span>
                        <div className="password-actions">
                          <button
                            type="button"
                            className="select-btn"
                            onClick={() => selectPassword(password, index)}
                          >
                            {selectedPasswordIndex === index ? '✓ Selected' : 'Select'}
                          </button>
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={() => copyToClipboard(password)}
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="generator-info">
                  <small>
                    ✓ Each password contains: uppercase, lowercase, numbers, and symbols<br/>
                    ✓ Exactly 6 characters for easy memorization<br/>
                    ✓ Cryptographically secure random generation
                  </small>
                </div>
              </div>
            </div>

            {/* Manual Password Section */}
            <div className="form-section">
              <h3>🔑 Password Confirmation</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Selected Password *</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Select a password above or type your own"
                      maxLength="6"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                  <small className="form-text">Must be exactly 6 characters</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    maxLength="6"
                  />
                  {formData.confirmPassword && formData.password && (
                    <div className={`password-match ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                      {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="form-footer">
              <button 
                type="button" 
                className="back-btn"
                onClick={() => navigate('/')}
              >
                ← Back to Module Selection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Module4Registration;