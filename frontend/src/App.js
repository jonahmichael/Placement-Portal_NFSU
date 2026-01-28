import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import AdminDashboard from './components/AdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import StudentDashboard from './components/StudentDashboard';
import CompanyRegister from './components/CompanyRegister';
import Home from './components/Home';

// Chakra UI theme configuration
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80c0ff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005ab3',
      700: '#004080',
      800: '#00264d',
      900: '#000d1a',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

function App() {
  // Mock user objects for testing (JWT disabled temporarily)
  const mockAdmin = {
    token: 'mock-token',
    role: 'admin',
    profile: { name: 'Test Admin', department: 'Placement Cell' }
  };

  const mockCompany = {
    token: 'mock-token',
    role: 'company',
    profile: { company_name: 'Test Company', verification_status: 'approved' }
  };

  const mockStudent = {
    token: 'mock-token',
    role: 'student',
    profile: { 
      name: 'Test Student', 
      enrollment_number: 'NFSU001',
      branch: 'CSE',
      cgpa: 8.5,
      is_placed: false
    }
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/admin" 
            element={<AdminDashboard user={mockAdmin} onLogout={handleLogout} />} 
          />
          
          <Route 
            path="/company" 
            element={<CompanyDashboard user={mockCompany} onLogout={handleLogout} />} 
          />
          
          <Route 
            path="/student" 
            element={<StudentDashboard user={mockStudent} onLogout={handleLogout} />} 
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
