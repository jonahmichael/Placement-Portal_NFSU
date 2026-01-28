import React, { useState, useEffect } from 'react';
import { 
  getCompanies, 
  approveCompany, 
  rejectCompany,
  getAllJobDrives,
  createJobDrive,
  publishJobDrive,
  getAllStudents,
  getEligibleStudents,
  getDriveApplicants
} from '../api/api';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [jobDrives, setJobDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (activeTab === 'companies') {
      loadCompanies('pending');
    } else if (activeTab === 'drives') {
      loadJobDrives();
    } else if (activeTab === 'students') {
      loadStudents();
    }
  }, [activeTab]);

  const loadCompanies = async (status = null) => {
    setLoading(true);
    try {
      const response = await getCompanies(status);
      setCompanies(response.companies);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      await approveCompany(companyId);
      setSuccess('Company approved successfully');
      loadCompanies('pending');
    } catch (err) {
      setError('Failed to approve company');
    }
  };

  const handleRejectCompany = async (companyId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await rejectCompany(companyId, reason);
      setSuccess('Company rejected');
      loadCompanies('pending');
    } catch (err) {
      setError('Failed to reject company');
    }
  };

  const loadJobDrives = async () => {
    setLoading(true);
    try {
      const response = await getAllJobDrives();
      setJobDrives(response.job_drives);
    } catch (err) {
      setError('Failed to load job drives');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await getAllStudents();
      setStudents(response.students);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h2>Admin Dashboard - {user.profile.name}</h2>
        <button onClick={onLogout} className="btn btn-danger">Logout</button>
      </div>
      
      <div className="container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={`btn ${activeTab === 'companies' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Approve Companies
            </button>
            <button 
              className={`btn ${activeTab === 'drives' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('drives')}
            >
              Job Drives
            </button>
            <button 
              className={`btn ${activeTab === 'students' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              View Students
            </button>
            <button 
              className={`btn ${activeTab === 'create-drive' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('create-drive')}
            >
              Create Drive
            </button>
          </div>
          
          {activeTab === 'companies' && (
            <div>
              <h3>Pending Company Approvals</h3>
              {loading ? (
                <p>Loading...</p>
              ) : companies.length === 0 ? (
                <p>No pending companies</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>HR Name</th>
                      <th>HR Email</th>
                      <th>Industry</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(company => (
                      <tr key={company.id}>
                        <td>{company.company_name}</td>
                        <td>{company.hr_name}</td>
                        <td>{company.hr_email}</td>
                        <td>{company.industry}</td>
                        <td>
                          <span className={`badge badge-${
                            company.verification_status === 'approved' ? 'success' :
                            company.verification_status === 'rejected' ? 'danger' : 'warning'
                          }`}>
                            {company.verification_status}
                          </span>
                        </td>
                        <td>
                          {company.verification_status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-success"
                                onClick={() => handleApproveCompany(company.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleRejectCompany(company.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {activeTab === 'drives' && (
            <div>
              <h3>All Job Drives</h3>
              {loading ? (
                <p>Loading...</p>
              ) : jobDrives.length === 0 ? (
                <p>No job drives created yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Drive Name</th>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Package (LPA)</th>
                      <th>Status</th>
                      <th>Applications</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobDrives.map(drive => (
                      <tr key={drive.id}>
                        <td>{drive.drive_name}</td>
                        <td>{drive.company_name}</td>
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
                        <td>{new Date(drive.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {activeTab === 'students' && (
            <div>
              <h3>All Students</h3>
              {loading ? (
                <p>Loading...</p>
              ) : students.length === 0 ? (
                <p>No students found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Enrollment</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Branch</th>
                      <th>Year</th>
                      <th>CGPA</th>
                      <th>Backlogs</th>
                      <th>Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student.enrollment_number}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.branch}</td>
                        <td>{student.year}</td>
                        <td>{student.cgpa}</td>
                        <td>{student.active_backlogs}</td>
                        <td>
                          {student.is_placed ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                            <span className="badge badge-warning">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {activeTab === 'create-drive' && (
            <div>
              <h3>Create Job Drive</h3>
              <p>Drive creation form will be implemented here with all eligibility criteria fields.</p>
              <p>Fields needed: Company selection, Job role, Package, Eligible branches, Years, Min CGPA, Max backlogs, etc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
