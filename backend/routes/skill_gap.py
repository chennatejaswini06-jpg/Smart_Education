from flask import Blueprint, request, jsonify, g
from backend.database.db import get_db_connection
from backend.utils.auth import login_required

skill_gap_bp = Blueprint("skill_gap", __name__, url_prefix="/api/skill-gap")

INDUSTRY_ROLES = {
    "Software Developer": {
        "description": "Designs, develops, tests, and maintains robust scalable software applications.",
        "skills": {
            "Java Programming": 75,
            "Python": 70,
            "Data Structures & Algorithms": 80,
            "SQL & Databases": 75,
            "Web Development": 70
        },
        "critical_topics": ["Recursion & Backtracking", "Linked Lists", "SQL Joins & Aggregations", "REST APIs & HTTP Protocols"]
    },
    "Full Stack Developer": {
        "description": "Builds end-to-end web apps with interactive React frontends and robust REST/SQL backends.",
        "skills": {
            "Web Development": 85,
            "SQL & Databases": 75,
            "Python": 75,
            "Data Structures & Algorithms": 65,
            "Cybersecurity": 65
        },
        "critical_topics": ["React Components & Hooks", "REST APIs & HTTP Protocols", "SQL Joins & Aggregations", "Web Security & SQL Injection"]
    },
    "Data Scientist": {
        "description": "Transforms raw enterprise data into actionable predictive insights using algorithms and models.",
        "skills": {
            "Python": 90,
            "SQL & Databases": 85,
            "Data Structures & Algorithms": 70,
            "Database Management Systems": 75
        },
        "critical_topics": ["Python Dictionaries & Sets", "SQL Joins & Aggregations", "Indexing & Query Optimization", "Normalization & ACID Properties"]
    },
    "Cybersecurity Analyst": {
        "description": "Protects networks, applications, and cloud infrastructure from threats, attacks, and vulnerabilities.",
        "skills": {
            "Cybersecurity": 85,
            "Computer Networks": 85,
            "Python": 70,
            "SQL & Databases": 70,
            "C Programming": 70
        },
        "critical_topics": ["Cybersecurity Basics & Threats", "Web Security & SQL Injection", "OSI & TCP/IP Model", "Pointers & Dynamic Memory"]
    }
}

@skill_gap_bp.route("/roles", methods=["GET"])
def get_roles():
    roles = []
    for role_name, data in INDUSTRY_ROLES.items():
        roles.append({
            "name": role_name,
            "description": data["description"],
            "skills_count": len(data["skills"])
        })
    return jsonify(roles)

@skill_gap_bp.route("", methods=["GET"])
@login_required
def analyze_skill_gap():
    role_name = request.args.get("role", "Software Developer")
    if role_name not in INDUSTRY_ROLES:
        role_name = "Software Developer"

    role_spec = INDUSTRY_ROLES[role_name]
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch user's subject-level mastery
    skill_comparison = []
    overall_current = 0
    overall_required = 0

    for subject_name, required_pct in role_spec["skills"].items():
        sub_row = cursor.execute("SELECT id FROM subjects WHERE name = ?", (subject_name,)).fetchone()
        if sub_row:
            s_id = sub_row["id"]
            mastery_row = cursor.execute("""
                SELECT ROUND(AVG(tm.mastery_score), 1) as avg_score
                FROM topics t
                JOIN topic_mastery tm ON t.id = tm.topic_id AND tm.user_id = ?
                WHERE t.subject_id = ?
            """, (g.user_id, s_id)).fetchone()
            current_pct = mastery_row["avg_score"] if (mastery_row and mastery_row["avg_score"]) else 50.0
        else:
            current_pct = 50.0

        gap = round(required_pct - current_pct, 1)
        if current_pct >= required_pct:
            status = "Strong"
            badge_color = "emerald"
        elif current_pct >= (required_pct - 10):
            status = "Almost Ready"
            badge_color = "amber"
        else:
            status = "Needs Improvement"
            badge_color = "rose"

        skill_comparison.append({
            "subject": subject_name,
            "current_mastery": current_pct,
            "required_mastery": required_pct,
            "gap": max(0.0, gap),
            "status": status,
            "badge_color": badge_color
        })

        overall_current += current_pct
        overall_required += required_pct

    # Generate custom roadmap
    roadmap = [
        {
            "step": 1,
            "title": "Bridge Immediate Technical Deficit",
            "focus": "Recursion & Linked Lists (DSA)",
            "action": "Complete guided tutorials, AI Tutor code walkthroughs, and practice 10 easy questions.",
            "duration": "1 Week"
        },
        {
            "step": 2,
            "title": "Consolidate Intermediate Skills",
            "focus": "SQL Joins, Indexing & REST APIs",
            "action": "Attempt timed adaptive quizzes to push SQL mastery from 72% to 80%+.",
            "duration": "2 Weeks"
        },
        {
            "step": 3,
            "title": "Role-Specific Project & Capstone",
            "focus": f"Build full-stack solution aligned with {role_name}",
            "action": "Integrate backend database with modern frontend UI, implementing secure authentication and OWASP security.",
            "duration": "3 Weeks"
        },
        {
            "step": 4,
            "title": "Placement Mock Assessment",
            "focus": "Full-syllabus Adaptive Exam",
            "action": "Attempt the simulated 45-minute timed placement test with automated gap feedback.",
            "duration": "Exam Readiness"
        }
    ]

    conn.close()

    overall_readiness = round((overall_current / max(1, overall_required)) * 100.0, 1)

    return jsonify({
        "target_role": role_name,
        "description": role_spec["description"],
        "overall_readiness_percentage": min(100.0, overall_readiness),
        "skill_comparison": skill_comparison,
        "critical_topics": role_spec["critical_topics"],
        "roadmap": roadmap
    })
