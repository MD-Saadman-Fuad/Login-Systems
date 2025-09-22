import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ModuleRegistration.css';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');  // Navigate to landing page instead of dashboard
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/');  // Navigate to landing page to show unique ID
    } else {
      setMessage(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="module-header">
          <h2>🔐 Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="login">Email Address</label>
            <input
              type="email"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="module-footer">
          <p className="login-info">
            💡 Use the email and password from any registration module
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;