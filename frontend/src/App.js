import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import StudentDashboard from './components/StudentDashboard';
import CompanyRegister from './components/CompanyRegister';

// Temporary Home component for testing without login
function Home() {
  return (
    <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
      <div className="card">
        <h1>NFSU Placement Portal</h1>
        <p style={{ marginBottom: '30px' }}>Select a dashboard to test (Login disabled temporarily)</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
          <Link to="/admin" className="btn btn-primary" style={{ textDecoration: 'none', display: 'block' }}>
            Admin Dashboard
          </Link>
          <Link to="/company" className="btn btn-success" style={{ textDecoration: 'none', display: 'block' }}>
            Company Dashboard
          </Link>
          <Link to="/student" className="btn" style={{ textDecoration: 'none', display: 'block', background: '#007bff', color: 'white' }}>
            Student Dashboard
          </Link>
          <Link to="/company/register" className="btn" style={{ textDecoration: 'none', display: 'block', background: '#6c757d', color: 'white' }}>
            Company Registration
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Mock user objects for testing
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
  );
}

export default App;
