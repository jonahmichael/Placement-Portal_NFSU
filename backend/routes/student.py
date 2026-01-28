"""
Student Routes
Handles student profile, eligible drives, applications
"""

from flask import Blueprint, request, jsonify
from models import db, StudentMaster, StudentProfileEditable, JobDrive, Application
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime

student_bp = Blueprint('student', __name__)

def require_student(f):
    """Decorator to require student role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        identity = get_jwt_identity()
        if identity.get('role') != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@student_bp.route('/profile/master', methods=['GET'])
@require_student
def get_master_profile():
    """Get master profile (read-only)"""
    try:
        identity = get_jwt_identity()
        student = StudentMaster.query.filter_by(user_id=identity['user_id']).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        profile_data = {
            'student_id': student.student_id,
            'full_name': student.full_name,
            'roll_number': student.roll_number,
            'email': student.user.email if student.user else None,
            'personal_email': student.personal_email,
            'contact_number': student.contact_number,
            'date_of_birth': student.date_of_birth.isoformat() if student.date_of_birth else None,
            'gender': student.gender,
            'category': student.category,
            'permanent_address': student.permanent_address,
            'current_address': student.current_address,
            'program': student.program,
            'branch': student.branch,
            'batch_year': student.batch_year,
            'current_semester': student.current_semester,
            'cgpa': float(student.cgpa) if student.cgpa else 0,
            'active_backlogs': student.active_backlogs,
            'total_backlogs': student.total_backlogs,
            'tenth_board': student.tenth_board,
            'tenth_percentage': float(student.tenth_percentage) if student.tenth_percentage else None,
            'tenth_year': student.tenth_year,
            'twelfth_board': student.twelfth_board,
            'twelfth_percentage': float(student.twelfth_percentage) if student.twelfth_percentage else None,
            'twelfth_year': student.twelfth_year,
            'twelfth_stream': student.twelfth_stream,
            'is_profile_verified': student.is_profile_verified,
            'placement_status': student.placement_status,
            'is_eligible_for_placement': student.is_eligible_for_placement
        }
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Get master profile error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@student_bp.route('/profile/editable', methods=['GET'])
@require_student
def get_editable_profile():
    """Get editable profile"""
    try:
        identity = get_jwt_identity()
        student_master = StudentMaster.query.filter_by(user_id=identity['user_id']).first()
        if not student_master:
            return jsonify({'error': 'Student profile not found'}), 404
        
        editable = StudentProfileEditable.query.filter_by(student_id=student_master.student_id).first()
        if not editable:
            # Create new editable profile if not exists
            editable = StudentProfileEditable(
                student_id=student_master.student_id,
                user_id=identity['user_id']
            )
            db.session.add(editable)
            db.session.commit()
        
        profile_data = {
            'profile_id': editable.profile_id,
            'primary_skills': editable.primary_skills or [],
            'secondary_skills': editable.secondary_skills or [],
            'programming_languages': editable.programming_languages or [],
            'tools_technologies': editable.tools_technologies or [],
            'soft_skills': editable.soft_skills or [],
            'languages_known': editable.languages_known or [],
            'projects': editable.projects or [],
            'internships': editable.internships or [],
            'certifications': editable.certifications or [],
            'achievements': editable.achievements or [],
            'extra_curricular': editable.extra_curricular or [],
            'resume_file_path': editable.resume_file_path,
            'profile_photo_path': editable.profile_photo_path,
            'career_objective': editable.career_objective,
            'linkedin_url': editable.linkedin_url,
            'github_url': editable.github_url,
            'portfolio_url': editable.portfolio_url,
            'preferred_job_locations': editable.preferred_job_locations or [],
            'preferred_job_roles': editable.preferred_job_roles or [],
            'expected_salary_lpa': float(editable.expected_salary_lpa) if editable.expected_salary_lpa else None,
            'last_updated_at': editable.last_updated_at.isoformat() if editable.last_updated_at else None
        }
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Get editable profile error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@student_bp.route('/profile/editable', methods=['PUT'])
@require_student
def update_editable_profile():
    """Update editable profile"""
    try:
        identity = get_jwt_identity()
        student_master = StudentMaster.query.filter_by(user_id=identity['user_id']).first()
        if not student_master:
            return jsonify({'error': 'Student profile not found'}), 404
        
        editable = StudentProfileEditable.query.filter_by(student_id=student_master.student_id).first()
        if not editable:
            editable = StudentProfileEditable(
                student_id=student_master.student_id,
                user_id=identity['user_id']
            )
            db.session.add(editable)
        
        data = request.get_json()
        
        # Update skills arrays
        if 'primary_skills' in data:
            editable.primary_skills = data['primary_skills']
        if 'secondary_skills' in data:
            editable.secondary_skills = data['secondary_skills']
        if 'programming_languages' in data:
            editable.programming_languages = data['programming_languages']
        if 'tools_technologies' in data:
            editable.tools_technologies = data['tools_technologies']
        if 'soft_skills' in data:
            editable.soft_skills = data['soft_skills']
        if 'languages_known' in data:
            editable.languages_known = data['languages_known']
        
        # Update JSONB fields
        if 'projects' in data:
            editable.projects = data['projects']
        if 'internships' in data:
            editable.internships = data['internships']
        if 'certifications' in data:
            editable.certifications = data['certifications']
        if 'achievements' in data:
            editable.achievements = data['achievements']
        if 'extra_curricular' in data:
            editable.extra_curricular = data['extra_curricular']
        
        # Update text fields
        if 'career_objective' in data:
            editable.career_objective = data['career_objective']
        if 'linkedin_url' in data:
            editable.linkedin_url = data['linkedin_url']
        if 'github_url' in data:
            editable.github_url = data['github_url']
        if 'portfolio_url' in data:
            editable.portfolio_url = data['portfolio_url']
        
        # Update preferences
        if 'preferred_job_locations' in data:
            editable.preferred_job_locations = data['preferred_job_locations']
        if 'preferred_job_roles' in data:
            editable.preferred_job_roles = data['preferred_job_roles']
        if 'expected_salary_lpa' in data:
            editable.expected_salary_lpa = data['expected_salary_lpa']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Update editable profile error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500

@student_bp.route('/eligible-drives', methods=['GET'])
@require_student
def get_eligible_drives():
    """Get all eligible job drives with eligibility check"""
    try:
        identity = get_jwt_identity()
        student = StudentMaster.query.filter_by(user_id=identity['user_id']).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Get all published drives
        drives = JobDrive.query.filter_by(drive_status='Published').all()
        
        # Get student's existing applications
        student_applications = {app.drive_id: app.status for app in 
                               Application.query.filter_by(student_id=student.student_id).all()}
        
        drives_list = []
        for drive in drives:
            # Check eligibility
            is_eligible = True
            reasons = []
            
            # Check program
            if drive.eligible_programs and student.program not in drive.eligible_programs:
                is_eligible = False
                reasons.append(f"Program not eligible (Required: {', '.join(drive.eligible_programs)})")
            
            # Check branch
            if drive.eligible_branches and student.branch not in drive.eligible_branches:
                is_eligible = False
                reasons.append(f"Branch not eligible (Required: {', '.join(drive.eligible_branches)})")
            
            # Check batch year
            if drive.eligible_batch_years and student.batch_year not in drive.eligible_batch_years:
                is_eligible = False
                reasons.append(f"Batch year not eligible (Required: {', '.join(map(str, drive.eligible_batch_years))})")
            
            # Check CGPA
            if drive.minimum_cgpa and (student.cgpa or 0) < drive.minimum_cgpa:
                is_eligible = False
                reasons.append(f"CGPA too low (Required: {drive.minimum_cgpa}, Yours: {student.cgpa})")
            
            # Check backlogs
            if drive.max_active_backlogs is not None and student.active_backlogs > drive.max_active_backlogs:
                is_eligible = False
                reasons.append(f"Too many active backlogs (Max allowed: {drive.max_active_backlogs}, Yours: {student.active_backlogs})")
            
            # Check 10th percentage
            if drive.minimum_tenth_percentage and (student.tenth_percentage or 0) < drive.minimum_tenth_percentage:
                is_eligible = False
                reasons.append(f"10th percentage too low (Required: {drive.minimum_tenth_percentage}, Yours: {student.tenth_percentage})")
            
            # Check 12th percentage
            if drive.minimum_twelfth_percentage and (student.twelfth_percentage or 0) < drive.minimum_twelfth_percentage:
                is_eligible = False
                reasons.append(f"12th percentage too low (Required: {drive.minimum_twelfth_percentage}, Yours: {student.twelfth_percentage})")
            
            # Check gender preference
            if drive.gender_preference and drive.gender_preference != 'Any' and student.gender != drive.gender_preference:
                is_eligible = False
                reasons.append(f"Gender preference not matched (Required: {drive.gender_preference})")
            
            # Check if already applied
            already_applied = drive.drive_id in student_applications
            application_status = student_applications.get(drive.drive_id)
            
            drives_list.append({
                'drive_id': drive.drive_id,
                'company_id': drive.company_id,
                'company_name': drive.company.company_name,
                'job_role_title': drive.job_role_title,
                'job_description': drive.job_description,
                'job_type': drive.job_type,
                'work_mode': drive.work_mode,
                'job_locations': drive.job_locations,
                'ctc_package': float(drive.ctc_package) if drive.ctc_package else 0,
                'eligible_programs': drive.eligible_programs,
                'eligible_branches': drive.eligible_branches,
                'minimum_cgpa': float(drive.minimum_cgpa) if drive.minimum_cgpa else 0,
                'max_active_backlogs': drive.max_active_backlogs,
                'is_eligible': is_eligible and not already_applied,
                'ineligibility_reasons': reasons if not is_eligible else [],
                'already_applied': already_applied,
                'application_status': application_status,
                'created_at': drive.created_at.isoformat() if drive.created_at else None
            })
        
        return jsonify({'drives': drives_list}), 200
        
    except Exception as e:
        print(f"Get eligible drives error: {str(e)}")
        return jsonify({'error': 'Failed to fetch eligible drives'}), 500

@student_bp.route('/apply', methods=['POST'])
@require_student
def apply_to_drive():
    """Apply to a job drive"""
    try:
        identity = get_jwt_identity()
        student = StudentMaster.query.filter_by(user_id=identity['user_id']).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        data = request.get_json()
        drive_id = data.get('drive_id')
        
        if not drive_id:
            return jsonify({'error': 'drive_id required'}), 400
        
        # Check if drive exists
        drive = JobDrive.query.get(drive_id)
        if not drive:
            return jsonify({'error': 'Job drive not found'}), 404
        
        if drive.drive_status != 'Published':
            return jsonify({'error': 'This job drive is no longer accepting applications'}), 400
        
        # Check if already applied
        existing = Application.query.filter_by(student_id=student.student_id, drive_id=drive_id).first()
        if existing:
            return jsonify({'error': 'Already applied to this drive'}), 400
        
        # Create application
        application = Application(
            student_id=student.student_id,
            drive_id=drive_id,
            resume_submitted=data.get('resume_submitted'),
            cover_letter=data.get('cover_letter'),
            status='Applied'
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application.application_id,
            'drive_id': drive_id,
            'company_name': drive.company.company_name
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Apply to drive error: {str(e)}")
        return jsonify({'error': 'Failed to submit application'}), 500

@student_bp.route('/applications', methods=['GET'])
@require_student
def get_my_applications():
    """Get all applications for this student"""
    try:
        identity = get_jwt_identity()
        student = StudentMaster.query.filter_by(user_id=identity['user_id']).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        applications = Application.query.filter_by(student_id=student.student_id).order_by(Application.applied_at.desc()).all()
        
        apps_list = []
        for app in applications:
            drive = app.job_drive
            apps_list.append({
                'application_id': app.application_id,
                'drive_id': drive.drive_id,
                'company_name': drive.company.company_name,
                'job_role_title': drive.job_role_title,
                'job_type': drive.job_type,
                'ctc_package': float(drive.ctc_package) if drive.ctc_package else 0,
                'status': app.status,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
                'updated_at': app.updated_at.isoformat() if app.updated_at else None
            })
        
        return jsonify({'applications': apps_list}), 200
        
    except Exception as e:
        print(f"Get my applications error: {str(e)}")
        return jsonify({'error': 'Failed to fetch applications'}), 500
