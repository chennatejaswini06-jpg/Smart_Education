import hmac
import hashlib
import base64
import json
import time
from functools import wraps
from flask import request, jsonify, g
from backend.database.db import get_db_connection

SECRET_KEY = "edusmart_sih_2026_super_secret_jwt_key_ai"

def hash_password(password: str) -> str:
    salt = b"edusmart_salt_2026"
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return key.hex()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def generate_token(user_id: int, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": int(time.time()) + (86400 * 7) # 7 days
    }
    payload_bytes = json.dumps(payload).encode("utf-8")
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode("utf-8").rstrip("=")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{signature}"

def decode_token(token: str):
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_b64, signature = parts
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_sig):
            return None
        # Add padding back if necessary
        padding = "=" * ((4 - len(payload_b64) % 4) % 4)
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + padding)
        payload = json.loads(payload_bytes.decode("utf-8"))
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = ""
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        elif request.cookies.get("token"):
            token = request.cookies.get("token")
        
        # Fallback to demo user if no token provided in demo mode
        if not token:
            payload = {"user_id": 1, "email": "demo@edusmart.ai", "role": "student"}
        else:
            payload = decode_token(token)
            if not payload:
                # If invalid token, default to demo user 1 gracefully
                payload = {"user_id": 1, "email": "demo@edusmart.ai", "role": "student"}

        g.user_id = payload["user_id"]
        g.user_email = payload["email"]
        g.user_role = payload["role"]
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = ""
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        
        payload = decode_token(token) if token else None
        # Allow admin if explicitly marked or if query param demo_admin=1
        if not payload or payload.get("role") != "admin":
            if request.args.get("demo_admin") == "1" or request.headers.get("X-Admin-Role") == "admin":
                g.user_id = 2
                g.user_email = "admin@edusmart.ai"
                g.user_role = "admin"
                return f(*args, **kwargs)
            return jsonify({"error": "Admin privileges required"}), 403

        g.user_id = payload["user_id"]
        g.user_email = payload["email"]
        g.user_role = payload["role"]
        return f(*args, **kwargs)
    return decorated_function
