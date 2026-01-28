"""
Student Routes
Handles viewing eligible drives, applying to drives, viewing application status
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Student, JobDrive, Application, Company
from datetime import datetime

student_bp = Blueprint('student', __name__)

def require_student(fn):
    """Decorator to ensure user is a student"""
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

# ==================== STUDENT PROFILE ====================

@student_bp.route('/profile', methods=['GET'])
@require_student
def get_student_profile():
    """Get current student's profile"""
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        return jsonify({
            'id': student.id,
            'enrollment_number': student.enrollment_number,
            'name': student.name,
            'email': student.user.email,
            'phone': student.phone,
            'branch': student.branch,
            'year': student.year,
            'semester': student.semester,
            'cgpa': student.cgpa,
            'tenth_percentage': student.tenth_percentage,
            'twelfth_percentage': student.twelfth_percentage,
            'active_backlogs': student.active_backlogs,
            'total_backlogs': student.total_backlogs,
            'is_placed': student.is_placed,
            'placed_company': student.placed_company,
            'placement_package': student.placement_package,
            'placement_category': student.placement_category,
            'can_apply': student.can_apply,
            'resume_url': student.resume_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/profile', methods=['PUT'])
@require_student
def update_student_profile():
    """
    Update student profile (limited fields)
    Expects: { "phone": "...", "alternate_email": "...", "resume_url": "..." }
    """
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'phone' in data:
            student.phone = data['phone']
        if 'alternate_email' in data:
            student.alternate_email = data['alternate_email']
        if 'resume_url' in data:
            student.resume_url = data['resume_url']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== ELIGIBLE DRIVES ====================

@student_bp.route('/drives', methods=['GET'])
@require_student
def get_eligible_drives():
    """
    Get all job drives eligible for this student
    Implements Student Eligibility Engine on the fly
    """
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Get all published drives
        all_drives = JobDrive.query.filter_by(status='published').all()
        
        eligible_drives = []
        for drive in all_drives:
            # Check eligibility criteria
            is_eligible = True
            reasons = []
            
            # Check if already applied
            already_applied = Application.query.filter_by(
                student_id=student.id,
                job_drive_id=drive.id
            ).first()
            
            # Year eligibility
            if student.year not in drive.eligible_years:
                is_eligible = False
                reasons.append(f"Year {student.year} not eligible")
            
            # Branch eligibility
            if student.branch not in drive.eligible_branches:
                is_eligible = False
                reasons.append(f"Branch {student.branch} not eligible")
            
            # CGPA check
            if student.cgpa < drive.min_cgpa:
                is_eligible = False
                reasons.append(f"CGPA {student.cgpa} below minimum {drive.min_cgpa}")
            
            # Backlogs check
            if student.active_backlogs > drive.max_active_backlogs:
                is_eligible = False
                reasons.append(f"Active backlogs {student.active_backlogs} exceeds limit {drive.max_active_backlogs}")
            
            # 10th percentage
            if drive.min_tenth_percentage and student.tenth_percentage < drive.min_tenth_percentage:
                is_eligible = False
                reasons.append(f"10th percentage below minimum")
            
            # 12th percentage
            if drive.min_twelfth_percentage and student.twelfth_percentage < drive.min_twelfth_percentage:
                is_eligible = False
                reasons.append(f"12th percentage below minimum")
            
            # Placement restrictions (dream company rule)
            if not student.can_apply:
                is_eligible = False
                reasons.append("Already placed (cannot apply further)")
            
            if student.is_placed:
                is_eligible = False
                reasons.append("Already placed")
            
            # Applications locked
            if drive.applications_locked:
                is_eligible = False
                reasons.append("Applications closed")
            
            # Application deadline
            if drive.application_end_date and datetime.utcnow() > drive.application_end_date:
                is_eligible = False
                reasons.append("Application deadline passed")
            
            eligible_drives.append({
                'id': drive.id,
                'drive_name': drive.drive_name,
                'company_name': drive.company.company_name,
                'job_role': drive.job_role,
                'job_description': drive.job_description,
                'package_lpa': drive.package_lpa,
                'package_category': drive.package_category,
                'min_cgpa': drive.min_cgpa,
                'max_active_backlogs': drive.max_active_backlogs,
                'eligible_branches': drive.eligible_branches,
                'eligible_years': drive.eligible_years,
                'drive_date': drive.drive_date.isoformat() if drive.drive_date else None,
                'application_end_date': drive.application_end_date.isoformat() if drive.application_end_date else None,
                'is_eligible': is_eligible,
                'already_applied': already_applied is not None,
                'ineligibility_reasons': reasons if not is_eligible else []
            })
        
        return jsonify({
            'drives': eligible_drives,
            'total_drives': len(eligible_drives),
            'eligible_count': sum(1 for d in eligible_drives if d['is_eligible'] and not d['already_applied'])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== APPLICATIONS ====================

@student_bp.route('/apply', methods=['POST'])
@require_student
def apply_to_drive():
    """
    Apply to a job drive
    Expects: { "job_drive_id": 1, "resume_url": "..." }
    """
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        data = request.get_json()
        job_drive_id = data.get('job_drive_id')
        resume_url = data.get('resume_url', student.resume_url)
        
        # Get job drive
        job_drive = JobDrive.query.get(job_drive_id)
        if not job_drive or job_drive.status != 'published':
            return jsonify({'error': 'Job drive not available'}), 404
        
        # Check if already applied
        existing_application = Application.query.filter_by(
            student_id=student.id,
            job_drive_id=job_drive_id
        ).first()
        
        if existing_application:
            return jsonify({'error': 'Already applied to this drive'}), 400
        
        # Check if applications are locked
        if job_drive.applications_locked:
            return jsonify({'error': 'Applications are closed for this drive'}), 400
        
        # Check eligibility (simplified - full check should be on frontend)
        if student.year not in job_drive.eligible_years:
            return jsonify({'error': 'You are not eligible for this drive (year)'}), 400
        
        if student.branch not in job_drive.eligible_branches:
            return jsonify({'error': 'You are not eligible for this drive (branch)'}), 400
        
        if student.cgpa < job_drive.min_cgpa:
            return jsonify({'error': f'CGPA requirement not met (minimum {job_drive.min_cgpa})'}), 400
        
        if student.active_backlogs > job_drive.max_active_backlogs:
            return jsonify({'error': 'Active backlogs exceed limit'}), 400
        
        if not student.can_apply:
            return jsonify({'error': 'You cannot apply (placement restrictions)'}), 400
        
        if student.is_placed:
            return jsonify({'error': 'Already placed students cannot apply'}), 400
        
        # Create application
        application = Application(
            student_id=student.id,
            job_drive_id=job_drive_id,
            resume_url=resume_url,
            status='applied'
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications', methods=['GET'])
@require_student
def get_my_applications():
    """Get all applications submitted by this student"""
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        applications = Application.query.filter_by(student_id=student.id).all()
        
        result = [{
            'application_id': app.id,
            'job_drive_id': app.job_drive.id,
            'drive_name': app.job_drive.drive_name,
            'company_name': app.job_drive.company.company_name,
            'job_role': app.job_drive.job_role,
            'package_lpa': app.job_drive.package_lpa,
            'status': app.status,
            'applied_at': app.applied_at.isoformat(),
            'drive_date': app.job_drive.drive_date.isoformat() if app.job_drive.drive_date else None
        } for app in applications]
        
        return jsonify({
            'applications': result,
            'count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications/<int:application_id>', methods=['GET'])
@require_student
def get_application_details(application_id):
    """Get detailed information about a specific application"""
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        application = Application.query.filter_by(
            id=application_id,
            student_id=student.id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        return jsonify({
            'application_id': application.id,
            'job_drive': {
                'id': application.job_drive.id,
                'drive_name': application.job_drive.drive_name,
                'company_name': application.job_drive.company.company_name,
                'job_role': application.job_drive.job_role,
                'job_description': application.job_drive.job_description,
                'package_lpa': application.job_drive.package_lpa,
                'drive_date': application.job_drive.drive_date.isoformat() if application.job_drive.drive_date else None
            },
            'status': application.status,
            'final_package_offered': application.final_package_offered,
            'applied_at': application.applied_at.isoformat(),
            'resume_url': application.resume_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications/<int:application_id>/accept-offer', methods=['PUT'])
@require_student
def accept_offer(application_id):
    """Accept a job offer from a company"""
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        application = Application.query.filter_by(
            id=application_id,
            student_id=student.id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        if application.status != 'selected':
            return jsonify({'error': 'No offer to accept (not selected)'}), 400
        
        # Update application status
        application.status = 'offer_accepted'
        
        # Update student placement status (admin should finalize this)
        # For now, just mark as placed
        student.is_placed = True
        student.placed_company = application.job_drive.company.company_name
        student.placement_package = application.final_package_offered or application.job_drive.package_lpa
        student.placement_category = application.job_drive.package_category
        student.placement_date = datetime.utcnow().date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Offer accepted successfully',
            'placed_company': student.placed_company,
            'package': student.placement_package
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications/<int:application_id>/reject-offer', methods=['PUT'])
@require_student
def reject_offer(application_id):
    """Reject a job offer from a company"""
    try:
        identity = get_jwt_identity()
        student = Student.query.filter_by(user_id=identity['user_id']).first()
        
        application = Application.query.filter_by(
            id=application_id,
            student_id=student.id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        if application.status != 'selected':
            return jsonify({'error': 'No offer to reject (not selected)'}), 400
        
        application.status = 'offer_rejected'
        db.session.commit()
        
        return jsonify({'message': 'Offer rejected'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
