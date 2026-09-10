from flask import Blueprint, request, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import login_required

profile_bp = Blueprint("profile", __name__, url_prefix="/api")

@profile_bp.route("/profile", methods=["GET", "PUT"])
@login_required
def profile_handler():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "PUT":
        data = request.get_json() or {}
        name = data.get("name")
        college = data.get("college")
        course = data.get("course")
        year = data.get("year")
        learning_goal = data.get("learning_goal")
        daily_study_hours = data.get("daily_study_hours")
        preferred_learning_style = data.get("preferred_learning_style")

        if name:
            cursor.execute("UPDATE users SET name = ? WHERE id = ?", (name, g.user_id))
        
        cursor.execute("""
            UPDATE student_profiles
            SET college = COALESCE(?, college),
                course = COALESCE(?, course),
                year = COALESCE(?, year),
                learning_goal = COALESCE(?, learning_goal),
                daily_study_hours = COALESCE(?, daily_study_hours),
                preferred_learning_style = COALESCE(?, preferred_learning_style)
            WHERE user_id = ?
        """, (college, course, year, learning_goal, daily_study_hours, preferred_learning_style, g.user_id))

        conn.commit()

    user = cursor.execute("SELECT id, name, email, role, avatar FROM users WHERE id = ?", (g.user_id,)).fetchone()
    profile = cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (g.user_id,)).fetchone()

    # User Badges
    user_badges = cursor.execute("""
        SELECT b.*, ub.earned_at
        FROM badges b
        JOIN user_badges ub ON b.id = ub.badge_id
        WHERE ub.user_id = ?
    """, (g.user_id,)).fetchall()

    all_badges = cursor.execute("SELECT * FROM badges").fetchall()

    conn.close()

    earned_badge_ids = {b["id"] for b in user_badges}
    badges_display = []
    for b in all_badges:
        b_dict = dict(b)
        b_dict["is_unlocked"] = b["id"] in earned_badge_ids
        badges_display.append(b_dict)

    return jsonify({
        "user": dict(user),
        "profile": dict(profile) if profile else {},
        "badges": badges_display
    })

@profile_bp.route("/onboarding", methods=["POST"])
@login_required
def onboarding_handler():
    data = request.get_json() or {}
    learning_goal = data.get("learning_goal", "Software Developer")
    academic_level = data.get("academic_level", "Intermediate")
    daily_hours = float(data.get("daily_study_hours", 2.5))
    learning_style = data.get("preferred_learning_style", "Hands-on / Practical")
    target_date = data.get("target_date", "2026-11-15")
    weak_subjects = data.get("weak_subjects", ["Data Structures & Algorithms"])
    strong_subjects = data.get("strong_subjects", ["Python", "Java Programming"])

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE student_profiles
        SET learning_goal = ?,
            academic_level = ?,
            daily_study_hours = ?,
            preferred_learning_style = ?,
            target_date = ?
        WHERE user_id = ?
    """, (learning_goal, academic_level, daily_hours, learning_style, target_date, g.user_id))

    # Adjust initial masteries according to onboarding self-assessment
    for sub_name in weak_subjects:
        cursor.execute("""
            UPDATE topic_mastery
            SET mastery_score = 45.0, status = 'Weak'
            WHERE user_id = ? AND topic_id IN (
                SELECT t.id FROM topics t JOIN subjects s ON t.subject_id = s.id WHERE s.name LIKE ?
            )
        """, (g.user_id, f"%{sub_name}%"))

    for sub_name in strong_subjects:
        cursor.execute("""
            UPDATE topic_mastery
            SET mastery_score = 85.0, status = 'Mastered'
            WHERE user_id = ? AND topic_id IN (
                SELECT t.id FROM topics t JOIN subjects s ON t.subject_id = s.id WHERE s.name LIKE ?
            )
        """, (g.user_id, f"%{sub_name}%"))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Onboarding completed successfully! Your personal learning path has been generated.",
        "redirect": "/dashboard"
    })
