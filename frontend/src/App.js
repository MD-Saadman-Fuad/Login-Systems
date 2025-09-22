import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ModuleLanding from './components/ModuleLanding';
import Module1Registration from './components/Module1Registration';
import Module2Registration from './components/Module2Registration';
import Module3Registration from './components/Module3Registration';
import Module4Registration from './components/Module4Registration';
import Module5Registration from './components/Module5Registration';
import Module6Registration from './components/Module6Registration';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Main Landing - Module Selection */}
            <Route path="/" element={<ModuleLanding />} />
            
            {/* Module Registration Routes */}
            <Route path="/register/module-1" element={<Module1Registration />} />
            <Route path="/register/module-2" element={<Module2Registration />} />
            <Route path="/register/module-3" element={<Module3Registration />} />
            <Route path="/register/module-4" element={<Module4Registration />} />
            <Route path="/register/module-5" element={<Module5Registration />} />
            <Route path="/register/module-6" element={<Module6Registration />} />
            
            {/* Welcome Page */}
            <Route path="/welcome" element={<Welcome />} />
            
            {/* Traditional Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;