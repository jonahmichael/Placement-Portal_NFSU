"""
SQLAlchemy ORM Models - Multi-Schema Architecture
College Placement Management System - NFSU

Schemas:
- public: Core authentication and applications
- admin: Master student data, placements, admin profiles
- student: Editable student profiles
- company: Company profiles and job drives
"""

from app import db
from datetime import datetime, date
import uuid
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB

# Helper function for UUID generation
def generate_uuid():
    return str(uuid.uuid4())

# ==================== PUBLIC SCHEMA ====================

class User(db.Model):
    """Core authentication table - public.users"""
    __tablename__ = 'users'
    __table_args__ = {'schema': 'public'}
    
    user_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'student', 'company'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    admin = db.relationship('Admin', back_populates='user', uselist=False)
    student_master = db.relationship('StudentMaster', back_populates='user', uselist=False)
    company = db.relationship('Company', back_populates='user', uselist=False)

class Application(db.Model):
    """Student applications to job drives - public.applications"""
    __tablename__ = 'applications'
    __table_args__ = {'schema': 'public'}
    
    application_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('admin.students_master.student_id'), nullable=False, index=True)
    drive_id = db.Column(db.String(36), db.ForeignKey('company.job_drives.drive_id'), nullable=False, index=True)
    
    # Application details
    status = db.Column(db.String(50), default='Applied')  # 'Applied', 'Shortlisted', 'Selected', 'Rejected', 'Accepted', 'Offer Rejected'
    resume_submitted = db.Column(db.String(500))
    cover_letter = db.Column(db.Text)
    
    # Timestamps
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = db.relationship('StudentMaster', back_populates='applications')
    job_drive = db.relationship('JobDrive', back_populates='applications')
    
    # Unique constraint
    __table_args__ = (
        db.UniqueConstraint('student_id', 'drive_id', name='unique_student_drive_application'),
        {'schema': 'public'}
    )

# ==================== ADMIN SCHEMA ====================

class Admin(db.Model):
    """Admin profiles - admin.admins"""
    __tablename__ = 'admins'
    __table_args__ = {'schema': 'admin'}
    
    admin_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('public.users.user_id'), unique=True, nullable=False)
    
    full_name = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(100))
    contact_number = db.Column(db.String(15))
    designation = db.Column(db.String(100))
    
    # Relationships
    user = db.relationship('User', back_populates='admin')

class StudentMaster(db.Model):
    """Master student data (read-only for students) - admin.students_master"""
    __tablename__ = 'students_master'
    __table_args__ = {'schema': 'admin'}
    
    student_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('public.users.user_id'), unique=True, nullable=False)
    
    # Personal Information
    full_name = db.Column(db.String(255), nullable=False)
    roll_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    category = db.Column(db.String(50))
    
    # Contact Information
    personal_email = db.Column(db.String(255))
    contact_number = db.Column(db.String(15))
    alternate_contact = db.Column(db.String(15))
    permanent_address = db.Column(db.Text)
    current_address = db.Column(db.Text)
    
    # Academic Information
    program = db.Column(db.String(100))  # B.Tech, M.Tech, etc.
    branch = db.Column(db.String(100))   # CSE, IT, ECE, etc.
    batch_year = db.Column(db.Integer)
    current_semester = db.Column(db.Integer)
    cgpa = db.Column(db.Numeric(4, 2))
    
    # 10th Details
    tenth_board = db.Column(db.String(100))
    tenth_percentage = db.Column(db.Numeric(5, 2))
    tenth_year = db.Column(db.Integer)
    
    # 12th/Diploma Details
    twelfth_board = db.Column(db.String(100))
    twelfth_percentage = db.Column(db.Numeric(5, 2))
    twelfth_year = db.Column(db.Integer)
    twelfth_stream = db.Column(db.String(100))
    
    # Backlogs
    active_backlogs = db.Column(db.Integer, default=0)
    total_backlogs = db.Column(db.Integer, default=0)
    
    # Verification Status
    is_profile_verified = db.Column(db.Boolean, default=False)
    verified_by_admin_id = db.Column(db.String(36), db.ForeignKey('admin.admins.admin_id'))
    verification_date = db.Column(db.DateTime)
    
    # Placement Status
    placement_status = db.Column(db.String(50), default='Unplaced')  # 'Unplaced', 'Placed', 'Higher Studies', 'Not Interested'
    company_placed_id = db.Column(db.String(36), db.ForeignKey('company.companies.company_id'))
    package_offered = db.Column(db.Numeric(10, 2))  # in LPA
    date_of_offer = db.Column(db.Date)
    is_ppo = db.Column(db.Boolean, default=False)
    
    # Eligibility
    is_eligible_for_placement = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='student_master')
    editable_profile = db.relationship('StudentProfileEditable', back_populates='student_master', uselist=False)
    applications = db.relationship('Application', back_populates='student')
    placements = db.relationship('Placement', back_populates='student')

class Placement(db.Model):
    """Final placement records - admin.placements"""
    __tablename__ = 'placements'
    __table_args__ = {'schema': 'admin'}
    
    placement_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('admin.students_master.student_id'), nullable=False)
    company_id = db.Column(db.String(36), db.ForeignKey('company.companies.company_id'), nullable=False)
    drive_id = db.Column(db.String(36), db.ForeignKey('company.job_drives.drive_id'), nullable=False)
    application_id = db.Column(db.String(36), db.ForeignKey('public.applications.application_id'), nullable=False)
    
    # Placement Details
    job_role = db.Column(db.String(200), nullable=False)
    package_lpa = db.Column(db.Numeric(10, 2), nullable=False)
    placement_type = db.Column(db.String(50))  # 'Dream', 'Super Dream', 'Normal', 'Internship'
    
    # Offer Details
    offer_letter_path = db.Column(db.String(500))
    joining_date = db.Column(db.Date)
    location = db.Column(db.String(200))
    
    # Acceptance
    is_accepted_by_student = db.Column(db.Boolean, default=False)
    acceptance_date = db.Column(db.DateTime)
    
    # Admin Actions
    recorded_by_admin_id = db.Column(db.String(36), db.ForeignKey('admin.admins.admin_id'))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student = db.relationship('StudentMaster', back_populates='placements')
    company = db.relationship('Company', back_populates='placements')
    job_drive = db.relationship('JobDrive', back_populates='placements')

# ==================== STUDENT SCHEMA ====================

class StudentProfileEditable(db.Model):
    """Editable student profile data - student.student_profiles_editable"""
    __tablename__ = 'student_profiles_editable'
    __table_args__ = {'schema': 'student'}
    
    profile_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('admin.students_master.student_id'), unique=True, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('public.users.user_id'), nullable=False)
    
    # Skills & Competencies (Arrays)
    primary_skills = db.Column(ARRAY(db.Text), default=[])
    secondary_skills = db.Column(ARRAY(db.Text), default=[])
    programming_languages = db.Column(ARRAY(db.Text), default=[])
    tools_technologies = db.Column(ARRAY(db.Text), default=[])
    soft_skills = db.Column(ARRAY(db.Text), default=[])
    languages_known = db.Column(ARRAY(db.Text), default=[])
    
    # Projects (JSONB Array)
    # Format: [{"title": "...", "description": "...", "technologies": [...], "link": "...", "duration": "..."}]
    projects = db.Column(JSONB, default=[])
    
    # Internships (JSONB Array)
    # Format: [{"company": "...", "role": "...", "duration": "...", "description": "...", "certificate_path": "..."}]
    internships = db.Column(JSONB, default=[])
    
    # Certifications (JSONB Array)
    # Format: [{"name": "...", "issuer": "...", "issue_date": "...", "credential_id": "...", "certificate_path": "..."}]
    certifications = db.Column(JSONB, default=[])
    
    # Achievements (JSONB Array)
    # Format: [{"title": "...", "description": "...", "date": "...", "category": "..."}]
    achievements = db.Column(JSONB, default=[])
    
    # Extra-curricular (JSONB Array)
    extra_curricular = db.Column(JSONB, default=[])
    
    # Documents
    resume_file_path = db.Column(db.String(500))
    profile_photo_path = db.Column(db.String(500))
    
    # Additional Information
    career_objective = db.Column(db.Text)
    linkedin_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    portfolio_url = db.Column(db.String(255))
    
    # Preferences
    preferred_job_locations = db.Column(ARRAY(db.Text), default=[])
    preferred_job_roles = db.Column(ARRAY(db.Text), default=[])
    expected_salary_lpa = db.Column(db.Numeric(10, 2))
    
    # Timestamps
    last_updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student_master = db.relationship('StudentMaster', back_populates='editable_profile')

# ==================== COMPANY SCHEMA ====================

class Company(db.Model):
    """Company profiles and verification - company.companies"""
    __tablename__ = 'companies'
    __table_args__ = {'schema': 'company'}
    
    company_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('public.users.user_id'), unique=True, nullable=False)
    
    # Company Details
    company_name = db.Column(db.String(255), nullable=False, index=True)
    official_email = db.Column(db.String(255), nullable=False)
    company_website = db.Column(db.String(255))
    industry_type = db.Column(db.String(100))
    company_size = db.Column(db.String(50))  # '1-50', '51-200', '201-500', '500+'
    company_description = db.Column(db.Text)
    
    # HR Contact Details
    hr_name = db.Column(db.String(255), nullable=False)
    hr_email = db.Column(db.String(255), nullable=False)
    hr_contact_number = db.Column(db.String(15))
    hr_designation = db.Column(db.String(100))
    
    # Company Address
    office_address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100), default='India')
    pincode = db.Column(db.String(10))
    
    # Verification Status
    status = db.Column(db.String(50), default='Pending Approval')  # 'Pending Approval', 'Approved', 'Rejected'
    is_verified_by_admin = db.Column(db.Boolean, default=False)
    approved_by_admin_id = db.Column(db.String(36), db.ForeignKey('admin.admins.admin_id'))
    approval_date = db.Column(db.DateTime)
    rejection_reason = db.Column(db.Text)
    
    # Additional Details
    past_recruitment_history = db.Column(db.Text)
    special_requirements = db.Column(db.Text)
    
    # Timestamps
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='company')
    job_drives = db.relationship('JobDrive', back_populates='company')
    placements = db.relationship('Placement', back_populates='company')

class JobDrive(db.Model):
    """Job drives created by admin for companies - company.job_drives"""
    __tablename__ = 'job_drives'
    __table_args__ = {'schema': 'company'}
    
    drive_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    company_id = db.Column(db.String(36), db.ForeignKey('company.companies.company_id'), nullable=False, index=True)
    created_by_admin_id = db.Column(db.String(36), db.ForeignKey('admin.admins.admin_id'), nullable=False)
    
    # Job Details
    job_role_title = db.Column(db.String(255), nullable=False)
    job_description = db.Column(db.Text)
    job_type = db.Column(db.String(50))  # 'Full-time', 'Internship', 'Part-time'
    work_mode = db.Column(db.String(50))  # 'On-site', 'Remote', 'Hybrid'
    job_locations = db.Column(ARRAY(db.Text), default=[])
    
    # Package Details
    ctc_package = db.Column(db.Numeric(10, 2), nullable=False)  # in LPA
    package_breakup = db.Column(db.Text)
    stipend_for_internship = db.Column(db.Numeric(10, 2))
    bond_details = db.Column(db.Text)
    
    # Eligibility Criteria
    eligible_programs = db.Column(ARRAY(db.Text), default=[])  # ['B.Tech', 'M.Tech']
    eligible_branches = db.Column(ARRAY(db.Text), default=[])  # ['CSE', 'IT', 'ECE']
    eligible_batch_years = db.Column(ARRAY(db.Integer), default=[])
    minimum_cgpa = db.Column(db.Numeric(4, 2), default=0.0)
    max_active_backlogs = db.Column(db.Integer, default=0)
    minimum_tenth_percentage = db.Column(db.Numeric(5, 2))
    minimum_twelfth_percentage = db.Column(db.Numeric(5, 2))
    required_skills = db.Column(ARRAY(db.Text), default=[])
    
    # Gender specific
    gender_preference = db.Column(db.String(20))  # 'Male', 'Female', 'Any'
    
    # Drive Status and Timeline
    drive_status = db.Column(db.String(50), default='Published')  # 'Draft', 'Published', 'Closed', 'Completed'
    application_start_date = db.Column(db.DateTime)
    application_end_date = db.Column(db.DateTime)
    drive_conducted_date = db.Column(db.Date)
    
    # Selection Process
    # Format: [{"round_name": "...", "round_type": "...", "date": "...", "description": "..."}]
    selection_rounds = db.Column(JSONB, default=[])
    
    # Documents Required
    documents_required = db.Column(ARRAY(db.Text), default=[])
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = db.relationship('Company', back_populates='job_drives')
    applications = db.relationship('Application', back_populates='job_drive')
    placements = db.relationship('Placement', back_populates='job_drive')
