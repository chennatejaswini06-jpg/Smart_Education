from flask import Blueprint, request, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import login_required

study_plan_bp = Blueprint("study_plan", __name__, url_prefix="/api/study-plan")

@study_plan_bp.route("", methods=["GET"])
@login_required
def get_study_plan():
    conn = get_db_connection()
    cursor = conn.cursor()

    plan = cursor.execute("SELECT * FROM study_plans WHERE user_id = ? ORDER BY id DESC LIMIT 1", (g.user_id,)).fetchone()
    tasks = cursor.execute("""
        SELECT * FROM study_tasks
        WHERE user_id = ?
        ORDER BY order_index ASC, id ASC
    """, (g.user_id,)).fetchall()

    conn.close()

    total = len(tasks)
    completed = sum(1 for t in tasks if t["is_completed"])
    pct = round((completed / max(1, total)) * 100.0, 1)

    return jsonify({
        "plan": dict(plan) if plan else {
            "title": "Semester Preparation & Placement Readiness Plan",
            "daily_hours": 3.0,
            "target_exam_date": "2026-11-15",
            "priority": "High"
        },
        "tasks": [dict(t) for t in tasks],
        "stats": {
            "total_tasks": total,
            "completed_tasks": completed,
            "completion_percentage": pct
        }
    })

@study_plan_bp.route("/generate", methods=["POST"])
@login_required
def generate_study_plan():
    data = request.get_json() or {}
    target_date = data.get("target_date", "2026-11-15")
    daily_hours = float(data.get("daily_hours", 3.0))
    priority = data.get("priority", "High")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Find weakest topics to prioritize
    weak_topics = cursor.execute("""
        SELECT t.name as topic_name, s.name as subject_name, tm.mastery_score
        FROM topic_mastery tm
        JOIN topics t ON tm.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE tm.user_id = ?
        ORDER BY tm.mastery_score ASC
        LIMIT 5
    """, (g.user_id,)).fetchall()

    # Delete existing tasks for this user
    cursor.execute("DELETE FROM study_tasks WHERE user_id = ?", (g.user_id,))
    cursor.execute("DELETE FROM study_plans WHERE user_id = ?", (g.user_id,))

    # Create new plan
    cursor.execute("""
        INSERT INTO study_plans (user_id, title, target_exam_date, daily_hours, priority, total_tasks, completed_tasks)
        VALUES (?, 'AI-Optimized Adaptive Timetable', ?, ?, ?, 7, 0)
    """, (g.user_id, target_date, daily_hours, priority))
    plan_id = cursor.lastrowid

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    generated_tasks = []

    # Map weak topics into early days
    for idx, day in enumerate(days):
        if idx < len(weak_topics):
            w = weak_topics[idx]
            title = f"Intervention: Master {w['topic_name']}"
            subj = w["subject_name"]
            topic = w["topic_name"]
            mins = 45
        elif idx == 5:
            title = "Comprehensive Adaptive Diagnostic Quiz"
            subj = "Data Structures & Algorithms"
            topic = "Full Practice Set"
            mins = 30
        else:
            title = "Smart Spaced-Repetition Review & Concept Recap"
            subj = "SQL & Web Development"
            topic = "Core Relational Concepts"
            mins = 30

        cursor.execute("""
            INSERT INTO study_tasks (plan_id, user_id, day_of_week, title, subject_name, topic_name, duration_minutes, is_completed, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
        """, (plan_id, g.user_id, day, title, subj, topic, mins, idx + 1))
        generated_tasks.append({
            "day_of_week": day,
            "title": title,
            "subject_name": subj,
            "topic_name": topic,
            "duration_minutes": mins,
            "is_completed": False
        })

    conn.commit()
    conn.close()

    return jsonify({
        "message": "AI has generated a personalized timetable prioritizing your weakest topics!",
        "plan_id": plan_id,
        "tasks": generated_tasks
    })

@study_plan_bp.route("/tasks", methods=["POST"])
@login_required
def add_task():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    subject_name = data.get("subject_name", "Computer Science")
    topic_name = data.get("topic_name", "")
    day = data.get("day_of_week", "Monday")
    duration = int(data.get("duration_minutes", 30))

    if not title:
        return jsonify({"error": "Task title is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO study_tasks (plan_id, user_id, day_of_week, title, subject_name, topic_name, duration_minutes, is_completed)
        VALUES (1, ?, ?, ?, ?, ?, ?, 0)
    """, (g.user_id, day, title, subject_name, topic_name, duration))
    task_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({"id": task_id, "message": "Task added successfully"}), 201

@study_plan_bp.route("/tasks/<int:task_id>", methods=["PUT", "DELETE"])
@login_required
def manage_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "DELETE":
        cursor.execute("DELETE FROM study_tasks WHERE id = ? AND user_id = ?", (task_id, g.user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Task deleted successfully"})

    # PUT (update / toggle complete)
    data = request.get_json() or {}
    if "is_completed" in data:
        completed = 1 if data["is_completed"] else 0
        cursor.execute("UPDATE study_tasks SET is_completed = ? WHERE id = ? AND user_id = ?", (completed, task_id, g.user_id))
        if completed:
            # Award small XP for completing task
            cursor.execute("UPDATE student_profiles SET xp_points = xp_points + 25 WHERE user_id = ?", (g.user_id,))
    
    if "title" in data:
        cursor.execute("UPDATE study_tasks SET title = ?, duration_minutes = ? WHERE id = ? AND user_id = ?",
                       (data["title"], data.get("duration_minutes", 30), task_id, g.user_id))

    conn.commit()
    conn.close()
    return jsonify({"message": "Task updated successfully"})
