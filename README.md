# College Placement Management System - NFSU

## Project Overview
This is a comprehensive College Placement Management System built for NFSU (National Forensic Sciences University) to manage the entire placement workflow including company registration, job drive management, student applications, and placement tracking.

## Tech Stack
- **Frontend:** React 18
- **Backend:** Flask (Python) with SQLAlchemy ORM
- **Database:** Neon DB (PostgreSQL compatible)
- **Authentication:** JWT (Flask-JWT-Extended)

## Project Structure

```
Placement Portal/
├── backend/
│   ├── app.py                  # Flask application entry point
│   ├── config.py               # Configuration settings
│   ├── models.py               # SQLAlchemy ORM models
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── routes/
│       ├── __init__.py
│       ├── auth.py            # Authentication routes
│       ├── admin.py           # Admin routes (company approval, job drives, students)
│       ├── company.py         # Company routes (registration, drives, shortlist)
│       └── student.py         # Student routes (view drives, apply, applications)
│
└── frontend/
    ├── package.json           # Node dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js           # React entry point
        ├── index.css          # Global styles
        ├── App.js             # Main app with routing
        ├── api/
        │   └── api.js         # API service for backend calls
        └── components/
            ├── Login.js                  # Login page
            ├── CompanyRegister.js        # Company registration form
            ├── AdminDashboard.js         # Admin dashboard
            ├── CompanyDashboard.js       # Company dashboard
            └── StudentDashboard.js       # Student dashboard
```

## Setup Instructions

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ and npm installed
- Neon DB account (PostgreSQL database)

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd "d:\Placement Portal\backend"
   ```

2. **Create a virtual environment:**
   ```powershell
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update DATABASE_URL with your Neon DB connection string:
     ```
     DATABASE_URL=postgresql://username:password@your-neon-hostname.neon.tech/placement_db
     ```
   - Generate strong SECRET_KEY and JWT_SECRET_KEY

6. **Initialize database (tables will be created automatically on first run):**
   ```powershell
   python app.py
   ```

7. **Backend will run on:** `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```powershell
   cd "d:\Placement Portal\frontend"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start development server:**
   ```powershell
   npm start
   ```

4. **Frontend will open automatically on:** `http://localhost:3000`

## Database Schema

The system includes the following main tables:
- **users:** Base authentication table for all users
- **admins:** Admin profiles
- **students:** Student profiles with academic details
- **companies:** Company profiles and verification status
- **job_drives:** Job/placement drives with eligibility criteria
- **applications:** Student applications to job drives
- **placements:** Final placement records

## Key Features Implemented

### Admin Module
- ✅ Company verification (approve/reject)
- ✅ Job drive creation and publishing
- ✅ Student eligibility engine (filter by CGPA, branch, year, backlogs)
- ✅ View all students with filters
- ✅ View drive applicants
- ✅ Application locking
- ✅ Export student data (API ready)

### Company Module
- ✅ Company registration (JNF submission)
- ✅ View verification status
- ✅ View assigned job drives
- ✅ View applicants (after admin locks applications)
- ✅ Submit shortlist
- ✅ Submit final selections

### Student Module
- ✅ Student profile view
- ✅ View eligible drives (with real-time eligibility check)
- ✅ Apply to drives
- ✅ View application status
- ✅ Accept/reject offers

### Authentication
- ✅ Universal login for all roles
- ✅ JWT-based authentication
- ✅ Role-based access control

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login for all roles
- `POST /api/auth/register/student` - Register student
- `POST /api/auth/register/admin` - Register admin
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/companies?status=pending` - Get companies
- `PUT /api/admin/companies/:id/approve` - Approve company
- `PUT /api/admin/companies/:id/reject` - Reject company
- `POST /api/admin/jobdrives` - Create job drive
- `PUT /api/admin/jobdrives/:id/publish` - Publish drive
- `GET /api/admin/jobdrives` - Get all drives
- `GET /api/admin/students` - Get all students
- `GET /api/admin/jobdrives/:id/eligible-students` - Get eligible students
- `GET /api/admin/jobdrives/:id/applicants` - Get applicants
- `PUT /api/admin/jobdrives/:id/lock` - Lock applications

### Company Routes
- `POST /api/company/register` - Register company
- `GET /api/company/profile` - Get profile
- `GET /api/company/drives` - Get my drives
- `GET /api/company/drives/:id/applicants` - Get applicants
- `POST /api/company/drives/:id/shortlist` - Submit shortlist
- `POST /api/company/drives/:id/select` - Submit final selection

### Student Routes
- `GET /api/student/profile` - Get profile
- `GET /api/student/drives` - Get eligible drives
- `POST /api/student/apply` - Apply to drive
- `GET /api/student/applications` - Get my applications
- `PUT /api/student/applications/:id/accept-offer` - Accept offer
- `PUT /api/student/applications/:id/reject-offer` - Reject offer

## Initial Data Setup

To get started, you'll need to create an admin account. You can do this via API:

```powershell
# Using PowerShell to create an admin
$adminData = @{
    email = "admin@nfsu.ac.in"
    password = "admin123"
    name = "Placement Admin"
    department = "Training & Placement Cell"
    phone = "+91 1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register/admin" -Method POST -Body $adminData -ContentType "application/json"
```

## Next Steps & Extensions

### Immediate Priorities (within 4 hours):
1. Test all API endpoints
2. Create sample data (admin, companies, students, drives)
3. Test complete workflow end-to-end
4. Fix any bugs found during testing

### Future Enhancements:
1. File upload for resumes and offer letters
2. Email notifications (using Flask-Mail)
3. Advanced reporting and analytics
4. Bulk student import (CSV/Excel)
5. Interview scheduling system
6. Multi-round selection tracking
7. Placement statistics dashboard
8. Role-based permission granularity
9. Audit logs
10. Mobile responsive improvements

## Troubleshooting

### Backend Issues:
- **Database connection error:** Check your DATABASE_URL in .env
- **Module not found:** Make sure virtual environment is activated and dependencies installed
- **CORS errors:** Verify CORS settings in app.py match your frontend URL

### Frontend Issues:
- **Cannot connect to backend:** Ensure backend is running on port 5000
- **Blank page:** Check browser console for errors
- **Login not working:** Verify JWT token is being stored in localStorage

## Security Notes (For Production):
- Change all SECRET_KEY values
- Use strong passwords
- Enable HTTPS
- Add rate limiting
- Implement proper session management
- Add input validation and sanitization
- Set up proper CORS policies
- Use environment-specific configs
- Add database backups
- Implement proper logging

## Support

For issues or questions, refer to:
- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/

---

**Built with ❤️ for NFSU Placement Cell**

Good luck with your placement portal development!
#   P l a c e m e n t - P o r t a l _ N F S U  
 