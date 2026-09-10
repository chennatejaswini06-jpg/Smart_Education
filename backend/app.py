import os
import sys
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Import database initializer
from backend.database.db import init_db
from backend.database.seed import seed_database

# Import Blueprints
from backend.routes.auth import auth_bp
from backend.routes.dashboard import dashboard_bp
from backend.routes.subjects import subjects_bp
from backend.routes.quiz import quiz_bp
from backend.routes.study_plan import study_plan_bp
from backend.routes.analytics import analytics_bp
from backend.routes.skill_gap import skill_gap_bp
from backend.routes.revision import revision_bp
from backend.routes.ai_tutor import ai_tutor_bp
from backend.routes.profile import profile_bp
from backend.routes.admin import admin_bp

def create_app():
    dist_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
    app = Flask(__name__, static_folder=dist_folder if os.path.exists(dist_folder) else None, static_url_path="")
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "edusmart_sih_2026_flask_secret")
    app.config["JSON_SORT_KEYS"] = False

    # Enable CORS for all routes (allows React frontend on port 5173 / localhost)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(subjects_bp)
    app.register_blueprint(quiz_bp)
    app.register_blueprint(study_plan_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(skill_gap_bp)
    app.register_blueprint(revision_bp)
    app.register_blueprint(ai_tutor_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(admin_bp)

    @app.route("/api/health")
    def health():
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "service": "EduSmart AI",
            "groq_configured": bool(os.environ.get("GROQ_API_KEY")),
            "hackathon": "Smart India Hackathon 2026",
            "theme": "Student Innovation - Smart Education",
            "organization": "AICTE"
        })

    # Serve built React frontend on root or direct routes
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path.startswith("api/"):
            return jsonify({"error": "API route not found"}), 404
        if app.static_folder and os.path.exists(os.path.join(app.static_folder, path)) and path != "":
            return send_from_directory(app.static_folder, path)
        if app.static_folder and os.path.exists(os.path.join(app.static_folder, "index.html")):
            return send_from_directory(app.static_folder, "index.html")
        return jsonify({
            "service": "EduSmart AI - Smart Learning & Student Success Backend API",
            "version": "1.0.0",
            "status": "operational"
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error occurred", "details": str(e)}), 500

    return app

if __name__ == "__main__":
    # Ensure database is initialized
    db_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "edusmart.db")
    if not os.path.exists(db_file):
        print("Database not found. Initializing and seeding...")
        init_db()
        seed_database()
    
    port = int(os.environ.get("PORT", 5001))
    print(f"\n========================================================")
    print(f"[*] EduSmart AI running on http://127.0.0.1:{port}")
    print(f"[*] Smart India Hackathon 2026 Prototype (AICTE)")
    print(f"========================================================\n")
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=False)
