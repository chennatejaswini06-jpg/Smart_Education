from flask import Blueprint, request, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import login_required
from backend.services.ai_service import ask_ai

ai_tutor_bp = Blueprint("ai_tutor", __name__, url_prefix="/api/ai")

@ai_tutor_bp.route("/chat", methods=["POST"])
@login_required
def chat():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()
    action_type = data.get("action_type", "explain")
    topic_context = data.get("topic_context", "General")

    if not prompt:
        return jsonify({"error": "Prompt cannot be empty"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    profile = cursor.execute("SELECT academic_level FROM student_profiles WHERE user_id = ?", (g.user_id,)).fetchone()
    academic_level = profile["academic_level"] if profile else "Intermediate"

    ai_reply = ask_ai(
        prompt=prompt,
        action_type=action_type,
        topic_context=topic_context,
        academic_level=academic_level
    )

    # Save to conversations history
    cursor.execute("""
        INSERT INTO ai_conversations (user_id, topic_context, prompt, response, action_type)
        VALUES (?, ?, ?, ?, ?)
    """, (g.user_id, topic_context, prompt, ai_reply, action_type))

    # Award curiosity XP
    cursor.execute("UPDATE student_profiles SET xp_points = xp_points + 10 WHERE user_id = ?", (g.user_id,))
    conn.commit()
    conn.close()

    return jsonify({
        "prompt": prompt,
        "response": ai_reply,
        "action_type": action_type,
        "topic_context": topic_context
    })

@ai_tutor_bp.route("/history", methods=["GET", "DELETE"])
@login_required
def chat_history():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "DELETE":
        cursor.execute("DELETE FROM ai_conversations WHERE user_id = ?", (g.user_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Conversation history cleared"})

    rows = cursor.execute("""
        SELECT * FROM ai_conversations
        WHERE user_id = ?
        ORDER BY created_at ASC
        LIMIT 50
    """, (g.user_id,)).fetchall()
    conn.close()

    return jsonify([dict(r) for r in rows])
