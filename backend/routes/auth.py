from flask import Blueprint, request, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import hash_password, verify_password, generate_token, login_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    college = data.get("college", "Engineering Institute")
    course = data.get("course", "Computer Science")
    year = data.get("year", "3rd Year")
    learning_goal = data.get("learning_goal", "Software Developer")

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    existing = cursor.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "An account with this email already exists"}), 409

    pwd_hash = hash_password(password)
    cursor.execute("""
        INSERT INTO users (name, email, password_hash, role, avatar)
        VALUES (?, ?, ?, 'student', ?)
    """, (name, email, pwd_hash, f"https://api.dicebear.com/7.x/avataaars/svg?seed={name.replace(' ', '')}"))
    user_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO student_profiles (user_id, college, course, year, learning_goal, academic_level, daily_study_hours, preferred_learning_style, xp_points, streak_days, level, last_active_date)
        VALUES (?, ?, ?, ?, ?, 'Intermediate', 2.5, 'Hands-on / Practical', 100, 1, 1, date('now'))
    """, (user_id, college, course, year, learning_goal))

    # Initialize default topic mastery
    topics = cursor.execute("SELECT id FROM topics").fetchall()
    for t in topics:
        cursor.execute("""
            INSERT INTO topic_mastery (user_id, topic_id, mastery_score, status)
            VALUES (?, ?, 50.0, 'Moderate')
        """, (user_id, t["id"]))

    conn.commit()
    conn.close()

    token = generate_token(user_id, email, "student")
    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": {"id": user_id, "name": name, "email": email, "role": "student"}
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if not user or not verify_password(password, user["password_hash"]):
        conn.close()
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user["id"], user["email"], user["role"])
    
    # Get profile details
    profile = cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (user["id"],)).fetchone()
    conn.close()

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "avatar": user["avatar"],
            "learning_goal": profile["learning_goal"] if profile else "Software Developer",
            "xp_points": profile["xp_points"] if profile else 0,
            "streak_days": profile["streak_days"] if profile else 1,
            "level": profile["level"] if profile else 1
        }
    })

@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute("SELECT id, name, email, role, avatar FROM users WHERE id = ?", (g.user_id,)).fetchone()
    profile = cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (g.user_id,)).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": dict(user),
        "profile": dict(profile) if profile else {}
    })
