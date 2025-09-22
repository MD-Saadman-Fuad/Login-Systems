import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModuleLanding.css';

const ModuleLanding = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Full registration with personal details, address, and secure authentication",
      features: ["Personal Information", "Contact Details", "Address", "Date of Birth", "Strong Password (8+ chars)"],
      icon: "👤",
      color: "#4CAF50"
    },
    {
      id: 2,
      title: "Basic Registration",
      description: "Simple signup with essential information and CAPTCHA verification",
      features: ["Name & Contact", "Basic Password", "CAPTCHA Security", "Quick Setup"],
      icon: "📝",
      color: "#2196F3"
    },
    {
      id: 3,
      title: "Professional",
      description: "Streamlined registration for professional users",
      features: ["Name & Email", "Strong Password", "Clean Interface", "Business Ready"],
      icon: "💼",
      color: "#FF9800"
    },
    {
      id: 4,
      title: "Email Focused",
      description: "Email-centric registration with password generator",
      features: ["Email Authentication", "Password Generator", "Auto-Strong Password", "Quick Access"],
      icon: "📧",
      color: "#9C27B0"
    },
    {
      id: 5,
      title: "Social Login",
      description: "Sign up using your social media accounts",
      features: ["Google Login", "Facebook Login", "One-Click Setup", "No Password Needed"],
      icon: "🌐",
      color: "#F44336"
    },
    {
      id: 6,
      title: "Verified Account",
      description: "Maximum security with OTP verification",
      features: ["Email Verification", "Phone Verification", "OTP Security", "Verified Badge"],
      icon: "🔐",
      color: "#607D8B"
    }
  ];

  const handleModuleSelect = (moduleId) => {
    navigate(`/register/module-${moduleId}`);
  };

  return (
    <div className="module-landing">
      <div className="container">
        <div className="landing-header">
          <h1>Choose Your Registration Method</h1>
          <p>Select the registration module that best fits your needs. Each user gets a unique serial number regardless of the chosen method.</p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div 
              key={module.id} 
              className="module-card"
              style={{ borderColor: module.color }}
            >
              <div className="module-header">
                <div 
                  className="module-icon"
                  style={{ backgroundColor: module.color }}
                >
                  {module.icon}
                </div>
                <h3>{module.title}</h3>
              </div>
              
              <p className="module-description">{module.description}</p>
              
              <ul className="module-features">
                {module.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <button 
                className="module-button"
                style={{ backgroundColor: module.color }}
                onClick={() => handleModuleSelect(module.id)}
              >
                Choose Module {module.id}
              </button>
            </div>
          ))}
        </div>

        <div className="landing-footer">
          <div className="info-section">
            <h3>🔢 Universal Serial Numbers</h3>
            <p>Every user receives a unique 4-digit serial number (0001, 0002, 0003...) regardless of which module they choose to register with.</p>
          </div>
          
          <div className="info-section">
            <h3>🔒 Secure & Flexible</h3>
            <p>All modules provide secure authentication with different levels of information collection to suit your privacy preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleLanding;