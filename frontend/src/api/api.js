/**
 * API Service for Backend Communication
 * Base URL: http://localhost:5000/api
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerStudent = async (studentData) => {
  const response = await api.post('/auth/register/student', studentData);
  return response.data;
};

export const registerCompany = async (companyData) => {
  const response = await api.post('/company/register', companyData);
  return response.data;
};

// ==================== ADMIN ====================

export const getCompanies = async (status = null) => {
  const url = status ? `/admin/companies?status=${status}` : '/admin/companies';
  const response = await api.get(url);
  return response.data;
};

export const approveCompany = async (companyId) => {
  const response = await api.put(`/admin/companies/${companyId}/approve`);
  return response.data;
};

export const rejectCompany = async (companyId, reason) => {
  const response = await api.put(`/admin/companies/${companyId}/reject`, { reason });
  return response.data;
};

export const createJobDrive = async (driveData) => {
  const response = await api.post('/admin/jobdrives', driveData);
  return response.data;
};

export const publishJobDrive = async (driveId, dates) => {
  const response = await api.put(`/admin/jobdrives/${driveId}/publish`, dates);
  return response.data;
};

export const getAllJobDrives = async (status = null) => {
  const url = status ? `/admin/jobdrives?status=${status}` : '/admin/jobdrives';
  const response = await api.get(url);
  return response.data;
};

export const getAllStudents = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/admin/students?${params}`);
  return response.data;
};

export const getEligibleStudents = async (driveId) => {
  const response = await api.get(`/admin/jobdrives/${driveId}/eligible-students`);
  return response.data;
};

export const getDriveApplicants = async (driveId) => {
  const response = await api.get(`/admin/jobdrives/${driveId}/applicants`);
  return response.data;
};

export const lockApplications = async (driveId) => {
  const response = await api.put(`/admin/jobdrives/${driveId}/lock`);
  return response.data;
};

// ==================== COMPANY ====================

export const getCompanyProfile = async () => {
  const response = await api.get('/company/profile');
  return response.data;
};

export const getCompanyDrives = async () => {
  const response = await api.get('/company/drives');
  return response.data;
};

export const getCompanyDriveApplicants = async (driveId) => {
  const response = await api.get(`/company/drives/${driveId}/applicants`);
  return response.data;
};

export const submitShortlist = async (driveId, studentIds) => {
  const response = await api.post(`/company/drives/${driveId}/shortlist`, {
    shortlisted_student_ids: studentIds
  });
  return response.data;
};

export const submitFinalSelection = async (driveId, selections) => {
  const response = await api.post(`/company/drives/${driveId}/select`, {
    selections
  });
  return response.data;
};

// ==================== STUDENT ====================

export const getStudentProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const getEligibleDrives = async () => {
  const response = await api.get('/student/drives');
  return response.data;
};

export const applyToDrive = async (driveId, resumeUrl) => {
  const response = await api.post('/student/apply', {
    job_drive_id: driveId,
    resume_url: resumeUrl
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/student/applications');
  return response.data;
};

export const acceptOffer = async (applicationId) => {
  const response = await api.put(`/student/applications/${applicationId}/accept-offer`);
  return response.data;
};

export const rejectOffer = async (applicationId) => {
  const response = await api.put(`/student/applications/${applicationId}/reject-offer`);
  return response.data;
};

export default api;
