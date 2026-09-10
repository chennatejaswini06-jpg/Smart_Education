import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import backend.app as backend_app

# Try to find the Flask/FastAPI app no matter what it's called
app = None

# 1. Common names
for name in ['app', 'application', 'flask_app', 'api', 'server']:
    if hasattr(backend_app, name):
        app = getattr(backend_app, name)
        break

# 2. If it's a factory function create_app()
if app is None and hasattr(backend_app, 'create_app'):
    app = backend_app.create_app()

# 3. If still not found, show what's inside file for debugging
if app is None:
    available = [x for x in dir(backend_app) if not x.startswith('_')]
    raise ImportError(f"Could not find Flask app in backend/app.py. Found: {available}. Please make sure it defines variable 'app = Flask(__name__)'")

# Vercel needs 'app' at top level
