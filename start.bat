@echo off
title EduSmart AI - Smart India Hackathon 2026
color 0B

echo =====================================================================
echo       EduSmart AI - Smart Learning & Student Success Platform
echo            Smart India Hackathon 2026 - AICTE Prototype
echo            "Learn Smarter. Improve Faster. Succeed Better."
echo =====================================================================
echo.

set PATH=C:\Windows\System32;C:\Program Files\nodejs;%PATH%

:: Initialize DB if not present
if not exist "%~dp0database\edusmart.db" (
    echo [*] Initializing SQLite database and seeding demo data...
    python "%~dp0backend\database\seed.py"
)

echo [*] Starting EduSmart AI Backend on http://127.0.0.1:5001...
start "EduSmart AI - Backend API" cmd /k "cd /d "%~dp0backend" && python app.py"

timeout /t 2 /nobreak >nul

echo [*] Starting EduSmart AI Frontend on http://localhost:5173...
start "EduSmart AI - Frontend React" cmd /k "set PATH=C:\Windows\System32;C:\Program Files\nodejs;%%PATH%% && cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo =====================================================================
echo [SUCCESS] EduSmart AI is now running!
echo Frontend:    http://localhost:5173
echo Backend API: http://127.0.0.1:5001
echo.
echo DEMO CREDENTIALS:
echo   Student Demo: demo@edusmart.ai   / Demo@123
echo   Admin Demo:   admin@edusmart.ai  / Admin@123
echo =====================================================================
echo.

start http://localhost:5173

pause
