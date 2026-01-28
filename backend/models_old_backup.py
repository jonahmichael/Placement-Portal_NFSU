"""
SQLAlchemy ORM Models - Multi-Schema Architecture
College Placement Management System - NFSU

Schemas:
- public: Core authentication and applications
- admin: Master student data, placements, admin profiles
- student: Editable student profiles
# ==================== PUBLIC SCHEMA ====================

class User(db.Model):
    """Core authentication table - public.users"""
    __tablename__ = 'users'
    __table_args__ = {'schema': 'public'}
    
    user_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'student', 'company'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    admin = db.relationship('Admin', backref='user', uselist=False, foreign_keys='Admin.user_id')
    student_master = db.relationship('StudentMaster', backref='user', uselist=False, foreign_keys='StudentMaster.user_id')
    company = db.relationship('Company', backref='user', uselist=False, foreign_keys='Company.user_id
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    admin = db.relationship('Admin', backref='user', uselist=False, cascade='all, delete-orphan')
    student = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    company = db.relationship('Company', backref='user', uselist=False, cascade='all, delete-orphan')

class Admin(db.Model):
    """Admin profile"""
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100))
    phone = db.Column(db.String(15))

class Student(db.Model):
    """Student profile with comprehensive placement details"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Personal Details
    enrollment_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15))
    alternate_email = db.Column(db.String(120))
    
    # Academic Details
    branch = db.Column(db.String(100), nullable=False)  # e.g., CSE, IT, ECE
    year = db.Column(db.Integer, nullable=False)  # 1, 2, 3, 4
    semester = db.Column(db.Integer)
    cgpa = db.Column(db.Float, nullable=False)
    
    # 10th Details
    tenth_percentage = db.Column(db.Float)
    tenth_board = db.Column(db.String(50))
    tenth_year = db.Column(db.Integer)
    
    # 12th Details
    twelfth_percentage = db.Column(db.Float)
    twelfth_board = db.Column(db.String(50))
    twelfth_year = db.Column(db.Integer)
    
    # Backlogs & Status
    active_backlogs = db.Column(db.Integer, default=0)
    total_backlogs = db.Column(db.Integer, default=0)
    
    # Placement Status
    is_placed = db.Column(db.Boolean, default=False)
    placed_company = db.Column(db.String(200))
    placement_package = db.Column(db.Float)  # in LPA
    placement_date = db.Column(db.Date)
    placement_category = db.Column(db.String(20))  # 'dream', 'super_dream', 'normal'
    
    # Resume & Documents
    resume_url = db.Column(db.String(500))
    
    # Restrictions
    can_apply = db.Column(db.Boolean, default=True)  # Based on placement rules
    
    # Relationships
    applications = db.relationship('Application', backref='student', lazy='dynamic', cascade='all, delete-orphan')

class Company(db.Model):
    """Company profile and registration details"""
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Company Details
    company_name = db.Column(db.String(200), nullable=False, index=True)
    industry = db.Column(db.String(100))
    website = db.Column(db.String(200))
    
    # Contact Person (HR)
    hr_name = db.Column(db.String(100), nullable=False)
    hr_email = db.Column(db.String(120), nullable=False)
    hr_phone = db.Column(db.String(15))
    
    # Company Address
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    
    # Verification & Status
    verification_status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    verified_by_admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'))
    verification_date = db.Column(db.DateTime)
    rejection_reason = db.Column(db.Text)
    
    # Relationships
    job_drives = db.relationship('JobDrive', backref='company', lazy='dynamic', cascade='all, delete-orphan')

class JobDrive(db.Model):
    """Job/Placement Drive created and managed by Admin"""
    __tablename__ = 'job_drives'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    created_by_admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    
    # Drive Details
    drive_name = db.Column(db.String(200), nullable=False)
    job_role = db.Column(db.String(200), nullable=False)
    job_description = db.Column(db.Text)
    
    # Package & Compensation
    package_lpa = db.Column(db.Float, nullable=False)
    package_category = db.Column(db.String(20))  # 'dream', 'super_dream', 'normal'
    
    # Eligibility Criteria
    eligible_branches = db.Column(db.JSON)  # List of branch codes
    eligible_years = db.Column(db.JSON)  # List of years [3, 4]
    min_cgpa = db.Column(db.Float, default=0.0)
    max_active_backlogs = db.Column(db.Integer, default=0)
    min_tenth_percentage = db.Column(db.Float)
    min_twelfth_percentage = db.Column(db.Float)
    
    # Drive Status & Timeline
    status = db.Column(db.String(20), default='draft')  # 'draft', 'published', 'closed'
    application_start_date = db.Column(db.DateTime)
    application_end_date = db.Column(db.DateTime)
    drive_date = db.Column(db.Date)
    
    # Application Lock
    applications_locked = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('Application', backref='job_drive', lazy='dynamic', cascade='all, delete-orphan')

class Application(db.Model):
    """Student application to a job drive"""
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    job_drive_id = db.Column(db.Integer, db.ForeignKey('job_drives.id'), nullable=False)
    
    # Application Status
    status = db.Column(db.String(20), default='applied')  
    # 'applied', 'shortlisted', 'selected', 'rejected', 'offer_accepted', 'offer_rejected'
    
    # Resume submitted for this application
    resume_url = db.Column(db.String(500))
    
    # Selection Process
    round_status = db.Column(db.JSON)  # Track multiple rounds if needed
    final_package_offered = db.Column(db.Float)
    
    # Timestamps
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint: One student can only apply once to a drive
    __table_args__ = (db.UniqueConstraint('student_id', 'job_drive_id', name='unique_student_drive'),)

class Placement(db.Model):
    """Final placement record (offers accepted by students)"""
    __tablename__ = 'placements'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    job_drive_id = db.Column(db.Integer, db.ForeignKey('job_drives.id'), nullable=False)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    
    # Placement Details
    job_role = db.Column(db.String(200), nullable=False)
    package_lpa = db.Column(db.Float, nullable=False)
    placement_category = db.Column(db.String(20))  # 'dream', 'super_dream', 'normal'
    
    # Offer Details
    offer_letter_url = db.Column(db.String(500))
    joining_date = db.Column(db.Date)
    
    # Timestamps
    placed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student = db.relationship('Student', foreign_keys=[student_id])
    company = db.relationship('Company', foreign_keys=[company_id])
