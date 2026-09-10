from flask import Blueprint, request, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import login_required
from backend.services.adaptive_engine import evaluate_quiz_submission

quiz_bp = Blueprint("quiz", __name__, url_prefix="/api/quiz")

@quiz_bp.route("/questions", methods=["GET"])
@login_required
def get_questions():
    topic_id = request.args.get("topic_id")
    subject_id = request.args.get("subject_id")
    mode = request.args.get("mode", "adaptive") # adaptive, practice, exam
    limit = int(request.args.get("limit", 5))

    conn = get_db_connection()
    cursor = conn.cursor()

    # Determine user's performance level on this topic if available
    target_difficulty = "Medium"
    if topic_id:
        mastery = cursor.execute("SELECT mastery_score FROM topic_mastery WHERE user_id = ? AND topic_id = ?", (g.user_id, topic_id)).fetchone()
        if mastery:
            score = mastery["mastery_score"]
            if score >= 80:
                target_difficulty = "Hard"
            elif score < 60:
                target_difficulty = "Easy"

    query = """
        SELECT q.id, q.subject_id, q.topic_id, q.question_text,
               q.option_a, q.option_b, q.option_c, q.option_d,
               q.correct_option, q.difficulty, q.explanation,
               t.name as topic_name, s.name as subject_name
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        JOIN subjects s ON q.subject_id = s.id
        WHERE 1=1
    """
    params = []
    if topic_id:
        query += " AND q.topic_id = ?"
        params.append(topic_id)
    elif subject_id:
        query += " AND q.subject_id = ?"
        params.append(subject_id)

    # In adaptive mode, prioritize target difficulty
    if mode == "adaptive" and target_difficulty:
        query += " ORDER BY CASE WHEN q.difficulty = ? THEN 0 ELSE 1 END, RANDOM() LIMIT ?"
        params.extend([target_difficulty, limit])
    else:
        query += " ORDER BY RANDOM() LIMIT ?"
        params.append(limit)

    rows = cursor.execute(query, tuple(params)).fetchall()
    conn.close()

    questions = []
    for r in rows:
        q_dict = dict(r)
        # Keep correct_option and explanation for client review after submission
        questions.append(q_dict)

    return jsonify({
        "target_difficulty": target_difficulty,
        "mode": mode,
        "count": len(questions),
        "questions": questions
    })

@quiz_bp.route("/submit", methods=["POST"])
@login_required
def submit_quiz():
    data = request.get_json() or {}
    subject_id = data.get("subject_id", 1)
    topic_id = data.get("topic_id")
    answers = data.get("answers", [])
    time_taken = data.get("time_taken_seconds", 60)

    if not answers:
        return jsonify({"error": "No answers provided"}), 400

    result = evaluate_quiz_submission(
        user_id=g.user_id,
        subject_id=subject_id,
        topic_id=topic_id,
        answers=answers,
        time_taken=time_taken
    )

    return jsonify(result)

@quiz_bp.route("/history", methods=["GET"])
@login_required
def get_quiz_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    attempts = cursor.execute("""
        SELECT qa.*, s.name as subject_name, t.name as topic_name
        FROM quiz_attempts qa
        LEFT JOIN subjects s ON qa.subject_id = s.id
        LEFT JOIN topics t ON qa.topic_id = t.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
        LIMIT 20
    """, (g.user_id,)).fetchall()
    conn.close()
    return jsonify([dict(a) for a in attempts])
