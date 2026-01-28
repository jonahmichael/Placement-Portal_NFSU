"""
Main Flask Application Entry Point
College Placement Management System - NFSU
"""

from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config

# Import db from models to avoid circular imports
from models import db

# Initialize extensions
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Enable CORS for React frontend
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.company import company_bp
    from routes.student import student_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(company_bp, url_prefix='/api/company')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    
    # NOTE: Database tables already exist in Neon - DO NOT create tables
    # with app.app_context():
    #     db.create_all()
    
    @app.route('/')
    def home():
        return {'message': 'College Placement Management System API - NFSU', 'status': 'running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
