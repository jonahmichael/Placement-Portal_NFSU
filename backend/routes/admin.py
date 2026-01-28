"""
Admin Routes
Handles company verification, job drive management, student management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Admin, Company, Student, JobDrive, Application
from datetime import datetime
from sqlalchemy import and_, or_

admin_bp = Blueprint('admin', __name__)

def require_admin(fn):
    """Decorator to ensure user is an admin"""
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

# ==================== COMPANY MANAGEMENT ====================

@admin_bp.route('/companies', methods=['GET'])
@require_admin
def get_companies():
    """
    Get all companies with optional filtering
    Query params: ?status=pending|approved|rejected
    """
    try:
        status = request.args.get('status')
        
        query = Company.query
        if status:
            query = query.filter_by(verification_status=status)
        
        companies = query.all()
        
        result = [{
            'id': c.id,
            'company_name': c.company_name,
            'hr_name': c.hr_name,
            'hr_email': c.hr_email,
            'hr_phone': c.hr_phone,
            'industry': c.industry,
            'website': c.website,
            'verification_status': c.verification_status,
            'verification_date': c.verification_date.isoformat() if c.verification_date else None
        } for c in companies]
        
        return jsonify({'companies': result, 'count': len(result)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/companies/<int:company_id>', methods=['GET'])
@require_admin
def get_company_details(company_id):
    """Get detailed information about a specific company"""
    try:
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        return jsonify({
            'id': company.id,
            'company_name': company.company_name,
            'industry': company.industry,
            'website': company.website,
            'hr_name': company.hr_name,
            'hr_email': company.hr_email,
            'hr_phone': company.hr_phone,
            'address': company.address,
            'city': company.city,
            'state': company.state,
            'verification_status': company.verification_status,
            'rejection_reason': company.rejection_reason
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/companies/<int:company_id>/approve', methods=['PUT'])
@require_admin
def approve_company(company_id):
    """Approve a company registration"""
    try:
        identity = get_jwt_identity()
        admin = Admin.query.filter_by(user_id=identity['user_id']).first()
        
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        company.verification_status = 'approved'
        company.verified_by_admin_id = admin.id
        company.verification_date = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Company approved successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/companies/<int:company_id>/reject', methods=['PUT'])
@require_admin
def reject_company(company_id):
    """Reject a company registration with reason"""
    try:
        data = request.get_json()
        identity = get_jwt_identity()
        admin = Admin.query.filter_by(user_id=identity['user_id']).first()
        
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        company.verification_status = 'rejected'
        company.rejection_reason = data.get('reason', 'No reason provided')
        company.verified_by_admin_id = admin.id
        company.verification_date = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Company rejected'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== JOB DRIVE MANAGEMENT ====================

@admin_bp.route('/jobdrives', methods=['POST'])
@require_admin
def create_job_drive():
    """
    Create a new job drive
    Expects: { "company_id": ..., "drive_name": "...", "job_role": "...", 
               "package_lpa": ..., "eligible_branches": [...], "min_cgpa": ..., etc. }
    """
    try:
        data = request.get_json()
        identity = get_jwt_identity()
        admin = Admin.query.filter_by(user_id=identity['user_id']).first()
        
        # Validate company
        company = Company.query.get(data.get('company_id'))
        if not company or company.verification_status != 'approved':
            return jsonify({'error': 'Invalid or unapproved company'}), 400
        
        # Create job drive
        job_drive = JobDrive(
            company_id=data.get('company_id'),
            created_by_admin_id=admin.id,
            drive_name=data.get('drive_name'),
            job_role=data.get('job_role'),
            job_description=data.get('job_description', ''),
            package_lpa=data.get('package_lpa'),
            package_category=data.get('package_category', 'normal'),
            eligible_branches=data.get('eligible_branches', []),
            eligible_years=data.get('eligible_years', [3, 4]),
            min_cgpa=data.get('min_cgpa', 0.0),
            max_active_backlogs=data.get('max_active_backlogs', 0),
            min_tenth_percentage=data.get('min_tenth_percentage'),
            min_twelfth_percentage=data.get('min_twelfth_percentage'),
            status='draft'
        )
        
        db.session.add(job_drive)
        db.session.commit()
        
        return jsonify({
            'message': 'Job drive created successfully',
            'job_drive_id': job_drive.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobdrives/<int:drive_id>/publish', methods=['PUT'])
@require_admin
def publish_job_drive(drive_id):
    """
    Publish a job drive (make it visible to students)
    Expects: { "application_start_date": "...", "application_end_date": "...", "drive_date": "..." }
    """
    try:
        data = request.get_json()
        job_drive = JobDrive.query.get(drive_id)
        
        if not job_drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        job_drive.status = 'published'
        job_drive.application_start_date = datetime.fromisoformat(data.get('application_start_date'))
        job_drive.application_end_date = datetime.fromisoformat(data.get('application_end_date'))
        job_drive.drive_date = datetime.fromisoformat(data.get('drive_date')).date()
        
        db.session.commit()
        
        return jsonify({'message': 'Job drive published successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobdrives', methods=['GET'])
@require_admin
def get_all_job_drives():
    """Get all job drives with optional status filter"""
    try:
        status = request.args.get('status')
        
        query = JobDrive.query
        if status:
            query = query.filter_by(status=status)
        
        drives = query.all()
        
        result = [{
            'id': d.id,
            'drive_name': d.drive_name,
            'company_name': d.company.company_name,
            'job_role': d.job_role,
            'package_lpa': d.package_lpa,
            'status': d.status,
            'application_count': d.applications.count(),
            'created_at': d.created_at.isoformat()
        } for d in drives]
        
        return jsonify({'job_drives': result, 'count': len(result)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobdrives/<int:drive_id>/lock', methods=['PUT'])
@require_admin
def lock_applications(drive_id):
    """Lock applications for a drive (no more applications allowed)"""
    try:
        job_drive = JobDrive.query.get(drive_id)
        if not job_drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        job_drive.applications_locked = True
        db.session.commit()
        
        return jsonify({'message': 'Applications locked'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== STUDENT MANAGEMENT ====================

@admin_bp.route('/students', methods=['GET'])
@require_admin
def get_all_students():
    """
    Get all students with optional filtering
    Query params: ?branch=CSE&year=4&min_cgpa=7.0&placed=false
    """
    try:
        # Build dynamic query based on filters
        query = Student.query
        
        if request.args.get('branch'):
            query = query.filter_by(branch=request.args.get('branch'))
        
        if request.args.get('year'):
            query = query.filter_by(year=int(request.args.get('year')))
        
        if request.args.get('min_cgpa'):
            query = query.filter(Student.cgpa >= float(request.args.get('min_cgpa')))
        
        if request.args.get('placed'):
            is_placed = request.args.get('placed').lower() == 'true'
            query = query.filter_by(is_placed=is_placed)
        
        students = query.all()
        
        result = [{
            'id': s.id,
            'enrollment_number': s.enrollment_number,
            'name': s.name,
            'email': s.user.email,
            'phone': s.phone,
            'branch': s.branch,
            'year': s.year,
            'cgpa': s.cgpa,
            'active_backlogs': s.active_backlogs,
            'is_placed': s.is_placed,
            'placed_company': s.placed_company,
            'placement_package': s.placement_package
        } for s in students]
        
        return jsonify({'students': result, 'count': len(result)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobdrives/<int:drive_id>/eligible-students', methods=['GET'])
@require_admin
def get_eligible_students(drive_id):
    """
    Get students eligible for a specific job drive based on criteria
    This implements the Student Eligibility Engine
    """
    try:
        job_drive = JobDrive.query.get(drive_id)
        if not job_drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        # Build eligibility query
        query = Student.query.filter(
            Student.year.in_(job_drive.eligible_years),
            Student.branch.in_(job_drive.eligible_branches),
            Student.cgpa >= job_drive.min_cgpa,
            Student.active_backlogs <= job_drive.max_active_backlogs,
            Student.can_apply == True,
            Student.is_placed == False  # Only unplaced students
        )
        
        # Additional filters
        if job_drive.min_tenth_percentage:
            query = query.filter(Student.tenth_percentage >= job_drive.min_tenth_percentage)
        
        if job_drive.min_twelfth_percentage:
            query = query.filter(Student.twelfth_percentage >= job_drive.min_twelfth_percentage)
        
        eligible_students = query.all()
        
        result = [{
            'id': s.id,
            'enrollment_number': s.enrollment_number,
            'name': s.name,
            'email': s.user.email,
            'branch': s.branch,
            'year': s.year,
            'cgpa': s.cgpa,
            'tenth_percentage': s.tenth_percentage,
            'twelfth_percentage': s.twelfth_percentage,
            'active_backlogs': s.active_backlogs
        } for s in eligible_students]
        
        return jsonify({
            'job_drive_name': job_drive.drive_name,
            'eligible_students': result,
            'count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobdrives/<int:drive_id>/applicants', methods=['GET'])
@require_admin
def get_drive_applicants(drive_id):
    """Get all students who applied to a specific drive"""
    try:
        job_drive = JobDrive.query.get(drive_id)
        if not job_drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        applications = Application.query.filter_by(job_drive_id=drive_id).all()
        
        result = [{
            'application_id': app.id,
            'student_id': app.student.id,
            'enrollment_number': app.student.enrollment_number,
            'name': app.student.name,
            'email': app.student.user.email,
            'branch': app.student.branch,
            'cgpa': app.student.cgpa,
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

@admin_bp.route('/students/<int:student_id>/placement', methods=['PUT'])
@require_admin
def update_student_placement(student_id):
    """
    Update student placement status
    Expects: { "is_placed": true, "placed_company": "...", "placement_package": ..., 
               "placement_category": "dream" }
    """
    try:
        data = request.get_json()
        student = Student.query.get(student_id)
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        student.is_placed = data.get('is_placed', False)
        student.placed_company = data.get('placed_company')
        student.placement_package = data.get('placement_package')
        student.placement_category = data.get('placement_category')
        student.placement_date = datetime.utcnow().date()
        
        # Apply placement rules (e.g., dream company rule)
        if student.is_placed and data.get('placement_category') == 'dream':
            student.can_apply = False  # Cannot apply to more companies
        
        db.session.commit()
        
        return jsonify({'message': 'Student placement status updated'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/export/students', methods=['POST'])
@require_admin
def export_students():
    """
    Export filtered student data (placeholder for CSV/Excel export)
    Expects: { "filters": { "branch": "CSE", "min_cgpa": 7.0, ... } }
    Returns: Student data array
    """
    try:
        data = request.get_json()
        filters = data.get('filters', {})
        
        # This is a simplified version - in production, generate CSV/Excel
        query = Student.query
        
        if filters.get('branch'):
            query = query.filter_by(branch=filters['branch'])
        
        if filters.get('min_cgpa'):
            query = query.filter(Student.cgpa >= filters['min_cgpa'])
        
        students = query.all()
        
        result = [{
            'enrollment_number': s.enrollment_number,
            'name': s.name,
            'email': s.user.email,
            'phone': s.phone,
            'branch': s.branch,
            'year': s.year,
            'cgpa': s.cgpa,
            'tenth_percentage': s.tenth_percentage,
            'twelfth_percentage': s.twelfth_percentage,
            'active_backlogs': s.active_backlogs,
            'resume_url': s.resume_url
        } for s in students]
        
        return jsonify({'students': result, 'count': len(result)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
