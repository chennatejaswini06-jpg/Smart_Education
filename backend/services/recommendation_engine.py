from backend.database.db import get_db_connection

def generate_dynamic_recommendations(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get student weak and strong topics
    query = """
        SELECT tm.mastery_score, tm.status, tm.last_studied_at,
               t.id as topic_id, t.name as topic_name, s.name as subject_name
        FROM topic_mastery tm
        JOIN topics t ON tm.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE tm.user_id = ?
        ORDER BY tm.mastery_score ASC
    """
    rows = cursor.execute(query, (user_id,)).fetchall()
    
    recommendations = []
    for r in rows:
        score = r["mastery_score"]
        topic_name = r["topic_name"]
        t_id = r["topic_id"]

        if score < 55.0:
            recommendations.append({
                "id": t_id,
                "title": f"Critical Intervention: {topic_name}",
                "description": f"Mastery is currently at {score}%. We recommend completing foundational explanations and guided exercises.",
                "priority": "HIGH",
                "type": "REVISION",
                "topic_id": t_id,
                "action_link": f"/ai-tutor?topic={topic_name}",
                "badge": "Priority Focus"
            })
        elif score < 75.0:
            recommendations.append({
                "id": t_id,
                "title": f"Target Practice: {topic_name}",
                "description": f"Mastery is at {score}%. Complete an adaptive medium-difficulty quiz to push into the mastery tier.",
                "priority": "MEDIUM",
                "type": "PRACTICE",
                "topic_id": t_id,
                "action_link": f"/quiz?topic={t_id}",
                "badge": "Practice Due"
            })
        elif score >= 85.0:
            recommendations.append({
                "id": t_id,
                "title": f"Mastery Retained: {topic_name}",
                "description": f"Mastery is solid at {score}%. Take on advanced application scenarios or mentor peers.",
                "priority": "LOW",
                "type": "ADVANCED",
                "topic_id": t_id,
                "action_link": f"/study-material?topic={t_id}",
                "badge": "Mastered"
            })

    conn.close()
    return recommendations
