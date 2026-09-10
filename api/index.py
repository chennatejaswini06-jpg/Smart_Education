import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
try:
    from app import app
except ImportError:
    try:
        from backend.app import app
    except ImportError:
        from backend import app
