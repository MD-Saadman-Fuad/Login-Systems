import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            MERN Login System
          </Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link home-link">
              🏠 Home
            </Link>
            {isAuthenticated ? (
              <>
                <span className="nav-link">Welcome, {user?.firstName}!</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                🔐 Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;