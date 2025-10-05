import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreRegistration } from '../context/PreRegistrationContext';
import './ModuleRegistration.css';

const Module7Registration = () => {
  const navigate = useNavigate();
  const { setPreRegData } = usePreRegistration();
  const [formData, setFormData] = useState({
    age: '',
    isDisabled: false,
    disabilityType: '',
    isColorblind: false,
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      setPreRegData(formData);
      navigate('/home');
    } catch (error) {
      setMessage(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="module-registration">
      <div className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <h2>Accessibility Information</h2>
            <p>Please provide the following information to continue.</p>
          </div>

          {message && <div className="alert alert-error">{message}</div>}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                placeholder="Enter your age"
              />
            </div>

            <div className="form-group">
              <label htmlFor="isDisabled" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isDisabled"
                  name="isDisabled"
                  checked={formData.isDisabled}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                Are you disabled?
              </label>
            </div>

            {formData.isDisabled && (
              <div className="form-group">
                <label htmlFor="disabilityType">Type of Disability</label>
                <input
                  type="text"
                  id="disabilityType"
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  placeholder="Please specify your disability"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="isColorblind" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isColorblind"
                  name="isColorblind"
                  checked={formData.isColorblind}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                Are you colorblind?
              </label>
            </div>

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Module7Registration;
