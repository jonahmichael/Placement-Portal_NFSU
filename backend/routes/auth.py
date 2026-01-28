"""
Authentication Routes
Handles login/logout for all user roles
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from models import User, Admin, Student, Company

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Universal login endpoint for all roles (admin, student, company)
    Expects: { "email": "user@example.com", "password": "password123" }
    Returns: { "access_token": "...", "role": "...", "user_id": ..., "profile": {...} }
    """
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 403
        
        # Generate JWT token
        access_token = create_access_token(identity={'user_id': user.id, 'role': user.role})
        
        # Get role-specific profile
        profile = None
        if user.role == 'admin':
            admin = Admin.query.filter_by(user_id=user.id).first()
            profile = {'name': admin.name, 'department': admin.department} if admin else {}
        elif user.role == 'student':
            student = Student.query.filter_by(user_id=user.id).first()
            profile = {
                'name': student.name,
                'enrollment_number': student.enrollment_number,
                'branch': student.branch,
                'cgpa': student.cgpa,
                'is_placed': student.is_placed
            } if student else {}
        elif user.role == 'company':
            company = Company.query.filter_by(user_id=user.id).first()
            profile = {
                'company_name': company.company_name,
                'verification_status': company.verification_status
            } if company else {}
        
        return jsonify({
            'access_token': access_token,
            'role': user.role,
            'user_id': user.id,
            'profile': profile
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register/student', methods=['POST'])
def register_student():
    """
    Student registration (can be admin-only in production)
    Expects: { "email": "...", "password": "...", "name": "...", "enrollment_number": "...", 
               "branch": "...", "year": ..., "cgpa": ... }
    """
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if Student.query.filter_by(enrollment_number=data.get('enrollment_number')).first():
            return jsonify({'error': 'Enrollment number already exists'}), 400
        
        # Create user
        password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        user = User(
            email=data.get('email'),
            password_hash=password_hash,
            role='student'
        )
        db.session.add(user)
        db.session.flush()  # Get user.id
        
        # Create student profile
        student = Student(
            user_id=user.id,
            enrollment_number=data.get('enrollment_number'),
            name=data.get('name'),
            phone=data.get('phone', ''),
            branch=data.get('branch'),
            year=data.get('year'),
            cgpa=data.get('cgpa', 0.0),
            tenth_percentage=data.get('tenth_percentage'),
            twelfth_percentage=data.get('twelfth_percentage')
        )
        db.session.add(student)
        db.session.commit()
        
        return jsonify({'message': 'Student registered successfully', 'user_id': user.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register/admin', methods=['POST'])
def register_admin():
    """
    Admin registration (should be protected/manual in production)
    Expects: { "email": "...", "password": "...", "name": "...", "department": "..." }
    """
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        user = User(
            email=data.get('email'),
            password_hash=password_hash,
            role='admin'
        )
        db.session.add(user)
        db.session.flush()
        
        admin = Admin(
            user_id=user.id,
            name=data.get('name'),
            department=data.get('department', ''),
            phone=data.get('phone', '')
        )
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({'message': 'Admin registered successfully', 'user_id': user.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current logged-in user details"""
    try:
        identity = get_jwt_identity()
        user_id = identity['user_id']
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout (client should delete token)"""
    # In a more complex setup, you'd add token to a blocklist
    return jsonify({'message': 'Logged out successfully'}), 200
