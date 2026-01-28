import React, { useState, useEffect } from 'react';
import { 
  getCompanyProfile,
  getCompanyDrives,
  getCompanyDriveApplicants,
  submitShortlist
} from '../api/api';

function CompanyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'drives') {
      loadDrives();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const response = await getCompanyProfile();
      setProfile(response);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const loadDrives = async () => {
    setLoading(true);
    try {
      const response = await getCompanyDrives();
      setDrives(response.job_drives);
    } catch (err) {
      setError('Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (driveId) => {
    setLoading(true);
    try {
      const response = await getCompanyDriveApplicants(driveId);
      setApplicants(response.applicants);
      setSelectedDrive(driveId);
      setActiveTab('applicants');
    } catch (err) {
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h2>Company Dashboard - {user.profile.company_name}</h2>
        <button onClick={onLogout} className="btn btn-danger">Logout</button>
      </div>
      
      <div className="container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={`btn ${activeTab === 'profile' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`btn ${activeTab === 'drives' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('drives')}
            >
              My Drives
            </button>
          </div>
          
          {activeTab === 'profile' && profile && (
            <div>
              <h3>Company Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p><strong>Company Name:</strong> {profile.company_name}</p>
                  <p><strong>Industry:</strong> {profile.industry}</p>
                  <p><strong>Website:</strong> {profile.website}</p>
                </div>
                <div>
                  <p><strong>HR Name:</strong> {profile.hr_name}</p>
                  <p><strong>HR Email:</strong> {profile.hr_email}</p>
                  <p><strong>HR Phone:</strong> {profile.hr_phone}</p>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <p>
                  <strong>Verification Status:</strong>{' '}
                  <span className={`badge badge-${
                    profile.verification_status === 'approved' ? 'success' :
                    profile.verification_status === 'rejected' ? 'danger' : 'warning'
                  }`}>
                    {profile.verification_status}
                  </span>
                </p>
                {profile.rejection_reason && (
                  <p><strong>Rejection Reason:</strong> {profile.rejection_reason}</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'drives' && (
            <div>
              <h3>My Job Drives</h3>
              {loading ? (
                <p>Loading...</p>
              ) : drives.length === 0 ? (
                <p>No job drives created yet. Contact admin to create a drive.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Drive Name</th>
                      <th>Job Role</th>
                      <th>Package (LPA)</th>
                      <th>Status</th>
                      <th>Applications</th>
                      <th>Drive Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drives.map(drive => (
                      <tr key={drive.id}>
                        <td>{drive.drive_name}</td>
                        <td>{drive.job_role}</td>
                        <td>₹{drive.package_lpa}</td>
                        <td>
                          <span className={`badge badge-${
                            drive.status === 'published' ? 'success' :
                            drive.status === 'closed' ? 'danger' : 'warning'
                          }`}>
                            {drive.status}
                          </span>
                        </td>
                        <td>{drive.application_count}</td>
                        <td>{drive.drive_date ? new Date(drive.drive_date).toLocaleDateString() : 'TBD'}</td>
                        <td>
                          <button 
                            className="btn btn-primary"
                            onClick={() => loadApplicants(drive.id)}
                          >
                            View Applicants
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {activeTab === 'applicants' && (
            <div>
              <h3>Applicants for Drive</h3>
              <button 
                className="btn"
                onClick={() => setActiveTab('drives')}
                style={{ marginBottom: '15px' }}
              >
                ← Back to Drives
              </button>
              
              {loading ? (
                <p>Loading...</p>
              ) : applicants.length === 0 ? (
                <p>No applicants yet or applications not finalized by admin.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Enrollment</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Branch</th>
                      <th>CGPA</th>
                      <th>10th %</th>
                      <th>12th %</th>
                      <th>Backlogs</th>
                      <th>Status</th>
                      <th>Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map(applicant => (
                      <tr key={applicant.application_id}>
                        <td>{applicant.enrollment_number}</td>
                        <td>{applicant.name}</td>
                        <td>{applicant.email}</td>
                        <td>{applicant.branch}</td>
                        <td>{applicant.cgpa}</td>
                        <td>{applicant.tenth_percentage}</td>
                        <td>{applicant.twelfth_percentage}</td>
                        <td>{applicant.active_backlogs}</td>
                        <td>
                          <span className={`badge badge-${
                            applicant.status === 'selected' ? 'success' :
                            applicant.status === 'shortlisted' ? 'info' :
                            applicant.status === 'rejected' ? 'danger' : 'warning'
                          }`}>
                            {applicant.status}
                          </span>
                        </td>
                        <td>
                          {applicant.resume_url && (
                            <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              <div style={{ marginTop: '20px' }}>
                <p><em>Shortlist submission and selection management will be implemented here.</em></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
