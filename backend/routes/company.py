"""
Company Routes
Handles company registration, viewing drives, applicants, and shortlist submission
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, bcrypt
from models import User, Company, JobDrive, Application, Student
from datetime import datetime

company_bp = Blueprint('company', __name__)

def require_company(fn):
    """Decorator to ensure user is a company"""
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'company':
            return jsonify({'error': 'Company access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

# ==================== COMPANY REGISTRATION ====================

@company_bp.route('/register', methods=['POST'])
def register_company():
    """
    Company registration (JNF submission)
    Expects: { "email": "...", "password": "...", "company_name": "...", "hr_name": "...", 
               "hr_email": "...", "hr_phone": "...", "industry": "...", "website": "...",
               "address": "...", "city": "...", "state": "..." }
    """
    try:
        data = request.get_json()
        
        # Check if company email already exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Check if company name already exists
        existing_company = Company.query.filter_by(company_name=data.get('company_name')).first()
        if existing_company:
            return jsonify({'error': 'Company name already registered'}), 400
        
        # Create user account
        password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        user = User(
            email=data.get('email'),
            password_hash=password_hash,
            role='company'
        )
        db.session.add(user)
        db.session.flush()  # Get user.id
        
        # Create company profile
        company = Company(
            user_id=user.id,
            company_name=data.get('company_name'),
            industry=data.get('industry', ''),
            website=data.get('website', ''),
            hr_name=data.get('hr_name'),
            hr_email=data.get('hr_email'),
            hr_phone=data.get('hr_phone', ''),
            address=data.get('address', ''),
            city=data.get('city', ''),
            state=data.get('state', ''),
            verification_status='pending'
        )
        db.session.add(company)
        db.session.commit()
        
        return jsonify({
            'message': 'Company registered successfully. Awaiting admin approval.',
            'company_id': company.id,
            'verification_status': 'pending'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== COMPANY PROFILE ====================

@company_bp.route('/profile', methods=['GET'])
@require_company
def get_company_profile():
    """Get current company's profile"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        
        return jsonify({
            'id': company.id,
            'company_name': company.company_name,
            'industry': company.industry,
            'website': company.website,
            'hr_name': company.hr_name,
            'hr_email': company.hr_email,
            'hr_phone': company.hr_phone,
            'verification_status': company.verification_status,
            'rejection_reason': company.rejection_reason
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== JOB DRIVES ====================

@company_bp.route('/drives', methods=['GET'])
@require_company
def get_company_drives():
    """Get all job drives for this company"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        drives = JobDrive.query.filter_by(company_id=company.id).all()
        
        result = [{
            'id': d.id,
            'drive_name': d.drive_name,
            'job_role': d.job_role,
            'package_lpa': d.package_lpa,
            'status': d.status,
            'application_count': d.applications.count(),
            'drive_date': d.drive_date.isoformat() if d.drive_date else None,
            'created_at': d.created_at.isoformat()
        } for d in drives]
        
        return jsonify({'job_drives': result, 'count': len(result)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@company_bp.route('/drives/<int:drive_id>', methods=['GET'])
@require_company
def get_drive_details(drive_id):
    """Get detailed information about a specific drive"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        job_drive = JobDrive.query.filter_by(id=drive_id, company_id=company.id).first()
        if not job_drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        return jsonify({
            'id': job_drive.id,
            'drive_name': job_drive.drive_name,
            'job_role': job_drive.job_role,
            'job_description': job_drive.job_description,
            'package_lpa': job_drive.package_lpa,
            'package_category': job_drive.package_category,
            'eligible_branches': job_drive.eligible_branches,
            'eligible_years': job_drive.eligible_years,
            'min_cgpa': job_drive.min_cgpa,
            'max_active_backlogs': job_drive.max_active_backlogs,
            'status': job_drive.status,
            'application_start_date': job_drive.application_start_date.isoformat() if job_drive.application_start_date else None,
            'application_end_date': job_drive.application_end_date.isoformat() if job_drive.application_end_date else None,
            'drive_date': job_drive.drive_date.isoformat() if job_drive.drive_date else None,
            'applications_locked': job_drive.applications_locked
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== APPLICANTS ====================

@company_bp.route('/drives/<int:drive_id>/applicants', methods=['GET'])
@require_company
def get_drive_applicants(drive_id):
    """
    Get all applicants for a specific drive
    Company can view student data after admin provides it
    """
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        # Verify this drive belongs to this company
        job_drive = JobDrive.query.filter_by(id=drive_id, company_id=company.id).first()
        if not job_drive:
            return jsonify({'error': 'Job drive not found or access denied'}), 404
        
        # Only show applicants if applications are locked (admin has finalized)
        if not job_drive.applications_locked:
            return jsonify({
                'message': 'Applications not yet finalized by admin',
                'applicants': [],
                'count': 0
            }), 200
        
        applications = Application.query.filter_by(job_drive_id=drive_id).all()
        
        result = [{
            'application_id': app.id,
            'student_id': app.student.id,
            'enrollment_number': app.student.enrollment_number,
            'name': app.student.name,
            'email': app.student.user.email,
            'phone': app.student.phone,
            'branch': app.student.branch,
            'year': app.student.year,
            'cgpa': app.student.cgpa,
            'tenth_percentage': app.student.tenth_percentage,
            'twelfth_percentage': app.student.twelfth_percentage,
            'active_backlogs': app.student.active_backlogs,
            'resume_url': app.resume_url,
            'status': app.status,
            'applied_at': app.applied_at.isoformat()
        } for app in applications]
        
        return jsonify({
            'job_drive_name': job_drive.drive_name,
            'applicants': result,
            'count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== SHORTLIST SUBMISSION ====================

@company_bp.route('/drives/<int:drive_id>/shortlist', methods=['POST'])
@require_company
def submit_shortlist(drive_id):
    """
    Submit shortlisted student IDs after selection rounds
    Expects: { "shortlisted_student_ids": [1, 5, 10, 15], "round": "final" }
    """
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        # Verify drive ownership
        job_drive = JobDrive.query.filter_by(id=drive_id, company_id=company.id).first()
        if not job_drive:
            return jsonify({'error': 'Job drive not found or access denied'}), 404
        
        data = request.get_json()
        shortlisted_ids = data.get('shortlisted_student_ids', [])
        round_name = data.get('round', 'shortlisted')
        
        # Update application status for shortlisted students
        updated_count = 0
        for student_id in shortlisted_ids:
            application = Application.query.filter_by(
                job_drive_id=drive_id,
                student_id=student_id
            ).first()
            
            if application:
                application.status = 'shortlisted'
                updated_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': f'Shortlist submitted successfully',
            'updated_count': updated_count,
            'total_shortlisted': len(shortlisted_ids)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@company_bp.route('/drives/<int:drive_id>/select', methods=['POST'])
@require_company
def submit_final_selection(drive_id):
    """
    Submit final selected students with offer details
    Expects: { "selections": [{"student_id": 1, "package_offered": 12.5}, ...] }
    """
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        job_drive = JobDrive.query.filter_by(id=drive_id, company_id=company.id).first()
        if not job_drive:
            return jsonify({'error': 'Job drive not found or access denied'}), 404
        
        data = request.get_json()
        selections = data.get('selections', [])
        
        updated_count = 0
        for selection in selections:
            student_id = selection.get('student_id')
            package_offered = selection.get('package_offered', job_drive.package_lpa)
            
            application = Application.query.filter_by(
                job_drive_id=drive_id,
                student_id=student_id
            ).first()
            
            if application:
                application.status = 'selected'
                application.final_package_offered = package_offered
                updated_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': 'Final selections submitted successfully',
            'selected_count': updated_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@company_bp.route('/drives/<int:drive_id>/reject', methods=['POST'])
@require_company
def reject_applicants(drive_id):
    """
    Reject specific applicants
    Expects: { "rejected_student_ids": [2, 7, 9] }
    """
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        
        job_drive = JobDrive.query.filter_by(id=drive_id, company_id=company.id).first()
        if not job_drive:
            return jsonify({'error': 'Job drive not found or access denied'}), 404
        
        data = request.get_json()
        rejected_ids = data.get('rejected_student_ids', [])
        
        updated_count = 0
        for student_id in rejected_ids:
            application = Application.query.filter_by(
                job_drive_id=drive_id,
                student_id=student_id
            ).first()
            
            if application:
                application.status = 'rejected'
                updated_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': 'Applicants rejected successfully',
            'rejected_count': updated_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
