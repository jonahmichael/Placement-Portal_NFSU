# Quick Start Guide - NFSU Placement Portal

## 🚀 Get Running in 10 Minutes

### Step 1: Backend Setup (5 minutes)

```powershell
# Navigate to backend
cd "d:\Placement Portal\backend"

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

or

pip install Flask==3.0.0
pip install Flask-SQLAlchemy==3.1.1
pip install Flask-CORS==4.0.0
pip install Flask-Bcrypt==1.0.1
pip install Flask-JWT-Extended==4.6.0
pip install "psycopg[binary]"
pip install python-dotenv==1.0.0


# Create .env file
Copy-Item .env.example .env

# Edit .env and add your Neon DB connection string:
# DATABASE_URL=postgresql://username:password@your-host.neon.tech/placement_db
notepad .env

# Run the server
python app.py
```

Backend should now be running on **http://localhost:5000**

### Step 2: Frontend Setup (5 minutes)

Open a **NEW terminal window**:

```powershell
# Navigate to frontend
cd "d:\Placement Portal\frontend"

# Install dependencies
npm install

# Start the dev server
npm start
```

Frontend should open automatically at **http://localhost:3000**

### Step 3: Create Your First Admin

In a **third terminal**, create an admin account:

```powershell
# Create admin using PowerShell
$adminData = @{
    email = "admin@nfsu.ac.in"
    password = "admin123"
    name = "Placement Officer"
    department = "Training & Placement"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register/admin" `
    -Method POST `
    -Body $adminData `
    -ContentType "application/json"
```

### Step 4: Login & Test

1. Go to **http://localhost:3000**
2. Login with:
   - Email: `admin@nfsu.ac.in`
   - Password: `admin123`

## 🎯 Quick Test Workflow

### As Admin:
1. Register a test company via API or let company register
2. Approve the company
3. Create a job drive with eligibility criteria
4. Publish the drive

### As Company:
1. Go to http://localhost:3000/company/register
2. Fill in company details
3. Wait for admin approval
4. View drives and applicants

### As Student:
1. Register via API (or create registration form)
2. Login and view eligible drives
3. Apply to drives

## 📝 Sample API Calls

### Create a Test Student:

```powershell
$studentData = @{
    email = "student@nfsu.ac.in"
    password = "student123"
    name = "Test Student"
    enrollment_number = "NFSU001"
    branch = "CSE"
    year = 4
    cgpa = 8.5
    tenth_percentage = 85
    twelfth_percentage = 88
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register/student" `
    -Method POST `
    -Body $studentData `
    -ContentType "application/json"
```

### Create a Test Company (via API):

```powershell
$companyData = @{
    email = "hr@techcorp.com"
    password = "company123"
    company_name = "Tech Corp India"
    industry = "IT Services"
    website = "https://techcorp.com"
    hr_name = "HR Manager"
    hr_email = "hr@techcorp.com"
    hr_phone = "+91 9876543210"
    city = "Gandhinagar"
    state = "Gujarat"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/company/register" `
    -Method POST `
    -Body $companyData `
    -ContentType "application/json"
```

## 🔧 Common Issues

**Backend won't start:**
- Check if Python is in PATH: `python --version`
- Make sure virtual environment is activated (you should see `(venv)` in terminal)
- Verify DATABASE_URL in .env file

**Frontend won't start:**
- Check Node version: `node --version` (need 16+)
- Delete node_modules and reinstall: `rm -r node_modules; npm install`

**Can't login:**
- Check browser console for errors (F12)
- Verify backend is running on port 5000
- Clear browser localStorage

## 🎨 Customize

### Change Port Numbers:

**Backend** - Edit `app.py`, line with `app.run()`:
```python
app.run(debug=True, port=5001)  # Change 5000 to 5001
```

**Frontend** - Create `.env` in frontend folder:
```
PORT=3001
```

## 📊 Database

Your Neon DB tables will be created automatically on first run. No manual SQL needed!

Tables created:
- users
- admins
- students
- companies
- job_drives
- applications
- placements

## ⚡ Next 4 Hours - Build Checklist

- [ ] Create sample data (5-10 students, 2-3 companies)
- [ ] Test complete workflow end-to-end
- [ ] Add job drive creation form in Admin UI
- [ ] Test eligibility engine with different criteria
- [ ] Test company shortlist submission
- [ ] Add resume upload placeholder
- [ ] Test offer acceptance/rejection
- [ ] Basic styling improvements
- [ ] Add loading states where missing
- [ ] Test error handling
- [ ] Document any bugs found

## 💡 Tips

1. **Keep both terminals running** (backend + frontend)
2. **Use browser DevTools** to debug API calls
3. **Check backend terminal** for server errors
4. **Database resets:** Just restart backend (tables auto-recreate)
5. **Hot reload works:** Changes to React files reload automatically

---

**You're all set! Start building! 🚀**
