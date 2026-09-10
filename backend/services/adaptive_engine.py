from backend.database.db import get_db_connection

def calculate_mastery_update(old_score: float, quiz_percentage: float) -> float:
    # Exponential moving average: 40% historical + 60% recent performance
    updated = (old_score * 0.4) + (quiz_percentage * 0.6)
    return round(max(5.0, min(100.0, updated)), 1)

def evaluate_quiz_submission(user_id: int, subject_id: int, topic_id: int, answers: list, time_taken: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    total_questions = len(answers)
    correct_count = 0
    detailed_results = []
    topic_counts = {}

    for ans in answers:
        q_id = ans.get("question_id")
        selected = ans.get("selected_option", "").strip().upper()
        
        q_row = cursor.execute("SELECT * FROM questions WHERE id = ?", (q_id,)).fetchone()
        if not q_row:
            continue
        
        is_correct = (selected == q_row["correct_option"])
        if is_correct:
            correct_count += 1
            
        t_id = q_row["topic_id"]
        if t_id not in topic_counts:
            topic_counts[t_id] = {"correct": 0, "total": 0, "subject_id": q_row["subject_id"]}
        topic_counts[t_id]["total"] += 1
        if is_correct:
            topic_counts[t_id]["correct"] += 1
            
        detailed_results.append({
            "question_id": q_id,
            "question_text": q_row["question_text"],
            "selected_option": selected,
            "correct_option": q_row["correct_option"],
            "is_correct": is_correct,
            "explanation": q_row["explanation"],
            "difficulty": q_row["difficulty"]
        })

    score_pct = round((correct_count / max(1, total_questions)) * 100.0, 1)

    # Calculate adaptive difficulty recommendation
    if score_pct >= 80.0:
        recommended_difficulty = "Hard"
        feedback = "Outstanding! You demonstrated advanced mastery. We are advancing you to higher difficulty challenges."
    elif score_pct >= 60.0:
        recommended_difficulty = "Medium"
        feedback = "Solid effort! You have a good grasp of the fundamentals. Continue practicing medium-level scenarios."
    else:
        recommended_difficulty = "Easy"
        feedback = "Needs improvement. We recommend reviewing the concept materials and practicing foundational exercises."

    # XP calculation: 15 XP per correct + 50 bonus for >= 80%
    xp_earned = (correct_count * 15) + (50 if score_pct >= 80.0 else 0)

    # Insert attempt record
    cursor.execute("""
        INSERT INTO quiz_attempts (user_id, subject_id, topic_id, total_questions, correct_answers, score_percentage, difficulty_level, xp_earned, time_taken_seconds)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, subject_id, topic_id, total_questions, correct_count, score_pct, recommended_difficulty, xp_earned, time_taken))
    attempt_id = cursor.lastrowid

    # Insert individual answers
    for res in detailed_results:
        cursor.execute("""
            INSERT INTO quiz_answers (attempt_id, question_id, selected_option, is_correct, time_spent_seconds)
            VALUES (?, ?, ?, ?, ?)
        """, (attempt_id, res["question_id"], res["selected_option"], 1 if res["is_correct"] else 0, time_taken // max(1, total_questions)))

    # Update Topic Masteries & Detect Gaps
    strong_areas = []
    weak_areas = []
    
    for t_id, data in topic_counts.items():
        t_row = cursor.execute("SELECT name FROM topics WHERE id = ?", (t_id,)).fetchone()
        t_name = t_row["name"] if t_row else f"Topic {t_id}"
        t_pct = (data["correct"] / data["total"]) * 100.0

        existing_mastery = cursor.execute("SELECT mastery_score FROM topic_mastery WHERE user_id = ? AND topic_id = ?", (user_id, t_id)).fetchone()
        old_score = existing_mastery["mastery_score"] if existing_mastery else 50.0
        new_score = calculate_mastery_update(old_score, t_pct)
        status = "Mastered" if new_score >= 80.0 else ("Weak" if new_score < 60.0 else "Moderate")

        cursor.execute("""
            INSERT INTO topic_mastery (user_id, topic_id, mastery_score, questions_attempted, questions_correct, status, last_studied_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, topic_id) DO UPDATE SET
                mastery_score = ?,
                questions_attempted = questions_attempted + ?,
                questions_correct = questions_correct + ?,
                status = ?,
                last_studied_at = CURRENT_TIMESTAMP
        """, (user_id, t_id, new_score, data["total"], data["correct"], status, new_score, data["total"], data["correct"], status))

        if new_score < 60.0:
            weak_areas.append({"topic_id": t_id, "topic_name": t_name, "mastery": new_score})
            # Check for repeated mistakes to trigger intelligent Doubt Alert
            incorrect_in_topic = data["total"] - data["correct"]
            if incorrect_in_topic >= 2 or new_score <= 50.0:
                cursor.execute("""
                    INSERT INTO doubt_alerts (user_id, topic_id, topic_name, mistake_count, status)
                    VALUES (?, ?, ?, ?, 'ACTIVE')
                """, (user_id, t_id, t_name, incorrect_in_topic))
                # Add recommendation
                cursor.execute("""
                    INSERT INTO recommendations (user_id, title, description, priority, type, topic_id, action_link)
                    VALUES (?, ?, ?, 'HIGH', 'REVISION', ?, ?)
                """, (user_id, f"Targeted Revision: {t_name}", f"Your recent score in {t_name} was {t_pct}%. Review key concepts with AI Tutor.", t_id, f"/ai-tutor?topic={t_name}"))
        else:
            strong_areas.append({"topic_id": t_id, "topic_name": t_name, "mastery": new_score})

    # Update User XP & Streak in Profile
    cursor.execute("""
        UPDATE student_profiles
        SET xp_points = xp_points + ?,
            last_active_date = date('now')
        WHERE user_id = ?
    """, (xp_earned, user_id))

    conn.commit()
    conn.close()

    return {
        "attempt_id": attempt_id,
        "score_percentage": score_pct,
        "correct_answers": correct_count,
        "total_questions": total_questions,
        "xp_earned": xp_earned,
        "recommended_difficulty": recommended_difficulty,
        "feedback": feedback,
        "strong_areas": strong_areas,
        "weak_areas": weak_areas,
        "detailed_results": detailed_results
    }
