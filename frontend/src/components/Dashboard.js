import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="dashboard">
        <h2>Dashboard</h2>
        
        <div className="user-info">
          <h3>Welcome to your dashboard!</h3>
          <div className="user-detail">
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </div>
          <div className="user-detail">
            <strong>Username:</strong> {user?.username}
          </div>
          <div className="user-detail">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="user-detail">
            <strong>Account Status:</strong> {user?.isActive ? 'Active' : 'Inactive'}
          </div>
          <div className="user-detail">
            <strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <p>This is a protected route that only authenticated users can access.</p>
          <p>You can expand this dashboard to include more features like:</p>
          <ul>
            <li>Profile editing</li>
            <li>Password change</li>
            <li>User preferences</li>
            <li>Activity logs</li>
            <li>And much more!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;