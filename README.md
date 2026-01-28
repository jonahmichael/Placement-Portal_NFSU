# College Placement Management System - NFSU University

## Overview
A comprehensive placement management system for college students, companies, and administrators built with **React**, **Flask**, and **PostgreSQL (Neon DB)**.

### Tech Stack
- **Frontend**: React 18, Chakra UI, Axios
- **Backend**: Flask 3.0, SQLAlchemy 3.1, Flask-JWT-Extended
- **Database**: Neon DB (PostgreSQL) with multi-schema architecture
- **Authentication**: JWT-based (currently disabled for testing)

---

## Database Architecture

### Multi-Schema Structure

#### **PUBLIC Schema**
- `users` - Core authentication (user_id, email, password_hash, role)
- `applications` - Student applications to job drives

#### **ADMIN Schema**
- `admins` - Admin profiles
- `students_master` - Master student data (read-only for students)
- `placements` - Final placement records

#### **STUDENT Schema**
- `student_profiles_editable` - Editable student profiles (skills, projects, internships, etc.)

#### **COMPANY Schema**
- `companies` - Company profiles and verification status
- `job_drives` - Job drives with eligibility criteria

### Key Features
- **UUID Primary Keys**: All tables use UUID (String(36)) instead of integer IDs
- **PostgreSQL-Specific Types**: JSONB for complex objects, ARRAY for lists
- **Schema Isolation**: Separate namespaces for different data domains
- **Foreign Key Relationships**: Cross-schema references maintained

---

## Installation & Setup

### Prerequisites
- **Python 3.10+** (with pip)
- **Node.js 16+** (with npm)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:
```env
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_HFImtQ9NWO6M@ep-morning-tree-ahbwg46u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET_KEY=your-secret-key
```

Start server:
```bash
python app.py
```

Backend runs on **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/login` - Login
- `POST /auth/register/student` - Student registration
- `POST /auth/register/admin` - Admin registration
- `POST /auth/register/company` - Company registration

### Admin (`/admin`)
- `GET /admin/companies` - List companies
- `POST /admin/companies/<id>/approve` - Approve/reject company
- `POST /admin/job-drives` - Create job drive
- `GET /admin/students` - List students

### Company (`/company`)
- `GET /company/profile` - Get profile
- `GET /company/job-drives/<id>/applicants` - View applicants
- `POST /company/job-drives/<id>/shortlist` - Update status

### Student (`/student`)
- `GET /student/profile/master` - Master profile (read-only)
- `GET /student/profile/editable` - Editable profile
- `GET /student/eligible-drives` - View eligible drives
- `POST /student/apply` - Apply to drive

---

## Current Status

### ✅ Completed
- Multi-schema PostgreSQL models with UUID keys
- Full backend API (authentication, admin, company, student routes)
- React frontend with Chakra UI integration
- Company registration and approval workflow
- Job drive creation with eligibility criteria
- Student eligibility checking engine
- Application submission and tracking

### ⏳ Pending
- Rebuild frontend dashboards with Chakra UI
- Enable JWT authentication
- File upload handling
- Email notifications

---

## Database Connection

```
postgresql+psycopg://neondb_owner:npg_HFImtQ9NWO6M@ep-morning-tree-ahbwg46u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Driver**: `psycopg` (v3) - Windows compatible, no pg_config needed

---

## Development Notes

- **Authentication**: Currently disabled for testing (JWT checks bypassed)
- **CORS**: Configured for `http://localhost:3000`
- **Auto-migrations**: Tables created via `db.create_all()` on first run

---

## Troubleshooting

### Backend
**Issue**: `ModuleNotFoundError: No module named 'psycopg'`
```bash
pip install psycopg[binary]
```

### Frontend
**Issue**: `Cannot find module '@chakra-ui/react'`
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

---

## Testing Workflow

1. **Company Registration** → Submit details (status: Pending)
2. **Admin Approval** → Approve company
3. **Create Job Drive** → Admin creates drive with eligibility rules
4. **Student Application** → View eligible drives, apply
5. **Company Shortlisting** → Update application status

---

## License
MIT License
