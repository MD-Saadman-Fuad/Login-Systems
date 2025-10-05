import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePreRegistration } from '../context/PreRegistrationContext';
import './ModuleRegistration.css';

const Module1Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { preRegData } = usePreRegistration();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  // Clear any existing messages when component mounts
  useEffect(() => {
    setMessage('');
    setErrors([]);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    gender: '',
    dateOfBirth: '',
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
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasLetter && hasNumber && hasSpecial;
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }
    if (!formData.phoneNumber.trim()) newErrors.push('Phone number is required');
    if (!formData.gender) newErrors.push('Gender selection is required');
    if (!formData.dateOfBirth) newErrors.push('Date of birth is required');
    
    // Address validation
    if (!formData.address.street.trim()) newErrors.push('Street address is required');
    if (!formData.address.city.trim()) newErrors.push('City is required');
    if (!formData.address.state.trim()) newErrors.push('State is required');
    if (!formData.address.zipCode.trim()) newErrors.push('ZIP code is required');
    if (!formData.address.country.trim()) newErrors.push('Country is required');

    // Password validation
    if (!validatePassword(formData.password)) {
      newErrors.push('Password must be at least 8 characters and contain letters, numbers, and special characters');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setErrors([]);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        registrationModule: 1,
        ...preRegData, // Include data from the landing page
        ...formData,
      };

      const { success, message: apiMessage, user } = await register(registrationData);
      
      if (success && user) {
        navigate('/welcome', { 
          state: { 
            serialNumber: user.serialNumber, 
            module: user.registrationModule,
            userName: user.firstName || user.username 
          } 
        });
      } else {
        setMessage(apiMessage || 'Registration failed to return user data.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setMessage(errorMessage);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="module-registration">
      <div className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <h2>Module 1: Complete Profile Registration</h2>
            <p>Create your account with full personal details and secure authentication</p>
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
            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>
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
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-group">
                <label htmlFor="address.street">Street Address *</label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  required
                  placeholder="Enter your street address"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.city">City *</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter your city"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.state">State *</label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    required
                    placeholder="Enter your state"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    required
                    placeholder="Enter your ZIP code"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.country">Country *</label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    required
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="form-section">
              <h3>Security</h3>
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
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <small className="password-hint">
                  Must be at least 8 characters with letters, numbers, and special characters
                </small>
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
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
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

export default Module1Registration;