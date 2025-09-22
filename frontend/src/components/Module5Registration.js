import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './ModuleRegistration.css';

const Module5Registration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);

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
  };

  const simulateSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    setMessage('');
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful OAuth response
      const mockUserData = {
        google: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          profilePicture: 'https://via.placeholder.com/100?text=JD'
        },
        facebook: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@facebook.com',
          profilePicture: 'https://via.placeholder.com/100?text=JS'
        },
        github: {
          firstName: 'Dev',
          lastName: 'User',
          email: 'dev.user@github.com',
          profilePicture: 'https://via.placeholder.com/100?text=DU'
        },
        linkedin: {
          firstName: 'Professional',
          lastName: 'User',
          email: 'professional.user@linkedin.com',
          profilePicture: 'https://via.placeholder.com/100?text=PU'
        }
      };

      const userData = mockUserData[provider];
      
      // Register with social data
      const registrationData = {
        registrationModule: 5,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        socialProvider: provider,
        profilePicture: userData.profilePicture,
        // Generate a random password for social users
        password: Math.random().toString(36).substring(2, 15)
      };

      const response = await authAPI.register(registrationData);

      if (response.data.success) {
        navigate('/welcome', { 
          state: { 
            serialNumber: response.data.user.serialNumber,
            module: 5,
            socialProvider: provider,
            userName: `${userData.firstName} ${userData.lastName}`
          } 
        });
      }
    } catch (error) {
      console.error('Social login error:', error);
      const errorMessage = error.response?.data?.message || `${provider} login failed`;
      setMessage(errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  const validateManualForm = () => {
    const newErrors = [];

    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email is invalid');
    if (!formData.password) newErrors.push('Password is required');
    else if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateManualForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        registrationModule: 5,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        socialProvider: 'manual'
      };

      const response = await authAPI.register(registrationData);

      if (response.data.success) {
        navigate('/welcome', { 
          state: { 
            serialNumber: response.data.user.serialNumber,
            module: 5,
            socialProvider: 'manual'
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
            <h2>Module 5: Social Registration</h2>
            <p>Quick signup with your favorite social platforms</p>
          </div>

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

          {!showManualForm ? (
            <div className="social-login-container">
              {/* Social Login Options */}
              <div className="social-section">
                <h3>🚀 Choose Your Platform</h3>
                <p className="social-description">
                  Sign up instantly using your existing social account
                </p>
                
                <div className="social-buttons">
                  {/* Google */}
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={() => simulateSocialLogin('google')}
                    disabled={loadingProvider !== null}
                  >
                    <div className="social-btn-content">
                      <div className="social-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <span>Continue with Google</span>
                      {loadingProvider === 'google' && <div className="social-spinner"></div>}
                    </div>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    className="social-btn facebook-btn"
                    onClick={() => simulateSocialLogin('facebook')}
                    disabled={loadingProvider !== null}
                  >
                    <div className="social-btn-content">
                      <div className="social-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span>Continue with Facebook</span>
                      {loadingProvider === 'facebook' && <div className="social-spinner"></div>}
                    </div>
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    className="social-btn github-btn"
                    onClick={() => simulateSocialLogin('github')}
                    disabled={loadingProvider !== null}
                  >
                    <div className="social-btn-content">
                      <div className="social-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#181717" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <span>Continue with GitHub</span>
                      {loadingProvider === 'github' && <div className="social-spinner"></div>}
                    </div>
                  </button>

                  {/* LinkedIn */}
                  <button
                    type="button"
                    className="social-btn linkedin-btn"
                    onClick={() => simulateSocialLogin('linkedin')}
                    disabled={loadingProvider !== null}
                  >
                    <div className="social-btn-content">
                      <div className="social-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <span>Continue with LinkedIn</span>
                      {loadingProvider === 'linkedin' && <div className="social-spinner"></div>}
                    </div>
                  </button>
                </div>

                <div className="divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="manual-signup-btn"
                  onClick={() => setShowManualForm(true)}
                >
                  📝 Sign up manually with email
                </button>
              </div>
            </div>
          ) : (
            /* Manual Form */
            <form onSubmit={handleManualSubmit} className="registration-form">
              <div className="form-section">
                <h3>📧 Manual Registration</h3>
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
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password (min 6 characters)"
                    />
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
                    />
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

              <button
                type="button"
                className="back-to-social-btn"
                onClick={() => setShowManualForm(false)}
              >
                ← Back to Social Login
              </button>
            </form>
          )}

          <div className="form-footer">
            <button 
              type="button" 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Module Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module5Registration;