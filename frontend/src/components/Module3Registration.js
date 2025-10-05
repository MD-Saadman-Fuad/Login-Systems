import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePreRegistration } from '../context/PreRegistrationContext';
import './ModuleRegistration.css';

const Module3Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { preRegData } = usePreRegistration();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  // Clear any existing messages when component mounts
  useEffect(() => {
    setMessage('');
    setErrors([]);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

    // Real-time password strength checking
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommon: !['password', '123456', 'qwerty', 'admin'].includes(password.toLowerCase())
    };

    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];

    if (!checks.length) feedback.push('At least 8 characters');
    if (!checks.uppercase) feedback.push('One uppercase letter');
    if (!checks.lowercase) feedback.push('One lowercase letter');
    if (!checks.number) feedback.push('One number');
    if (!checks.special) feedback.push('One special character');
    if (!checks.noCommon) feedback.push('Avoid common passwords');

    setPasswordStrength({ score, feedback, checks });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return '#f56565';
    if (passwordStrength.score <= 4) return '#ed8936';
    if (passwordStrength.score <= 5) return '#ecc94b';
    return '#48bb78';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 4) return 'Fair';
    if (passwordStrength.score <= 5) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email is invalid');
    if (!formData.password) newErrors.push('Password is required');
    else if (passwordStrength.score < 4) newErrors.push('Password is too weak. Please create a stronger password');
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
        registrationModule: 3,
        ...preRegData,
        ...formData,
      };

      const { success, message: apiMessage, user } = await register(registrationData);

      if (success && user) {
        navigate('/welcome', { 
          state: { 
            serialNumber: user.serialNumber, 
            module: user.registrationModule,
            userName: user.firstName 
          } 
        });
      } else {
        setMessage(apiMessage || 'Registration failed to return user data.');
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
            <h2>Module 3: Professional Registration</h2>
            <p>Streamlined registration with essential information only</p>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
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

            {/* Professional Information */}
            <div className="form-section">
              <h3>👤 Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Professional Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.name@company.com"
                />
              </div>
            </div>

            {/* Security */}
            <div className="form-section">
              <h3>🔐 Security</h3>
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '�' : '👁️'}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${(passwordStrength.score / 6) * 100}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <div className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                      Password Strength: {getPasswordStrengthText()}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="strength-feedback">
                        <span>Required: </span>
                        {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '�' : '👁️'}
                  </button>
                </div>
                {formData.confirmPassword && formData.password && (
                  <div className={`password-match ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Professional Account...' : 'Create Professional Account'}
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

export default Module3Registration;