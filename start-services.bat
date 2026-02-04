@echo off
echo Starting TaskPilot Backend...
cd /d "%~dp0backend"
start "TaskPilot Backend" cmd /k "npm run dev"

echo Starting TaskPilot AI Service...
cd /d "%~dp0ai_service"
start "TaskPilot AI Service" cmd /k "python app.py"

echo Starting TaskPilot Frontend...
cd /d "%~dp0frontend\taskpilot-frontend"
start "TaskPilot Frontend" cmd /k "npm run dev"

echo All services are starting...
echo Backend: http://localhost:5000
echo AI Service: http://localhost:8000
echo Frontend: http://localhost:3000
pause
