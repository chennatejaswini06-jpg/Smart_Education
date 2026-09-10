from flask import Blueprint, jsonify, request, g
from datetime import datetime
from backend.database.db import get_db_connection
from backend.utils.auth import login_required

revision_bp = Blueprint("revision", __name__, url_prefix="/api/revision")

@revision_bp.route("", methods=["GET"])
@login_required
def get_revision_queue():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Spaced repetition: Topics with low mastery or studied > 3 days ago
    rows = cursor.execute("""
        SELECT tm.mastery_score, tm.status, tm.last_studied_at,
               t.id as topic_id, t.name as topic_name, t.difficulty_level,
               s.name as subject_name, s.color as subject_color
        FROM topic_mastery tm
        JOIN topics t ON tm.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE tm.user_id = ?
        ORDER BY tm.mastery_score ASC
    """, (g.user_id,)).fetchall()

    overdue = []
    upcoming = []
    mastered = []

    for r in rows:
        score = r["mastery_score"]
        item = dict(r)
        # Mock retention decay calculation
        retention = round(score * 0.92, 1)
        item["estimated_retention"] = retention

        if score < 60.0:
            overdue.append(item)
        elif score < 80.0:
            upcoming.append(item)
        else:
            mastered.append(item)

    conn.close()

    return jsonify({
        "overdue": overdue[:4],
        "upcoming": upcoming[:4],
        "mastered": mastered[:4],
        "total_to_revise": len(overdue) + len(upcoming)
    })

@revision_bp.route("/complete", methods=["POST"])
@login_required
def complete_revision():
    data = request.get_json() or {}
    topic_id = data.get("topic_id")

    if not topic_id:
        return jsonify({"error": "Topic ID required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    # Boost mastery score slightly on successful revision
    cursor.execute("""
        UPDATE topic_mastery
        SET mastery_score = MIN(100.0, mastery_score + 5.0),
            last_studied_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND topic_id = ?
    """, (g.user_id, topic_id))

    # Also mark doubt alert resolved if any
    cursor.execute("""
        UPDATE doubt_alerts
        SET status = 'RESOLVED'
        WHERE user_id = ? AND topic_id = ?
    """, (g.user_id, topic_id))

    cursor.execute("UPDATE student_profiles SET xp_points = xp_points + 30 WHERE user_id = ?", (g.user_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Revision recorded successfully! Mastery improved by +5%."})
