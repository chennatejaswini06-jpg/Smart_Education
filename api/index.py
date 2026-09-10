import sys
import os
# Add root and backend to path
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, 'backend'))

# Try to import - adjust based on your structure
try:
    from backend.app import app as application
    app = application
except Exception as e:
    print(f"Import error: {e}")
    # Fallback: if app.py is at root
    try:
        from app import app as application
        app = application
    except Exception as e2:
        print(f"Second import error: {e2}")
        raise
