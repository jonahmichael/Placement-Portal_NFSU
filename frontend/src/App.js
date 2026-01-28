import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import AdminDashboard from './components/AdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import CompanyRegister from './components/CompanyRegister';
import Home from './components/Home';
import Login from './components/auth/Login';
import theme from './theme';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/login" 
            element={user && user.role === 'student' ? <Navigate to="/student" /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/admin" 
            element={<AdminDashboard user={user} onLogout={handleLogout} />} 
          />
          
          <Route 
            path="/company" 
            element={<CompanyDashboard user={user} onLogout={handleLogout} />} 
          />
          
          <Route 
            path="/student" 
            element={
              user && user.role === 'student' ? 
                <StudentDashboard user={user} onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/company/register" 
            element={<CompanyRegister />} 
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
