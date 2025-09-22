import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModuleRegistration.css';

const Module6Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [canResendOtp, setCanResendOtp] = useState(false);

  // OTP Timer countdown
  useEffect(() => {
    if (step === 2 && otpTimer > 0) {
      const timer = setTimeout(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
  }, [step, otpTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async () => {
    try {
      const generatedOtp = generateOtp();
      
      // In a real app, this would send SMS/Email
      console.log(`OTP sent: ${generatedOtp}`);
      
      // Store OTP temporarily (in real app, this would be server-side)
      sessionStorage.setItem('currentOtp', generatedOtp);
      sessionStorage.setItem('otpExpiry', Date.now() + 300000); // 5 minutes
      
      // Simulate OTP display for demo purposes
      setTimeout(() => {
        alert(`Demo OTP: ${generatedOtp}\n(In production, this would be sent via SMS/Email)`);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.email || !formData.phoneNumber || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Phone number must be 10 digits');
      setIsLoading(false);
      return;
    }

    try {
      // Send OTP first
      await sendOtp();
      
      // Move to OTP verification step
      setStep(2);
      setOtpTimer(300); // Reset timer
      setCanResendOtp(false);
      
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      // Verify OTP (in demo, check against sessionStorage)
      const storedOtp = sessionStorage.getItem('currentOtp');
      const otpExpiry = sessionStorage.getItem('otpExpiry');
      
      if (!storedOtp || Date.now() > parseInt(otpExpiry)) {
        setError('OTP has expired. Please request a new one.');
        setIsLoading(false);
        return;
      }

      if (enteredOtp !== storedOtp) {
        setError('Invalid OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      // Register user after OTP verification
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          registrationModule: 6,
          otp: enteredOtp,
          isOtpVerified: true
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear OTP from storage
        sessionStorage.removeItem('currentOtp');
        sessionStorage.removeItem('otpExpiry');
        
        // Store token and navigate to welcome page
        localStorage.setItem('token', data.token);
        localStorage.setItem('serialNumber', data.user.serialNumber);
        navigate('/welcome');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;
    
    setIsLoading(true);
    await sendOtp();
    setOtpTimer(300);
    setCanResendOtp(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsLoading(false);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="module-header">
          <h2>Module 6: OTP Verification</h2>
          <p>Secure registration with SMS/Email verification</p>
        </div>

        {step === 1 ? (
          // Step 1: Registration Form
          <form onSubmit={handleRegistration} className="registration-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password (min 6 characters)"
                minLength="6"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP & Continue'}
            </button>
          </form>
        ) : (
          // Step 2: OTP Verification
          <div className="otp-verification">
            <div className="otp-info">
              <h3>Enter Verification Code</h3>
              <p>We've sent a 6-digit code to:</p>
              <p><strong>{formData.phoneNumber}</strong> & <strong>{formData.email}</strong></p>
              <p className="timer">Time remaining: <span className="countdown">{formatTime(otpTimer)}</span></p>
            </div>

            <form onSubmit={handleOtpVerification} className="otp-form">
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-input"
                    maxLength="1"
                    pattern="[0-9]"
                  />
                ))}
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Complete Registration'}
              </button>

              <div className="otp-actions">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="resend-btn"
                  disabled={!canResendOtp || isLoading}
                >
                  {canResendOtp ? 'Resend OTP' : 'Resend OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="back-btn"
                >
                  Back to Form
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="module-footer">
          <button 
            onClick={() => navigate('/')} 
            className="back-home-btn"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Module6Registration;