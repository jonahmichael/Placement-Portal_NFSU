-- DROP AND RECREATE SCHEMA SCRIPT
-- WARNING: This will delete ALL existing data
-- Run this script in your Neon DB SQL editor

-- Drop existing tables (in correct dependency order)
DROP TABLE IF EXISTS admin.placements CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS company.job_drives CASCADE;
DROP TABLE IF EXISTS student.student_profiles_editable CASCADE;
DROP TABLE IF EXISTS admin.students_master CASCADE;
DROP TABLE IF EXISTS company.companies CASCADE;
DROP TABLE IF EXISTS admin.admins CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop schemas if needed (optional - be careful!)
-- DROP SCHEMA IF EXISTS admin CASCADE;
-- DROP SCHEMA IF EXISTS student CASCADE;
-- DROP SCHEMA IF EXISTS company CASCADE;

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS student;
CREATE SCHEMA IF NOT EXISTS company;

-- Now run: python app.py (to create tables with new schema)
-- Then run: python seed.py (to populate with test data)

-- Verify tables were created
SELECT 
    schemaname, 
    tablename 
FROM pg_tables 
WHERE schemaname IN ('public', 'admin', 'student', 'company')
ORDER BY schemaname, tablename;
