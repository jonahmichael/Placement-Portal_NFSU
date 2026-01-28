"""
Database Seed Script (Matching Actual Schema)
Creates initial users for testing: 1 admin, 1 company, 1 student
"""

from app import create_app, db
from models import User, Admin, Company, StudentMaster
from flask_bcrypt import Bcrypt
import uuid
from datetime import datetime, date

bcrypt = Bcrypt()

def seed_database():
    """Seed the database with initial test users"""
    
    app = create_app()
    
    with app.app_context():
        print("\nStarting database seeding...")
        print("=" * 80)
        
        try:
            # Check if data already exists
            if User.query.count() > 0:
                print("\n⚠️  Database already has data. Skipping seed.")
                print(f"   Existing users: {User.query.count()}")
                return
            
            # Hash password (same for all test users)
            password_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
            
            # ============ CREATE ADMIN ============
            print("\n📌 Creating Admin User...")
            admin_user = User(
                email='admin@nfsu.ac.in',
                password_hash=password_hash,
                role='admin',
                is_active=True
            )
            db.session.add(admin_user)
            db.session.flush()  # Get the user_id
            
            admin_profile = Admin(
                user_id=admin_user.user_id,
                full_name='System Administrator',
                mobile_number='+91-9876543210',
                department='Placement Cell'
            )
            db.session.add(admin_profile)
            print(f"✅ Admin created: {admin_user.email}")
            
            # ============ CREATE COMPANY ============
            print("\n📌 Creating Company User...")
            company_user = User(
                email='hr@techcorp.com',
                password_hash=password_hash,
                role='company',
                is_active=True
            )
            db.session.add(company_user)
            db.session.flush()
            
            company_profile = Company(
                user_id=company_user.user_id,
                company_name='TechCorp Solutions Pvt Ltd',
                company_website='https://techcorp.example.com',
                company_type='Private Limited',
                industry_domain='Information Technology',
                company_description='Leading IT solutions provider',
                city='Gandhinagar',
                state='Gujarat',
                country='India',
                contact_person_name='John Smith',
                designation='HR Manager',
                official_email='hr@techcorp.com',
                phone_number='+91-7894561230',
                status='Approved',  # Pre-approved for testing
                is_verified_by_admin=True,
                approved_by_admin_id=admin_profile.admin_id,
                approval_date=datetime.utcnow(),
                terms_and_conditions_accepted=True
            )
            db.session.add(company_profile)
            print(f"✅ Company created: {company_profile.company_name}")
            
            # ============ CREATE STUDENT ============
            print("\n📌 Creating Student User...")
            student_user = User(
                email='student@nfsu.ac.in',
                password_hash=password_hash,
                role='student',
                is_active=True
            )
            db.session.add(student_user)
            db.session.flush()
            
            student_master = StudentMaster(
                user_id=student_user.user_id,
                roll_number='NFSU2024001',
                enrollment_number='EN2024001',
                full_name='Raj Kumar Sharma',
                gender='Male',
                date_of_birth=date(2003, 5, 15),
                nationality='Indian',
                category='General',
                mobile_number='+91-9988776655',
                email_college='raj.sharma@nfsu.ac.in',
                permanent_address='123, Main Street, Ahmedabad',
                current_address='NFSU Hostel, Gandhinagar',
                city='Gandhinagar',
                state='Gujarat',
                pincode='382007',
                university_name='NFSU',
                campus_name='Gandhinagar Campus',
                course='B.Tech',
                branch='Computer Science & Engineering',
                current_semester=6,
                year_of_admission=2021,
                year_of_passing=2025,
                cgpa=8.5,
                percentage_equivalent=85.0,
                backlogs_count=0,
                active_backlog=False,
                gap_in_education=False,
                tenth_board='CBSE',
                tenth_school_name='Delhi Public School',
                tenth_year_of_passing=2019,
                tenth_percentage=92.5,
                twelfth_board='CBSE',
                twelfth_school_name='Delhi Public School',
                twelfth_year_of_passing=2021,
                twelfth_percentage=89.0,
                medium_of_instruction='English',
                is_profile_verified=True,
                verified_by_admin_id=admin_profile.admin_id,
                verification_date=datetime.utcnow(),
                profile_completion_percentage=85.00,
                placement_status='Not Placed',
                eligible_for_placement_drives=True
            )
            db.session.add(student_master)
            print(f"✅ Student created: {student_master.full_name} ({student_master.roll_number})")
            
            # Commit all changes
            db.session.commit()
            
            print("\n" + "=" * 80)
            print("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!")
            print("=" * 80)
            print("\n📋 Test Credentials:")
            print(f"   Admin    : admin@nfsu.ac.in / password123")
            print(f"   Company  : hr@techcorp.com / password123")
            print(f"   Student  : student@nfsu.ac.in / password123")
            print("\n" + "=" * 80 + "\n")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error during seeding: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    seed_database()
