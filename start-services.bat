@echo off
echo Starting TaskPilot Backend...
cd /d "%~dp0backend"
start "TaskPilot Backend" cmd /k "npm run dev"

echo Starting TaskPilot AI Service...
cd /d "%~dp0ai-service"
start "TaskPilot AI Service" cmd /k ".\venv\Scripts\Activate.ps1 && python app.py"

echo Both services are starting...
echo Backend: http://localhost:5000
echo AI Service: http://localhost:8000
pause