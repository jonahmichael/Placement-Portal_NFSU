import React, { useState, useEffect } from 'react';
import { 
  getStudentProfile,
  getEligibleDrives,
  applyToDrive,
  getMyApplications
} from '../api/api';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'drives') {
      loadEligibleDrives();
    } else if (activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const response = await getStudentProfile();
      setProfile(response);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const loadEligibleDrives = async () => {
    setLoading(true);
    try {
      const response = await getEligibleDrives();
      setDrives(response.drives);
    } catch (err) {
      setError('Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await getMyApplications();
      setApplications(response.applications);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    if (!window.confirm('Are you sure you want to apply to this drive?')) return;
    
    try {
      await applyToDrive(driveId, profile?.resume_url);
      setSuccess('Application submitted successfully!');
      loadEligibleDrives(); // Reload to update already_applied status
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    }
  };

  return (
    <div>
      <div className="navbar">
        <h2>Student Dashboard - {user.profile.name}</h2>
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
              Eligible Drives
            </button>
            <button 
              className={`btn ${activeTab === 'applications' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              My Applications
            </button>
          </div>
          
          {activeTab === 'profile' && profile && (
            <div>
              <h3>Student Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Enrollment Number:</strong> {profile.enrollment_number}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                </div>
                <div>
                  <p><strong>Branch:</strong> {profile.branch}</p>
                  <p><strong>Year:</strong> {profile.year}</p>
                  <p><strong>Semester:</strong> {profile.semester}</p>
                  <p><strong>CGPA:</strong> {profile.cgpa}</p>
                </div>
              </div>
              
              <h4 style={{ marginTop: '20px' }}>Academic Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p><strong>10th Percentage:</strong> {profile.tenth_percentage}%</p>
                  <p><strong>12th Percentage:</strong> {profile.twelfth_percentage}%</p>
                </div>
                <div>
                  <p><strong>Active Backlogs:</strong> {profile.active_backlogs}</p>
                  <p><strong>Total Backlogs:</strong> {profile.total_backlogs}</p>
                </div>
              </div>
              
              <h4 style={{ marginTop: '20px' }}>Placement Status</h4>
              <p>
                <strong>Placed:</strong>{' '}
                {profile.is_placed ? (
                  <span className="badge badge-success">Yes</span>
                ) : (
                  <span className="badge badge-warning">No</span>
                )}
              </p>
              {profile.is_placed && (
                <>
                  <p><strong>Company:</strong> {profile.placed_company}</p>
                  <p><strong>Package:</strong> ₹{profile.placement_package} LPA</p>
                  <p><strong>Category:</strong> {profile.placement_category}</p>
                </>
              )}
              <p>
                <strong>Can Apply:</strong>{' '}
                {profile.can_apply ? (
                  <span className="badge badge-success">Yes</span>
                ) : (
                  <span className="badge badge-danger">No</span>
                )}
              </p>
            </div>
          )}
          
          {activeTab === 'drives' && (
            <div>
              <h3>Eligible Job Drives</h3>
              {loading ? (
                <p>Loading...</p>
              ) : drives.length === 0 ? (
                <p>No job drives available at the moment.</p>
              ) : (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    <strong>Total Drives:</strong> {drives.length} | 
                    <strong> Eligible & Not Applied:</strong> {drives.filter(d => d.is_eligible && !d.already_applied).length}
                  </p>
                  
                  {drives.map(drive => (
                    <div 
                      key={drive.id} 
                      className="card" 
                      style={{ 
                        marginBottom: '15px',
                        borderLeft: drive.is_eligible && !drive.already_applied ? '4px solid #28a745' : '4px solid #ddd'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 10px 0' }}>{drive.drive_name}</h4>
                          <p><strong>Company:</strong> {drive.company_name}</p>
                          <p><strong>Job Role:</strong> {drive.job_role}</p>
                          <p><strong>Package:</strong> ₹{drive.package_lpa} LPA ({drive.package_category})</p>
                          <p><strong>Eligibility:</strong> Branches: {drive.eligible_branches.join(', ')} | Years: {drive.eligible_years.join(', ')} | Min CGPA: {drive.min_cgpa} | Max Backlogs: {drive.max_active_backlogs}</p>
                          
                          {drive.job_description && (
                            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                              {drive.job_description}
                            </p>
                          )}
                          
                          {!drive.is_eligible && drive.ineligibility_reasons.length > 0 && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#fff3cd', borderRadius: '4px' }}>
                              <strong>Ineligible:</strong>
                              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                {drive.ineligibility_reasons.map((reason, idx) => (
                                  <li key={idx}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {drive.drive_date && (
                            <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                              <strong>Drive Date:</strong> {new Date(drive.drive_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        <div style={{ marginLeft: '20px' }}>
                          {drive.already_applied ? (
                            <span className="badge badge-info">Applied</span>
                          ) : drive.is_eligible ? (
                            <button 
                              className="btn btn-success"
                              onClick={() => handleApply(drive.id)}
                            >
                              Apply Now
                            </button>
                          ) : (
                            <span className="badge badge-danger">Not Eligible</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'applications' && (
            <div>
              <h3>My Applications</h3>
              {loading ? (
                <p>Loading...</p>
              ) : applications.length === 0 ? (
                <p>You haven't applied to any drives yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Drive Name</th>
                      <th>Company</th>
                      <th>Job Role</th>
                      <th>Package (LPA)</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Drive Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.application_id}>
                        <td>{app.drive_name}</td>
                        <td>{app.company_name}</td>
                        <td>{app.job_role}</td>
                        <td>₹{app.package_lpa}</td>
                        <td>
                          <span className={`badge badge-${
                            app.status === 'selected' ? 'success' :
                            app.status === 'shortlisted' ? 'info' :
                            app.status === 'rejected' ? 'danger' : 'warning'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                        <td>{app.drive_date ? new Date(app.drive_date).toLocaleDateString() : 'TBD'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
