"""
SQLAlchemy ORM Models - Matching Existing Neon DB Schema
College Placement Management System - NFSU

IMPORTANT: These models reflect the EXISTING database schema.
Do NOT use db.create_all() - tables already exist in Neon DB.
"""

from app import db
from datetime import datetime, date
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
import uuid

# ==================== PUBLIC SCHEMA ====================

class User(db.Model):
    """Core authentication table - public.users"""
    __tablename__ = 'users'
    __table_args__ = {'schema': 'public'}
    
    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'admin', 'student', 'company'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    admin = db.relationship('Admin', back_populates='user', uselist=False)
    student_master = db.relationship('StudentMaster', back_populates='user', uselist=False)
    company = db.relationship('Company', back_populates='user', uselist=False)

class Application(db.Model):
    """Student applications to job drives - public.applications"""
    __tablename__ = 'applications'
    __table_args__ = {'schema': 'public'}
    
    application_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.students_master.student_id'), nullable=False, index=True)
    drive_id = db.Column(UUID(as_uuid=True), db.ForeignKey('company.job_drives.drive_id'), nullable=False, index=True)
    
    # Application details
    application_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Applied')
    shortlist_date = db.Column(db.DateTime)
    selection_date = db.Column(db.DateTime)
    rejection_reason = db.Column(db.Text)
    resume_submitted_path = db.Column(db.String(255))
    interview_feedback = db.Column(db.Text)
    
    # Relationships
    student = db.relationship('StudentMaster', back_populates='applications')
    job_drive = db.relationship('JobDrive', back_populates='applications')

# ==================== ADMIN SCHEMA ====================

class Admin(db.Model):
    """Admin profiles - admin.admins"""
    __tablename__ = 'admins'
    __table_args__ = {'schema': 'admin'}
    
    admin_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('public.users.user_id'), unique=True, nullable=False)
    
    full_name = db.Column(db.String(100), nullable=False)
    mobile_number = db.Column(db.String(20))
    department = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='admin')

class StudentMaster(db.Model):
    """Master student data (admin-managed) - admin.students_master"""
    __tablename__ = 'students_master'
    __table_args__ = {'schema': 'admin'}
    
    student_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('public.users.user_id'), unique=True, nullable=False)
    
    # Personal Information
    roll_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    enrollment_number = db.Column(db.String(50))
    full_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    nationality = db.Column(db.String(50))
    category = db.Column(db.String(20))
    aadhaar_number = db.Column(db.String(16))
    
    # Family Information
    father_name = db.Column(db.String(100))
    mother_name = db.Column(db.String(100))
    
    # Contact Information
    permanent_address = db.Column(db.Text)
    current_address = db.Column(db.Text)
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    pincode = db.Column(db.String(10))
    mobile_number = db.Column(db.String(20))
    email_college = db.Column(db.String(255))
    
    # Academic Information - University
    university_name = db.Column(db.String(100), default='NFSU')
    campus_name = db.Column(db.String(100))
    course = db.Column(db.String(50))
    branch = db.Column(db.String(100))
    current_semester = db.Column(db.Integer)
    year_of_admission = db.Column(db.Integer)
    year_of_passing = db.Column(db.Integer)
    cgpa = db.Column(db.Numeric(4, 2))
    percentage_equivalent = db.Column(db.Numeric(5, 2))
    backlogs_count = db.Column(db.Integer, default=0)
    active_backlog = db.Column(db.Boolean, default=False)
    
    # Gap Information
    gap_in_education = db.Column(db.Boolean, default=False)
    gap_duration_years = db.Column(db.Integer)
    
    # 10th Details
    tenth_board = db.Column(db.String(100))
    tenth_school_name = db.Column(db.String(255))
    tenth_year_of_passing = db.Column(db.Integer)
    tenth_percentage = db.Column(db.Numeric(4, 2))
    
    # 12th Details
    twelfth_board = db.Column(db.String(100))
    twelfth_school_name = db.Column(db.String(255))
    twelfth_year_of_passing = db.Column(db.Integer)
    twelfth_percentage = db.Column(db.Numeric(4, 2))
    
    # Diploma Details
    diploma_board = db.Column(db.String(100))
    diploma_school_name = db.Column(db.String(255))
    diploma_year_of_passing = db.Column(db.Integer)
    diploma_percentage = db.Column(db.Numeric(4, 2))
    
    medium_of_instruction = db.Column(db.String(50))
    
    # Verification Status
    is_profile_verified = db.Column(db.Boolean, default=False)
    verified_by_admin_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.admins.admin_id'))
    verification_date = db.Column(db.DateTime)
    verification_remarks = db.Column(db.Text)
    profile_completion_percentage = db.Column(db.Numeric(5, 2), default=0.00)
    
    # Placement Status
    placement_status = db.Column(db.String(50), default='Not Placed')
    eligible_for_placement_drives = db.Column(db.Boolean, default=True)
    
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
    
    placement_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.students_master.student_id'), nullable=False)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('company.companies.company_id'), nullable=False)
    drive_id = db.Column(UUID(as_uuid=True), db.ForeignKey('company.job_drives.drive_id'))
    
    # Placement Details
    job_role = db.Column(db.String(100), nullable=False)
    package_offered = db.Column(db.Numeric(10, 2), nullable=False)
    offer_letter_path = db.Column(db.String(255))
    date_of_offer = db.Column(db.Date, nullable=False)
    acceptance_status = db.Column(db.String(50), default='Accepted')
    
    # Admin tracking
    placement_recorded_by_admin_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.admins.admin_id'))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = db.relationship('StudentMaster', back_populates='placements')
    company = db.relationship('Company', back_populates='placements')
    job_drive = db.relationship('JobDrive', back_populates='placements')

# ==================== STUDENT SCHEMA ====================

class StudentProfileEditable(db.Model):
    """Editable student profile data - student.student_profiles_editable"""
    __tablename__ = 'student_profiles_editable'
    __table_args__ = {'schema': 'student'}
    
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.students_master.student_id'), primary_key=True)
    
    # Additional Contact
    personal_email = db.Column(db.String(255))
    alternate_mobile_number = db.Column(db.String(20))
    emergency_contact_number = db.Column(db.String(20))
    
    # Online Profiles
    linkedin_profile = db.Column(db.String(255))
    github_profile = db.Column(db.String(255))
    portfolio_website = db.Column(db.String(255))
    
    # Career Information
    career_objective = db.Column(db.Text)
    
    # Skills (PostgreSQL Arrays)
    primary_skills = db.Column(ARRAY(db.Text))
    secondary_skills = db.Column(ARRAY(db.Text))
    programming_languages = db.Column(ARRAY(db.Text))
    tools_and_technologies = db.Column(ARRAY(db.Text))
    areas_of_interest = db.Column(ARRAY(db.Text))
    
    # Experience & Learning (JSONB)
    certifications = db.Column(JSONB)
    workshops_trainings = db.Column(JSONB)
    internships = db.Column(JSONB)
    projects = db.Column(JSONB)
    publications = db.Column(JSONB)
    
    # Other Information
    achievements = db.Column(db.Text)
    extracurricular = db.Column(db.Text)
    languages_known = db.Column(ARRAY(db.Text))
    
    # Document Uploads
    resume_file_path = db.Column(db.String(255))
    photo_file_path = db.Column(db.String(255))
    marksheet_10_upload_path = db.Column(db.String(255))
    marksheet_12_upload_path = db.Column(db.String(255))
    degree_certificate_upload_path = db.Column(db.String(255))
    id_proof_upload_path = db.Column(db.String(255))
    other_documents_upload_path = db.Column(JSONB)
    
    # Consent & Declarations
    declaration_correctness = db.Column(db.Boolean, default=False)
    agreement_placement_rules = db.Column(db.Boolean, default=False)
    consent_share_data = db.Column(db.Boolean, default=False)
    
    # Preferences
    willingness_relocation = db.Column(db.Boolean)
    willingness_bond = db.Column(db.Boolean)
    preferred_job_location = db.Column(db.Text)
    
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student_master = db.relationship('StudentMaster', back_populates='editable_profile')

# ==================== COMPANY SCHEMA ====================

class Company(db.Model):
    """Company profiles - company.companies"""
    __tablename__ = 'companies'
    __table_args__ = {'schema': 'company'}
    
    company_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('public.users.user_id'), unique=True)
    
    # Company Details
    company_name = db.Column(db.String(255), nullable=False, index=True)
    company_logo_path = db.Column(db.String(255))
    company_website = db.Column(db.String(255))
    company_type = db.Column(db.String(50))
    industry_domain = db.Column(db.String(100))
    company_description = db.Column(db.Text)
    
    # Company Address
    company_address = db.Column(db.Text)
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    country = db.Column(db.String(50), default='India')
    
    # Contact Person
    contact_person_name = db.Column(db.String(100))
    designation = db.Column(db.String(100))
    official_email = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20))
    alternate_phone = db.Column(db.String(20))
    linkedin_profile = db.Column(db.String(255))
    
    # Verification Status
    status = db.Column(db.String(50), default='Pending Approval')
    approved_by_admin_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.admins.admin_id'))
    approval_date = db.Column(db.DateTime)
    rejection_reason = db.Column(db.Text)
    is_verified_by_admin = db.Column(db.Boolean, default=False)
    
    # Terms
    terms_and_conditions_accepted = db.Column(db.Boolean, default=False)
    
    # Timestamps
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='company')
    job_drives = db.relationship('JobDrive', back_populates='company')
    placements = db.relationship('Placement', back_populates='company')

class JobDrive(db.Model):
    """Job drives - company.job_drives"""
    __tablename__ = 'job_drives'
    __table_args__ = {'schema': 'company'}
    
    drive_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('company.companies.company_id'), nullable=False, index=True)
    
    # Job Details
    job_role_title = db.Column(db.String(100), nullable=False)
    job_description = db.Column(db.Text)
    number_of_vacancies = db.Column(db.Integer)
    job_type = db.Column(db.String(50))
    work_location = db.Column(db.String(100))
    
    # Package Details
    ctc_package = db.Column(db.Numeric(10, 2))
    salary_breakup = db.Column(db.Text)
    bond_details = db.Column(db.Boolean)
    bond_duration_months = db.Column(db.Integer)
    probation_period_months = db.Column(db.Integer)
    service_agreement = db.Column(db.Boolean)
    
    # Eligibility Criteria (Arrays)
    eligible_courses = db.Column(ARRAY(db.Text))
    eligible_branches = db.Column(ARRAY(db.Text))
    passing_year = db.Column(ARRAY(db.Integer))
    selection_rounds = db.Column(ARRAY(db.Text))
    
    # Eligibility Numbers
    minimum_cgpa = db.Column(db.Numeric(4, 2))
    minimum_10th_percentage = db.Column(db.Numeric(4, 2))
    minimum_12th_percentage = db.Column(db.Numeric(4, 2))
    backlogs_allowed = db.Column(db.Integer, default=0)
    age_limit = db.Column(db.Integer)
    
    # Gender Specific
    gender_specific = db.Column(db.Boolean, default=False)
    
    # Selection Process
    online_or_offline = db.Column(db.String(20))
    test_platform = db.Column(db.String(100))
    interview_mode = db.Column(db.String(20))
    
    # Important Dates
    expected_date_of_visit = db.Column(db.Date)
    expected_offer_date = db.Column(db.Date)
    application_start_date = db.Column(db.Date)
    application_end_date = db.Column(db.Date, nullable=False)
    drive_date = db.Column(db.Date)
    
    # Status
    drive_status = db.Column(db.String(50), default='Published')
    
    # Documents
    job_notification_pdf_path = db.Column(db.String(255))
    company_consent_form_path = db.Column(db.String(255))
    nda_required = db.Column(db.Boolean)
    
    # Admin tracking
    created_by_admin_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin.admins.admin_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = db.relationship('Company', back_populates='job_drives')
    applications = db.relationship('Application', back_populates='job_drive')
    placements = db.relationship('Placement', back_populates='job_drive')
