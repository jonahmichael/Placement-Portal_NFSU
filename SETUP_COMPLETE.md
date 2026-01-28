# 🎓 NFSU Placement Portal - COMPLETE SETUP GUIDE

## ✅ Current Status

### Database
- ✅ Connected to Neon DB (PostgreSQL) at: `ep-morning-tree-ahbwg46u-pooler.c-3.us-east-1.aws.neon.tech`
- ✅ Multi-schema structure: `public`, `admin`, `student`, `company`
- ✅ All 8 tables exist with proper relationships
- ✅ Sample data seeded: 1 admin, 1 company (approved), 1 student

### Backend (Flask)
- ✅ Running on **http://localhost:5000**
- ✅ Models aligned with existing DB schema
- ✅ All API routes functional (auth, admin, company, student)
- ✅ CORS enabled for frontend
- ✅ JWT authentication available (currently disabled for testing)

### Frontend (React + Chakra UI)
- ✅ Chakra UI installed and configured
- ✅ Running on **http://localhost:3001** (or 3000)
- ✅ Basic routing setup with Home page
- ⏳ Dashboards need Chakra UI rebuild

---

## 📋 Test Credentials

### Login Credentials
```
Admin:
  Email: admin@nfsu.ac.in
  Password: password123

Company:
  Email: hr@techcorp.com
  Password: password123

Student:
  Email: student@nfsu.ac.in
  Password: password123
```

---

## 🚀 How to Run

### Start Backend
```bash
cd "d:\Placement Portal\backend"
python app.py
```
Backend will run on **http://localhost:5000**

### Start Frontend
```bash
cd "d:\Placement Portal\frontend"
npm start
```
Frontend will run on **http://localhost:3000** or **3001**

---

## 🔑 Key Features Implemented

### Admin Features
1. **View All Companies** - List all registered companies with filtering by status
2. **Approve/Reject Companies** - Company verification workflow
3. **Create Job Drives** - Create drives for approved companies with eligibility criteria
4. **View All Students** - Filter by program, branch, batch year, placement status
5. **Verify Student Profiles** - Approve student data
6. **View Statistics** - Total students, placements, companies, drives

### Company Features
1. **View Profile** - Company information
2. **View Job Drives** - All drives created for the company
3. **View Applicants** - See students who applied to each drive
4. **Shortlist Candidates** - Update application status (Shortlisted/Selected/Rejected)

### Student Features
1. **View Master Profile** - Read-only academic data (managed by admin)
2. **Edit Profile** - Update skills, projects, internships, certifications
3. **View Eligible Drives** - Real-time eligibility checking with reasons
4. **Apply to Drives** - Submit applications to eligible drives
5. **Track Applications** - View status of all applications

---

## 📊 Database Schema Overview

### public.users
- Primary authentication table
- Columns: user_id (UUID), email, password_hash, role, is_active

### admin.students_master
- Complete student academic data (admin-managed)
- 50+ columns including CGPA, backlogs, 10th/12th marks, placement status

### student.student_profiles_editable
- Student-editable data (skills, projects, internships)
- Uses PostgreSQL ARRAY and JSONB types

### company.companies
- Company profiles with verification status
- Contact details, industry info

### company.job_drives
- Job postings with detailed eligibility criteria
- Arrays for eligible courses, branches, selection rounds

### public.applications
- Student applications to job drives
- Status tracking: Applied → Shortlisted → Selected

### admin.placements
- Final placement records
- Package details, offer letters, acceptance status

---

## 🎯 Eligibility Engine Logic

Students can only apply to drives where they meet ALL criteria:

1. **Program Match**: Student's course in `eligible_courses` array
2. **Branch Match**: Student's branch in `eligible_branches` array
3. **Batch Year Match**: Student's passing year in `passing_year` array
4. **CGPA Check**: `student.cgpa >= drive.minimum_cgpa`
5. **Backlogs Check**: `student.backlogs_count <= drive.backlogs_allowed`
6. **10th Marks**: `student.tenth_percentage >= drive.minimum_10th_percentage`
7. **12th Marks**: `student.twelfth_percentage >= drive.minimum_12th_percentage`
8. **Gender Filter** (if specified): Match `gender_specific` requirement
9. **Not Already Applied**: No existing application for same drive

---

## 🔐 Role-Based Access Control

### Admin (Highest Priority)
- **Full Access** to all data
- Create/manage job drives
- Approve companies
- Verify student profiles
- View all applications and placements
- Generate reports

### Student
- **Read**: Own master profile (academic data)
- **Edit**: Own editable profile (skills, projects)
- **Apply**: To eligible drives only
- **View**: Own applications and status

### Company
- **View**: Own profile and job drives
- **View**: Applicants for own drives only
- **Update**: Application status (shortlist/select/reject)
- **Cannot**: See other companies' data

---

## 📡 API Endpoints Reference

### Authentication
```
POST /api/auth/login              - Login (all roles)
POST /api/auth/register/student   - Student signup
POST /api/auth/register/company   - Company signup
GET  /api/auth/me                 - Get current user
```

### Admin Routes
```
GET  /api/admin/companies                      - List companies
POST /api/admin/companies/<id>/approve         - Approve/reject
POST /api/admin/job-drives                     - Create drive
GET  /api/admin/job-drives                     - List drives
GET  /api/admin/job-drives/<id>                - Drive details
GET  /api/admin/students                       - List students
GET  /api/admin/students/<id>                  - Student details
POST /api/admin/students/<id>/verify           - Verify profile
GET  /api/admin/statistics                     - Dashboard stats
```

### Company Routes
```
GET  /api/company/profile                      - Get profile
PUT  /api/company/profile                      - Update profile
GET  /api/company/job-drives                   - List own drives
GET  /api/company/job-drives/<id>/applicants   - View applicants
POST /api/company/job-drives/<id>/shortlist    - Update status
```

### Student Routes
```
GET  /api/student/profile/master               - Master profile
GET  /api/student/profile/editable             - Editable profile
PUT  /api/student/profile/editable             - Update profile
GET  /api/student/eligible-drives              - View eligible drives
POST /api/student/apply                        - Apply to drive
GET  /api/student/applications                 - Track applications
```

---

## 🛠️ Technology Stack Details

### Backend
- **Framework**: Flask 3.0
- **ORM**: SQLAlchemy 3.1
- **Auth**: Flask-JWT-Extended 4.7
- **Password**: Flask-Bcrypt 1.0
- **Database Driver**: psycopg2-binary 2.9.11
- **CORS**: Flask-CORS 6.0

### Frontend
- **Framework**: React 18.2
- **UI Library**: Chakra UI 2.8
- **Routing**: React Router DOM 6.20
- **HTTP Client**: Axios 1.6
- **Animations**: Framer Motion 11.0

### Database
- **Type**: PostgreSQL 14+
- **Host**: Neon DB (Serverless Postgres)
- **Features**: UUID, ARRAY, JSONB, Multi-schema

---

## 📝 Next Steps (TODO)

### High Priority
1. ✅ Rebuild all dashboards with Chakra UI
2. ⏳ Create comprehensive admin dashboard
3. ⏳ Student profile editor with JSONB handling
4. ⏳ Company applicant viewing interface
5. ⏳ Enable JWT authentication

### Medium Priority
1. File upload handling (resumes, certificates)
2. Email notifications (application submitted, shortlisted)
3. Advanced filtering on all list pages
4. Placement report generation (PDF)
5. Drive announcement system

### Low Priority
1. Analytics dashboard with charts
2. Student performance tracking
3. Company feedback system
4. Bulk student import (CSV)
5. Calendar integration for drive dates

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if dependencies are installed
cd backend
pip install -r requirements.txt

# Verify .env file exists
ls .env

# Test database connection
python inspect_db.py
```

### Frontend won't start
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force
```

### Can't login
- JWT is currently **disabled** for testing
- Use mock users in App.js
- Navigate directly to dashboards via Home page

### Database errors
- Ensure models.py matches actual DB schema
- Don't run `db.create_all()` - tables already exist
- Check DATABASE_URL in .env file

---

## 📞 Support

- **Database**: Neon DB Console - neon.tech
- **Backend Port**: 5000
- **Frontend Port**: 3000/3001
- **Repository**: (Add your GitHub link)

---

## 📄 License

MIT License - NFSU University Project

---

**Last Updated**: January 28, 2026
**Status**: ✅ Backend Complete | ⏳ Frontend In Progress
