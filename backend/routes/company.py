"""
Company Routes
Handles company profile, job drives, applicants
"""

from flask import Blueprint, request, jsonify
from models import db, Company, JobDrive, Application, StudentMaster
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

company_bp = Blueprint('company', __name__)

def require_company(f):
    """Decorator to require company role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'company':
            return jsonify({'error': 'Company access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@company_bp.route('/profile', methods=['GET'])
@require_company
def get_profile():
    """Get company profile"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        
        profile_data = {
            'company_id': company.company_id,
            'company_name': company.company_name,
            'official_email': company.official_email,
            'company_website': company.company_website,
            'industry_type': company.industry_type,
            'company_size': company.company_size,
            'company_description': company.company_description,
            'hr_name': company.hr_name,
            'hr_email': company.hr_email,
            'hr_contact_number': company.hr_contact_number,
            'office_address': company.office_address,
            'city': company.city,
            'state': company.state,
            'status': company.status,
            'is_verified_by_admin': company.is_verified_by_admin,
            'rejection_reason': company.rejection_reason
        }
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Get company profile error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@company_bp.route('/profile', methods=['PUT'])
@require_company
def update_profile():
    """Update company profile"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'company_description' in data:
            company.company_description = data['company_description']
        if 'hr_name' in data:
            company.hr_name = data['hr_name']
        if 'hr_email' in data:
            company.hr_email = data['hr_email']
        if 'hr_contact_number' in data:
            company.hr_contact_number = data['hr_contact_number']
        if 'office_address' in data:
            company.office_address = data['office_address']
        if 'city' in data:
            company.city = data['city']
        if 'state' in data:
            company.state = data['state']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Update company profile error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500

@company_bp.route('/job-drives', methods=['GET'])
@require_company
def get_drives():
    """Get all job drives for this company"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        
        drives = JobDrive.query.filter_by(company_id=company.company_id).order_by(JobDrive.created_at.desc()).all()
        
        drives_list = []
        for drive in drives:
            # Count applications
            app_count = Application.query.filter_by(drive_id=drive.drive_id).count()
            
            drives_list.append({
                'drive_id': drive.drive_id,
                'job_role_title': drive.job_role_title,
                'job_type': drive.job_type,
                'ctc_package': float(drive.ctc_package) if drive.ctc_package else 0,
                'drive_status': drive.drive_status,
                'application_count': app_count,
                'created_at': drive.created_at.isoformat() if drive.created_at else None
            })
        
        return jsonify({'job_drives': drives_list}), 200
        
    except Exception as e:
        print(f"Get company drives error: {str(e)}")
        return jsonify({'error': 'Failed to fetch job drives'}), 500

@company_bp.route('/job-drives/<drive_id>/applicants', methods=['GET'])
@require_company
def get_drive_applicants(drive_id):
    """Get all applicants for a specific drive"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        
        # Verify drive belongs to this company
        drive = JobDrive.query.get(drive_id)
        if not drive:
            return jsonify({'error': 'Job drive not found'}), 404
        if drive.company_id != company.company_id:
            return jsonify({'error': 'Unauthorized access to this drive'}), 403
        
        # Get applications
        status_filter = request.args.get('status')
        query = Application.query.filter_by(drive_id=drive_id)
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        applications = query.all()
        
        applicants_list = []
        for app in applications:
            student = app.student
            applicants_list.append({
                'application_id': app.application_id,
                'student_id': student.student_id,
                'full_name': student.full_name,
                'roll_number': student.roll_number,
                'email': student.user.email if student.user else None,
                'contact_number': student.contact_number,
                'program': student.program,
                'branch': student.branch,
                'batch_year': student.batch_year,
                'cgpa': float(student.cgpa) if student.cgpa else 0,
                'active_backlogs': student.active_backlogs,
                'tenth_percentage': float(student.tenth_percentage) if student.tenth_percentage else None,
                'twelfth_percentage': float(student.twelfth_percentage) if student.twelfth_percentage else None,
                'status': app.status,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
                'resume_submitted': app.resume_submitted
            })
        
        return jsonify({
            'drive_id': drive_id,
            'job_role_title': drive.job_role_title,
            'applicants': applicants_list
        }), 200
        
    except Exception as e:
        print(f"Get drive applicants error: {str(e)}")
        return jsonify({'error': 'Failed to fetch applicants'}), 500

@company_bp.route('/job-drives/<drive_id>/shortlist', methods=['POST'])
@require_company
def update_application_status(drive_id):
    """Update status of multiple applications (shortlist/select/reject)"""
    try:
        identity = get_jwt_identity()
        company = Company.query.filter_by(user_id=identity['user_id']).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        
        # Verify drive belongs to this company
        drive = JobDrive.query.get(drive_id)
        if not drive:
            return jsonify({'error': 'Job drive not found'}), 404
        if drive.company_id != company.company_id:
            return jsonify({'error': 'Unauthorized access to this drive'}), 403
        
        data = request.get_json()
        application_ids = data.get('application_ids', [])
        new_status = data.get('status')  # 'Shortlisted', 'Selected', 'Rejected'
        
        if not application_ids or not new_status:
            return jsonify({'error': 'application_ids and status required'}), 400
        
        updated_count = 0
        for app_id in application_ids:
            application = Application.query.get(app_id)
            if application and application.drive_id == drive_id:
                application.status = new_status
                updated_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': f'{updated_count} applications updated to {new_status}',
            'updated_count': updated_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Update application status error: {str(e)}")
        return jsonify({'error': 'Failed to update application status'}), 500
