from flask import Blueprint, jsonify, request
from backend.database.db import get_db_connection
from backend.utils.auth import login_required

subjects_bp = Blueprint("subjects", __name__, url_prefix="/api")

@subjects_bp.route("/subjects", methods=["GET"])
def get_subjects():
    conn = get_db_connection()
    subjects = conn.execute("""
        SELECT s.*, COUNT(t.id) as total_topics
        FROM subjects s
        LEFT JOIN topics t ON s.id = t.subject_id
        GROUP BY s.id
        ORDER BY s.id ASC
    """).fetchall()
    conn.close()
    return jsonify([dict(s) for s in subjects])

@subjects_bp.route("/topics", methods=["GET"])
def get_topics():
    subject_id = request.args.get("subject_id")
    conn = get_db_connection()
    if subject_id:
        topics = conn.execute("""
            SELECT t.*, s.name as subject_name, s.color as subject_color
            FROM topics t
            JOIN subjects s ON t.subject_id = s.id
            WHERE t.subject_id = ?
            ORDER BY t.order_index ASC
        """, (subject_id,)).fetchall()
    else:
        topics = conn.execute("""
            SELECT t.*, s.name as subject_name, s.color as subject_color
            FROM topics t
            JOIN subjects s ON t.subject_id = s.id
            ORDER BY t.subject_id ASC, t.order_index ASC
        """).fetchall()
    conn.close()
    return jsonify([dict(t) for t in topics])

@subjects_bp.route("/topics/<int:topic_id>/material", methods=["GET"])
def get_topic_material(topic_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    topic = cursor.execute("""
        SELECT t.*, s.name as subject_name, s.color as subject_color
        FROM topics t
        JOIN subjects s ON t.subject_id = s.id
        WHERE t.id = ?
    """, (topic_id,)).fetchone()
    
    if not topic:
        conn.close()
        return jsonify({"error": "Topic not found"}), 404

    material = cursor.execute("SELECT * FROM topic_material WHERE topic_id = ?", (topic_id,)).fetchone()
    
    # Related questions for mini quiz
    mini_questions = cursor.execute("""
        SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty
        FROM questions
        WHERE topic_id = ?
        LIMIT 3
    """, (topic_id,)).fetchall()
    
    conn.close()

    return jsonify({
        "topic": dict(topic),
        "material": dict(material) if material else None,
        "mini_questions": [dict(q) for q in mini_questions]
    })
