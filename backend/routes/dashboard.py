from flask import Blueprint, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

@dashboard_bp.route("", methods=["GET"])
@login_required
def get_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()

    # User & Profile
    user = cursor.execute("SELECT id, name, email, role, avatar FROM users WHERE id = ?", (g.user_id,)).fetchone()
    profile = cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (g.user_id,)).fetchone()

    # Key Statistics
    # 1. Overall Progress & Average Mastery
    masteries = cursor.execute("""
        SELECT AVG(mastery_score) as avg_mastery,
               COUNT(*) as total_topics,
               SUM(CASE WHEN status = 'Mastered' THEN 1 ELSE 0 END) as mastered_count,
               SUM(CASE WHEN status = 'Weak' THEN 1 ELSE 0 END) as weak_count
        FROM topic_mastery
        WHERE user_id = ?
    """, (g.user_id,)).fetchone()

    avg_mastery = round(masteries["avg_mastery"] or 72.5, 1)
    topics_completed = masteries["mastered_count"] or 0
    total_topics = masteries["total_topics"] or 19

    # 2. Average Quiz Score
    quiz_stats = cursor.execute("""
        SELECT AVG(score_percentage) as avg_score, COUNT(*) as total_quizzes
        FROM quiz_attempts
        WHERE user_id = ?
    """, (g.user_id,)).fetchone()
    avg_quiz_score = round(quiz_stats["avg_score"] or 78.0, 1)

    # 3. Total Study Hours
    progress_stats = cursor.execute("""
        SELECT SUM(study_minutes) as total_minutes
        FROM learning_progress
        WHERE user_id = ?
    """, (g.user_id,)).fetchone()
    study_hours = round((progress_stats["total_minutes"] or 2070) / 60.0, 1)

    # 4. Today's Learning Plan Tasks
    tasks = cursor.execute("""
        SELECT id, day_of_week, title, subject_name, topic_name, duration_minutes, is_completed
        FROM study_tasks
        WHERE user_id = ?
        ORDER BY is_completed ASC, order_index ASC
        LIMIT 5
    """, (g.user_id,)).fetchall()

    # 5. Active Doubt Alerts (e.g. Recursion alert)
    doubt_alerts = cursor.execute("""
        SELECT da.*, t.name as topic_name, s.name as subject_name
        FROM doubt_alerts da
        JOIN topics t ON da.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE da.user_id = ? AND da.status = 'ACTIVE'
        ORDER BY da.detected_at DESC
    """, (g.user_id,)).fetchall()

    # 6. Priority Recommendations
    recommendations = cursor.execute("""
        SELECT * FROM recommendations
        WHERE user_id = ?
        ORDER BY CASE priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, created_at DESC
        LIMIT 4
    """, (g.user_id,)).fetchall()

    # 7. Subject Mastery Overview
    subject_mastery = cursor.execute("""
        SELECT s.id, s.name, s.code, s.color, s.icon,
               ROUND(AVG(tm.mastery_score), 1) as avg_score
        FROM subjects s
        JOIN topics t ON s.id = t.subject_id
        JOIN topic_mastery tm ON t.id = tm.topic_id AND tm.user_id = ?
        GROUP BY s.id
        ORDER BY avg_score DESC
    """, (g.user_id,)).fetchall()

    conn.close()

    return jsonify({
        "student": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "avatar": user["avatar"],
            "college": profile["college"] if profile else "",
            "course": profile["course"] if profile else "",
            "year": profile["year"] if profile else "",
            "learning_goal": profile["learning_goal"] if profile else "Software Developer",
            "academic_level": profile["academic_level"] if profile else "Intermediate",
            "xp_points": profile["xp_points"] if profile else 1450,
            "streak_days": profile["streak_days"] if profile else 7,
            "level": profile["level"] if profile else 4,
            "daily_study_hours": profile["daily_study_hours"] if profile else 3.0
        },
        "stats": {
            "overall_progress_pct": avg_mastery,
            "streak_days": profile["streak_days"] if profile else 7,
            "topics_completed": topics_completed,
            "total_topics": total_topics,
            "avg_quiz_score": avg_quiz_score,
            "study_hours": study_hours,
            "current_level_title": f"Level {profile['level'] if profile else 4} - Code Crafter"
        },
        "today_plan": [dict(t) for t in tasks],
        "doubt_alerts": [dict(d) for d in doubt_alerts],
        "recommendations": [dict(r) for r in recommendations],
        "subject_mastery": [dict(sm) for sm in subject_mastery]
    })

@dashboard_bp.route("/notifications", methods=["GET"])
@login_required
def get_notifications():
    notifications = [
        {"id": 1, "title": "Practice Due", "message": "Your DSA practice in Recursion is due today.", "type": "warning", "time": "10 mins ago", "link": "/quiz?topic=10"},
        {"id": 2, "title": "Revision Alert", "message": "You haven't revised SQL Joins in 5 days.", "type": "info", "time": "2 hours ago", "link": "/revision"},
        {"id": 3, "title": "Weekly Goal Met!", "message": "Great job! You completed 100% of your weekly targets.", "type": "success", "time": "1 day ago", "link": "/study-planner"},
        {"id": 4, "title": "Performance Boost", "message": "You improved your Java OOP score by 15%. Keep going!", "type": "success", "time": "2 days ago", "link": "/analytics"}
    ]
    return jsonify(notifications)
