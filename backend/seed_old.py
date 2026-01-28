"""
Database Seed Script
Creates initial users for testing: 1 admin, 1 company, 1 student
"""

from app import create_app, db
from models import User, Admin, Company, StudentMaster
from flask_bcrypt import Bcrypt
import uuid

bcrypt = Bcrypt()

def seed_database():
    """Seed the database with initial test users"""
    
    app = create_app()
    
    with app.app_context():
        print("Starting database seeding...")
        
        # Create tables if they don't exist
        db.create_all()
        print("✓ Tables created/verified")
        
        # Password for all test users: "password123"
        password_hash = bcrypt.generate_password_hash("password123").decode('utf-8')
        
        # 1. Create Admin User
        admin_user_id = str(uuid.uuid4())
        admin_user = User(
            user_id=admin_user_id,
            email="admin@nfsu.ac.in",
            password_hash=password_hash,
            role="admin",
            is_active=True
        )
        db.session.add(admin_user)
        
        admin_profile = Admin(
            user_id=admin_user_id,
            full_name="Dr. Rajesh Kumar",
            department="Placement Cell",
            designation="Placement Officer",
            contact_number="+91-9876543210"
        )
        db.session.add(admin_profile)
        print(f"✓ Admin user created: admin@nfsu.ac.in (password: password123)")
        
        # 2. Create Company User
        company_user_id = str(uuid.uuid4())
        company_user = User(
            user_id=company_user_id,
            email="hr@techcorp.com",
            password_hash=password_hash,
            role="company",
            is_active=True
        )
        db.session.add(company_user)
        
        company_profile = Company(
            user_id=company_user_id,
            company_name="TechCorp Solutions",
            official_email="contact@techcorp.com",
            company_website="https://techcorp.com",
            industry_type="Information Technology",
            company_size="201-500",
            company_description="Leading software development company specializing in cloud solutions",
            hr_name="Priya Sharma",
            hr_email="hr@techcorp.com",
            hr_contact_number="+91-9876543211",
            hr_designation="Senior HR Manager",
            office_address="Tech Park, Whitefield",
            city="Bangalore",
            state="Karnataka",
            country="India",
            pincode="560066",
            status="Approved",  # Pre-approved for testing
            is_verified_by_admin=True
        )
        db.session.add(company_profile)
        print(f"✓ Company user created: hr@techcorp.com (password: password123)")
        
        # 3. Create Student User
        student_user_id = str(uuid.uuid4())
        student_user = User(
            user_id=student_user_id,
            email="john.doe@nfsu.ac.in",
            password_hash=password_hash,
            role="student",
            is_active=True
        )
        db.session.add(student_user)
        
        from datetime import date
        student_master = StudentMaster(
            user_id=student_user_id,
            full_name="John Doe",
            roll_number="NFSU2024CSE001",
            date_of_birth=date(2002, 5, 15),
            gender="Male",
            category="General",
            personal_email="john.personal@gmail.com",
            contact_number="+91-9876543212",
            permanent_address="123, MG Road, Gandhi Nagar, Ahmedabad, Gujarat - 380001",
            current_address="Room 204, Boys Hostel, NFSU Campus, Gandhinagar",
            program="B.Tech",
            branch="Computer Science & Engineering",
            batch_year=2024,
            current_semester=6,
            cgpa=8.5,
            tenth_board="CBSE",
            tenth_percentage=92.5,
            tenth_year=2018,
            twelfth_board="CBSE",
            twelfth_percentage=88.0,
            twelfth_year=2020,
            twelfth_stream="Science",
            active_backlogs=0,
            total_backlogs=0,
            is_profile_verified=True,
            placement_status="Unplaced",
            is_eligible_for_placement=True
        )
        db.session.add(student_master)
        print(f"✓ Student user created: john.doe@nfsu.ac.in (password: password123)")
        
        # Commit all changes
        try:
            db.session.commit()
            print("\n✅ Database seeding completed successfully!")
            print("\n📋 Test Credentials:")
            print("-" * 50)
            print("Admin:")
            print("  Email: admin@nfsu.ac.in")
            print("  Password: password123")
            print("\nCompany:")
            print("  Email: hr@techcorp.com")
            print("  Password: password123")
            print("\nStudent:")
            print("  Email: john.doe@nfsu.ac.in")
            print("  Password: password123")
            print("-" * 50)
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error during seeding: {str(e)}")
            raise

if __name__ == "__main__":
    seed_database()
