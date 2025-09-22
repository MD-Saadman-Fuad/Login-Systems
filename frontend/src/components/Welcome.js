import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { serialNumber, module, userName } = location.state || {};

  const moduleNames = {
    1: "Complete Profile",
    2: "Basic Registration", 
    3: "Professional",
    4: "Email Focused",
    5: "Social Login",
    6: "Verified Account"
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="welcome-page">
      <div className="container">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="success-icon">🎉</div>
            <h1>Welcome to Our Platform!</h1>
            <p>Your account has been successfully created</p>
          </div>

          <div className="serial-number-display">
            <h2>Your Universal Serial Number</h2>
            <div className="serial-number">
              #{serialNumber || '0000'}
            </div>
            <p className="serial-description">
              This is your unique identifier across our entire platform
            </p>
          </div>

          <div className="registration-summary">
            <h3>Registration Details</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Registration Method:</span>
                <span className="value">Module {module} - {moduleNames[module]}</span>
              </div>
              {userName && (
                <div className="summary-item">
                  <span className="label">Welcome:</span>
                  <span className="value">{userName}</span>
                </div>
              )}
              <div className="summary-item">
                <span className="label">Account Status:</span>
                <span className="value status-active">Active</span>
              </div>
              <div className="summary-item">
                <span className="label">Registration Date:</span>
                <span className="value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul className="steps-list">
              <li>✅ Your account is ready to use</li>
              <li>✅ You can access your personal dashboard</li>
              <li>✅ Update your profile anytime</li>
              <li>✅ Enjoy all platform features</li>
            </ul>
          </div>

          <div className="welcome-actions">
            <button className="btn btn-primary" onClick={handleContinue}>
              Go to Dashboard
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>

          <div className="serial-info">
            <h4>About Your Serial Number</h4>
            <p>
              Your serial number <strong>#{serialNumber}</strong> is unique and permanent. 
              It's assigned sequentially to all users regardless of which registration 
              module they choose. Keep this number for your records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;