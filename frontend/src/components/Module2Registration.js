import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePreRegistration } from '../context/PreRegistrationContext';
import './ModuleRegistration.css';

const Module2Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { preRegData } = usePreRegistration();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [captcha, setCaptcha] = useState({ question: '', answer: '', userAnswer: '' });

  // Clear any existing messages when component mounts
  useEffect(() => {
    setMessage('');
    setErrors([]);
    generateCaptcha();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let question;
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        // Ensure positive result
        const [larger, smaller] = num1 >= num2 ? [num1, num2] : [num2, num1];
        answer = larger - smaller;
        question = `${larger} - ${smaller}`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }
    
    setCaptcha({ question, answer, userAnswer: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any error messages when user starts typing
    if (message) {
      setMessage('');
    }
    if (errors.length > 0) {
      setErrors([]);
    }
    
    if (name === 'captchaAnswer') {
      setCaptcha(prev => ({ ...prev, userAnswer: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email is invalid');
    if (!formData.phoneNumber.trim()) newErrors.push('Phone number is required');
    if (!formData.password) newErrors.push('Password is required');
    else if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');
    if (!captcha.userAnswer.trim()) newErrors.push('Please solve the CAPTCHA');
    else if (parseInt(captcha.userAnswer) !== captcha.answer) newErrors.push('CAPTCHA answer is incorrect');

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
        registrationModule: 2,
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
        generateCaptcha(); // Regenerate captcha on failure
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setMessage(errorMessage);
      generateCaptcha(); // Regenerate captcha on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="module-registration">
      <div className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <h2>Module 2: Basic Registration</h2>
            <p>Simple registration with CAPTCHA verification</p>
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

            <div className="form-row">
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
                    placeholder="Enter password (min 6 characters)"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '�' : '👁️'}
                  </button>
                </div>
                <small className="form-text">Minimum 6 characters required</small>
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

            {/* CAPTCHA Section */}
            <div className="form-group captcha-group">
              <label htmlFor="captchaAnswer">Security Verification (CAPTCHA) *</label>
              <div className="captcha-container">
                <div className="captcha-question">
                  <span className="captcha-text">What is {captcha.question} ?</span>
                  <button
                    type="button"
                    className="captcha-refresh"
                    onClick={generateCaptcha}
                    title="Generate new CAPTCHA"
                  >
                    🔄
                  </button>
                </div>
                <input
                  type="number"
                  id="captchaAnswer"
                  name="captchaAnswer"
                  value={captcha.userAnswer}
                  onChange={handleChange}
                  required
                  placeholder="Enter the answer"
                  className="captcha-input"
                />
              </div>
              <small className="form-text">Solve the math problem above</small>
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

export default Module2Registration;