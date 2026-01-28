"""
Admin Routes
Handles company approval, job drive management, student management
"""

from flask import Blueprint, request, jsonify
from models import db, Admin, Company, JobDrive, StudentMaster, Application
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/companies', methods=['GET'])
@require_admin
def get_companies():
    """Get all companies with filtering"""
    try:
        status_filter = request.args.get('status')  # 'Pending Approval', 'Approved', 'Rejected'
        
        query = Company.query
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        companies = query.order_by(Company.registered_at.desc()).all()
        
        companies_list = []
        for company in companies:
            companies_list.append({
                'company_id': company.company_id,
                'company_name': company.company_name,
                'official_email': company.official_email,
                'company_website': company.company_website,
                'industry_type': company.industry_type,
                'company_size': company.company_size,
                'hr_name': company.hr_name,
                'hr_email': company.hr_email,
                'hr_contact_number': company.hr_contact_number,
                'city': company.city,
                'status': company.status,
                'is_verified_by_admin': company.is_verified_by_admin,
                'registered_at': company.registered_at.isoformat() if company.registered_at else None
            })
        
        return jsonify({'companies': companies_list}), 200
        
    except Exception as e:
        print(f"Get companies error: {str(e)}")
        return jsonify({'error': 'Failed to fetch companies'}), 500

@admin_bp.route('/companies/<company_id>/approve', methods=['POST'])
@require_admin
def approve_company(company_id):
    """Approve or reject a company"""
    try:
        identity = get_jwt_identity()
        admin = Admin.query.filter_by(user_id=identity['user_id']).first()
        if not admin:
            return jsonify({'error': 'Admin profile not found'}), 404
        
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        data = request.get_json()
        action = data.get('action')  # 'approve' or 'reject'
        
        if action == 'approve':
            company.status = 'Approved'
            company.is_verified_by_admin = True
            company.approved_by_admin_id = admin.admin_id
            company.approval_date = datetime.utcnow()
            company.rejection_reason = None
            message = f'{company.company_name} has been approved'
        elif action == 'reject':
            company.status = 'Rejected'
            company.is_verified_by_admin = False
            company.rejection_reason = data.get('reason', 'No reason provided')
            company.approved_by_admin_id = None
            company.approval_date = None
            message = f'{company.company_name} has been rejected'
        else:
            return jsonify({'error': 'Invalid action'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': message,
            'company': {
                'company_id': company.company_id,
                'company_name': company.company_name,
                'status': company.status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Approve company error: {str(e)}")
        return jsonify({'error': 'Failed to update company status'}), 500

@admin_bp.route('/job-drives', methods=['POST'])
@require_admin
def create_job_drive():
    """Create a new job drive"""
    try:
        identity = get_jwt_identity()
        admin = Admin.query.filter_by(user_id=identity['user_id']).first()
        if not admin:
            return jsonify({'error': 'Admin profile not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['company_id', 'job_role_title', 'ctc_package']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Verify company exists and is approved
        company = Company.query.get(data['company_id'])
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        if company.status != 'Approved':
            return jsonify({'error': 'Company must be approved before creating job drives'}), 400
        
        # Create job drive
        job_drive = JobDrive(
            company_id=data['company_id'],
            created_by_admin_id=admin.admin_id,
            job_role_title=data['job_role_title'],
            job_description=data.get('job_description'),
            job_type=data.get('job_type', 'Full-time'),
            work_mode=data.get('work_mode', 'On-site'),
            job_locations=data.get('job_locations', []),
            ctc_package=data['ctc_package'],
            package_breakup=data.get('package_breakup'),
            stipend_for_internship=data.get('stipend_for_internship'),
            bond_details=data.get('bond_details'),
            eligible_programs=data.get('eligible_programs', []),
            eligible_branches=data.get('eligible_branches', []),
            eligible_batch_years=data.get('eligible_batch_years', []),
            minimum_cgpa=data.get('minimum_cgpa', 0.0),
            max_active_backlogs=data.get('max_active_backlogs', 0),
            minimum_tenth_percentage=data.get('minimum_tenth_percentage'),
            minimum_twelfth_percentage=data.get('minimum_twelfth_percentage'),
            required_skills=data.get('required_skills', []),
            gender_preference=data.get('gender_preference', 'Any'),
            drive_status=data.get('drive_status', 'Published'),
            application_start_date=data.get('application_start_date'),
            application_end_date=data.get('application_end_date'),
            drive_conducted_date=data.get('drive_conducted_date'),
            selection_rounds=data.get('selection_rounds', []),
            documents_required=data.get('documents_required', [])
        )
        
        db.session.add(job_drive)
        db.session.commit()
        
        return jsonify({
            'message': 'Job drive created successfully',
            'drive_id': job_drive.drive_id,
            'job_role_title': job_drive.job_role_title,
            'company_name': company.company_name
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Create job drive error: {str(e)}")
        return jsonify({'error': 'Failed to create job drive'}), 500

@admin_bp.route('/job-drives', methods=['GET'])
@require_admin
def get_job_drives():
    """Get all job drives with filtering"""
    try:
        company_id = request.args.get('company_id')
        status = request.args.get('status')
        
        query = JobDrive.query
        if company_id:
            query = query.filter_by(company_id=company_id)
        if status:
            query = query.filter_by(drive_status=status)
        
        job_drives = query.order_by(JobDrive.created_at.desc()).all()
        
        drives_list = []
        for drive in job_drives:
            # Get application count
            app_count = Application.query.filter_by(drive_id=drive.drive_id).count()
            
            drives_list.append({
                'drive_id': drive.drive_id,
                'company_id': drive.company_id,
                'company_name': drive.company.company_name,
                'job_role_title': drive.job_role_title,
                'job_type': drive.job_type,
                'ctc_package': float(drive.ctc_package) if drive.ctc_package else 0,
                'eligible_programs': drive.eligible_programs,
                'eligible_branches': drive.eligible_branches,
                'eligible_batch_years': drive.eligible_batch_years,
                'minimum_cgpa': float(drive.minimum_cgpa) if drive.minimum_cgpa else 0,
                'drive_status': drive.drive_status,
                'application_count': app_count,
                'created_at': drive.created_at.isoformat() if drive.created_at else None
            })
        
        return jsonify({'job_drives': drives_list}), 200
        
    except Exception as e:
        print(f"Get job drives error: {str(e)}")
        return jsonify({'error': 'Failed to fetch job drives'}), 500

@admin_bp.route('/job-drives/<drive_id>', methods=['GET'])
@require_admin
def get_job_drive_detail(drive_id):
    """Get detailed info about a job drive"""
    try:
        drive = JobDrive.query.get(drive_id)
        if not drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        # Get applications for this drive
        applications = Application.query.filter_by(drive_id=drive_id).all()
        
        apps_list = []
        for app in applications:
            student = app.student
            apps_list.append({
                'application_id': app.application_id,
                'student_id': student.student_id,
                'full_name': student.full_name,
                'roll_number': student.roll_number,
                'program': student.program,
                'branch': student.branch,
                'cgpa': float(student.cgpa) if student.cgpa else 0,
                'status': app.status,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None
            })
        
        drive_data = {
            'drive_id': drive.drive_id,
            'company_id': drive.company_id,
            'company_name': drive.company.company_name,
            'job_role_title': drive.job_role_title,
            'job_description': drive.job_description,
            'job_type': drive.job_type,
            'work_mode': drive.work_mode,
            'job_locations': drive.job_locations,
            'ctc_package': float(drive.ctc_package) if drive.ctc_package else 0,
            'package_breakup': drive.package_breakup,
            'eligible_programs': drive.eligible_programs,
            'eligible_branches': drive.eligible_branches,
            'eligible_batch_years': drive.eligible_batch_years,
            'minimum_cgpa': float(drive.minimum_cgpa) if drive.minimum_cgpa else 0,
            'max_active_backlogs': drive.max_active_backlogs,
            'required_skills': drive.required_skills,
            'drive_status': drive.drive_status,
            'applications': apps_list
        }
        
        return jsonify(drive_data), 200
        
    except Exception as e:
        print(f"Get job drive detail error: {str(e)}")
        return jsonify({'error': 'Failed to fetch job drive details'}), 500

@admin_bp.route('/students', methods=['GET'])
@require_admin
def get_students():
    """Get all students with filtering"""
    try:
        program = request.args.get('program')
        branch = request.args.get('branch')
        batch_year = request.args.get('batch_year')
        placement_status = request.args.get('placement_status')
        
        query = StudentMaster.query
        if program:
            query = query.filter_by(program=program)
        if branch:
            query = query.filter_by(branch=branch)
        if batch_year:
            query = query.filter_by(batch_year=int(batch_year))
        if placement_status:
            query = query.filter_by(placement_status=placement_status)
        
        students = query.order_by(StudentMaster.full_name).all()
        
        students_list = []
        for student in students:
            students_list.append({
                'student_id': student.student_id,
                'full_name': student.full_name,
                'roll_number': student.roll_number,
                'program': student.program,
                'branch': student.branch,
                'batch_year': student.batch_year,
                'cgpa': float(student.cgpa) if student.cgpa else 0,
                'active_backlogs': student.active_backlogs,
                'placement_status': student.placement_status,
                'company_placed_id': student.company_placed_id,
                'package_offered': float(student.package_offered) if student.package_offered else None,
                'is_profile_verified': student.is_profile_verified
            })
        
        return jsonify({'students': students_list}), 200
        
    except Exception as e:
        print(f"Get students error: {str(e)}")
        return jsonify({'error': 'Failed to fetch students'}), 500

@admin_bp.route('/students/<student_id>', methods=['GET'])
@require_admin
def get_student_detail(student_id):
    """Get detailed info about a student"""
    try:
        student = StudentMaster.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get applications
        applications = Application.query.filter_by(student_id=student_id).all()
        
        apps_list = []
        for app in applications:
            drive = app.job_drive
            apps_list.append({
                'application_id': app.application_id,
                'drive_id': drive.drive_id,
                'company_name': drive.company.company_name,
                'job_role_title': drive.job_role_title,
                'status': app.status,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None
            })
        
        student_data = {
            'student_id': student.student_id,
            'full_name': student.full_name,
            'roll_number': student.roll_number,
            'email': student.user.email if student.user else None,
            'personal_email': student.personal_email,
            'contact_number': student.contact_number,
            'program': student.program,
            'branch': student.branch,
            'batch_year': student.batch_year,
            'current_semester': student.current_semester,
            'cgpa': float(student.cgpa) if student.cgpa else 0,
            'active_backlogs': student.active_backlogs,
            'total_backlogs': student.total_backlogs,
            'tenth_percentage': float(student.tenth_percentage) if student.tenth_percentage else None,
            'twelfth_percentage': float(student.twelfth_percentage) if student.twelfth_percentage else None,
            'placement_status': student.placement_status,
            'is_profile_verified': student.is_profile_verified,
            'applications': apps_list
        }
        
        return jsonify(student_data), 200
        
    except Exception as e:
        print(f"Get student detail error: {str(e)}")
        return jsonify({'error': 'Failed to fetch student details'}), 500

@admin_bp.route('/students/<student_id>/verify', methods=['POST'])
@require_admin
def verify_student(student_id):
    """Verify student profile"""
    try:
        identity = get_jwt_identity()
        admin = Admin.query.filter_by(user_id=identity['user_id']).first()
        if not admin:
            return jsonify({'error': 'Admin profile not found'}), 404
        
        student = StudentMaster.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        student.is_profile_verified = True
        student.verified_by_admin_id = admin.admin_id
        student.verification_date = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': f'{student.full_name} profile verified successfully',
            'student_id': student.student_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Verify student error: {str(e)}")
        return jsonify({'error': 'Failed to verify student'}), 500

@admin_bp.route('/statistics', methods=['GET'])
@require_admin
def get_statistics():
    """Get placement statistics"""
    try:
        total_students = StudentMaster.query.count()
        placed_students = StudentMaster.query.filter_by(placement_status='Placed').count()
        total_companies = Company.query.filter_by(status='Approved').count()
        total_drives = JobDrive.query.filter_by(drive_status='Published').count()
        total_applications = Application.query.count()
        
        stats = {
            'total_students': total_students,
            'placed_students': placed_students,
            'unplaced_students': total_students - placed_students,
            'placement_percentage': round((placed_students / total_students * 100), 2) if total_students > 0 else 0,
            'total_companies': total_companies,
            'total_drives': total_drives,
            'total_applications': total_applications
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Get statistics error: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500
