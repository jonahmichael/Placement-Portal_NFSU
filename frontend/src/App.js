import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import StudentDashboard from './components/StudentDashboard';
import CompanyRegister from './components/CompanyRegister';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (token in localStorage)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userProfile = localStorage.getItem('userProfile');

    if (token && role) {
      setUser({
        token,
        role,
        profile: userProfile ? JSON.parse(userProfile) : {}
      });
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, role, profile) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUser({ token, role, profile });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userProfile');
    setUser(null);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        
        <Route 
          path="/company/register" 
          element={<CompanyRegister />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            user ? (
              user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
              user.role === 'company' ? <CompanyDashboard user={user} onLogout={handleLogout} /> :
              user.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> :
              <Navigate to="/login" />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
