import React, { useState } from 'react';
import { registerCompany } from '../api/api';
import { useNavigate } from 'react-router-dom';

function CompanyRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company_name: '',
    industry: '',
    website: '',
    hr_name: '',
    hr_email: '',
    hr_phone: '',
    address: '',
    city: '',
    state: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await registerCompany(formData);
      setSuccess(response.message || 'Registration successful! Awaiting admin approval.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Company Registration (JNF)
        </h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <h3>Company Details</h3>
          
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., IT, Manufacturing, Consulting"
            />
          </div>
          
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://company.com"
            />
          </div>
          
          <h3>HR Contact Details</h3>
          
          <div className="form-group">
            <label>HR Name *</label>
            <input
              type="text"
              name="hr_name"
              value={formData.hr_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>HR Email *</label>
            <input
              type="email"
              name="hr_email"
              value={formData.hr_email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>HR Phone</label>
            <input
              type="tel"
              name="hr_phone"
              value={formData.hr_phone}
              onChange={handleChange}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>
          
          <h3>Company Address</h3>
          
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          
          <h3>Login Credentials</h3>
          
          <div className="form-group">
            <label>Login Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Company'}
          </button>
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="btn"
              style={{ background: '#6c757d', color: 'white' }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyRegister;
