"""
Database Schema Inspector
Connects to Neon DB and shows existing tables, columns, and sample data
"""

from app import create_app, db
from sqlalchemy import inspect, text

def inspect_database():
    """Inspect existing database schema"""
    
    app = create_app()
    
    with app.app_context():
        print("\n" + "="*80)
        print("DATABASE SCHEMA INSPECTION")
        print("="*80 + "\n")
        
        # Get database inspector
        inspector = inspect(db.engine)
        
        # Get all schemas
        print("📁 SCHEMAS:")
        schemas = inspector.get_schema_names()
        for schema in schemas:
            if schema not in ['information_schema', 'pg_catalog', 'pg_toast']:
                print(f"   - {schema}")
        
        print("\n" + "-"*80 + "\n")
        
        # Inspect each relevant schema
        for schema in ['public', 'admin', 'student', 'company']:
            try:
                tables = inspector.get_table_names(schema=schema)
                if tables:
                    print(f"📊 SCHEMA: {schema.upper()}")
                    print("-" * 80)
                    
                    for table in tables:
                        print(f"\n  Table: {schema}.{table}")
                        columns = inspector.get_columns(table, schema=schema)
                        
                        print("  Columns:")
                        for col in columns:
                            nullable = "NULL" if col['nullable'] else "NOT NULL"
                            default = f", DEFAULT: {col['default']}" if col['default'] else ""
                            print(f"    - {col['name']}: {col['type']} ({nullable}){default}")
                        
                        # Get row count
                        try:
                            result = db.session.execute(
                                text(f'SELECT COUNT(*) FROM "{schema}"."{table}"')
                            )
                            count = result.scalar()
                            print(f"  Row count: {count}")
                        except Exception as e:
                            print(f"  Row count: Unable to fetch ({str(e)})")
                        
                        print()
                    
                    print("-" * 80 + "\n")
            except Exception as e:
                print(f"❌ Error inspecting schema {schema}: {str(e)}\n")
        
        # Try to fetch sample data from users table
        print("\n" + "="*80)
        print("SAMPLE DATA FROM public.users")
        print("="*80 + "\n")
        
        try:
            result = db.session.execute(text('SELECT * FROM public.users LIMIT 5'))
            rows = result.fetchall()
            
            if rows:
                # Get column names
                columns = result.keys()
                print(f"Columns: {', '.join(columns)}\n")
                
                for row in rows:
                    print(f"- {dict(zip(columns, row))}")
            else:
                print("No data found in users table")
                
        except Exception as e:
            print(f"❌ Error fetching user data: {str(e)}")
        
        print("\n" + "="*80 + "\n")

if __name__ == '__main__':
    inspect_database()
