"""
Authentication Routes
Handles login, registration for all user types
"""

from flask import Blueprint, request, jsonify
from models import db, User, Admin, StudentMaster, Company
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint for all user types"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is active
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 403
        
        # Create JWT token
        access_token = create_access_token(identity={'user_id': user.user_id, 'role': user.role})
        
        # Get role-specific details
        profile_data = {'user_id': user.user_id, 'email': user.email, 'role': user.role}
        
        if user.role == 'admin':
            admin = Admin.query.filter_by(user_id=user.user_id).first()
            if admin:
                profile_data['admin_id'] = admin.admin_id
                profile_data['full_name'] = admin.full_name
        elif user.role == 'student':
            student = StudentMaster.query.filter_by(user_id=user.user_id).first()
            if student:
                profile_data['student_id'] = student.student_id
                profile_data['full_name'] = student.full_name
                profile_data['roll_number'] = student.roll_number
        elif user.role == 'company':
            company = Company.query.filter_by(user_id=user.user_id).first()
            if company:
                profile_data['company_id'] = company.company_id
                profile_data['company_name'] = company.company_name
                profile_data['status'] = company.status
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': profile_data
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/register', methods=['POST'])
def register_student():
    """Student registration endpoint - creates entries in public.users and admin.students_master"""
    try:
        data = request.get_json()
        
        # Required fields
        required_fields = ['email', 'password', 'full_name', 'roll_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Check if roll number already exists
        if StudentMaster.query.filter_by(roll_number=data['roll_number']).first():
            return jsonify({'error': 'Roll number already registered'}), 400
        
        # Hash password
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create User in public.users table
        user = User(
            email=data['email'],
            password_hash=password_hash,
            role='student',
            is_active=True
        )
        db.session.add(user)
        db.session.flush()  # Get user_id
        
        # Create StudentMaster in admin.students_master table
        student = StudentMaster(
            user_id=user.user_id,
            roll_number=data['roll_number'],
            enrollment_number=data.get('enrollment_number'),
            full_name=data['full_name'],
            gender=data.get('gender'),
            mobile_number=data.get('mobile_number'),
            email_college=data['email'],  # College email is the login email
            university_name='NFSU',  # Default as per schema
            course=data.get('course'),
            branch=data.get('branch'),
            current_semester=data.get('current_semester'),
            year_of_admission=data.get('year_of_admission'),
            cgpa=0.0,  # Default
            backlogs_count=0,  # Default
            active_backlog=False,  # Default
            gap_in_education=False,  # Default
            is_profile_verified=False,  # Default
            profile_completion_percentage=0.0,  # Default
            placement_status='Not Placed',  # Default
            eligible_for_placement_drives=True  # Default
        )
        db.session.add(student)
        db.session.commit()
        
        return jsonify({
            'message': 'Account created successfully! Please login.',
            'student_id': str(student.student_id),
            'user_id': str(user.user_id)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Student registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e) if str(e) else 'Registration failed'}), 500

@auth_bp.route('/register/student', methods=['POST'])
def register_student_legacy():
    """Legacy endpoint - redirects to /register"""
    return register_student()

@auth_bp.route('/register/admin', methods=['POST'])
def register_admin():
    """Admin registration endpoint"""
    try:
        data = request.get_json()
        
        # Required fields
        required_fields = ['email', 'password', 'full_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Hash password
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create User
        user = User(
            email=data['email'],
            password_hash=password_hash,
            role='admin',
            is_active=True
        )
        db.session.add(user)
        db.session.flush()
        
        # Create Admin
        admin = Admin(
            user_id=user.user_id,
            full_name=data['full_name'],
            department=data.get('department'),
            contact_number=data.get('contact_number'),
            designation=data.get('designation')
        )
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'Admin registration successful',
            'admin_id': admin.admin_id,
            'user_id': user.user_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Admin registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/register/company', methods=['POST'])
def register_company():
    """Company registration endpoint"""
    try:
        data = request.get_json()
        
        # Required fields
        required_fields = ['email', 'password', 'company_name', 'official_email', 'hr_name', 'hr_email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Hash password
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create User
        user = User(
            email=data['email'],
            password_hash=password_hash,
            role='company',
            is_active=True
        )
        db.session.add(user)
        db.session.flush()
        
        # Create Company
        company = Company(
            user_id=user.user_id,
            company_name=data['company_name'],
            official_email=data['official_email'],
            company_website=data.get('company_website'),
            industry_type=data.get('industry_type'),
            company_size=data.get('company_size'),
            company_description=data.get('company_description'),
            hr_name=data['hr_name'],
            hr_email=data['hr_email'],
            hr_contact_number=data.get('hr_contact_number'),
            hr_designation=data.get('hr_designation'),
            office_address=data.get('office_address'),
            city=data.get('city'),
            state=data.get('state'),
            country=data.get('country', 'India'),
            pincode=data.get('pincode')
        )
        db.session.add(company)
        db.session.commit()
        
        return jsonify({
            'message': 'Company registration successful. Pending admin approval.',
            'company_id': company.company_id,
            'user_id': user.user_id,
            'status': company.status
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Company registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user details"""
    try:
        identity = get_jwt_identity()
        user_id = identity['user_id']
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = {'user_id': user.user_id, 'email': user.email, 'role': user.role}
        
        if user.role == 'admin':
            admin = Admin.query.filter_by(user_id=user.user_id).first()
            if admin:
                profile_data['admin_id'] = admin.admin_id
                profile_data['full_name'] = admin.full_name
        elif user.role == 'student':
            student = StudentMaster.query.filter_by(user_id=user.user_id).first()
            if student:
                profile_data['student_id'] = student.student_id
                profile_data['full_name'] = student.full_name
                profile_data['roll_number'] = student.roll_number
        elif user.role == 'company':
            company = Company.query.filter_by(user_id=user.user_id).first()
            if company:
                profile_data['company_id'] = company.company_id
                profile_data['company_name'] = company.company_name
                profile_data['status'] = company.status
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Get current user error: {str(e)}")
        return jsonify({'error': 'Failed to fetch user details'}), 500
