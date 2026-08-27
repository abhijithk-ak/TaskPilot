@echo off
echo Starting TaskPilot Backend...
cd /d "%~dp0backend"
start "TaskPilot Backend" cmd /k "npm start"

echo Starting TaskPilot AI Service...
cd /d "%~dp0ai-service"
start "TaskPilot AI Service" cmd /k "venv\Scripts\python.exe app.py"

echo Starting TaskPilot Frontend...
cd /d "%~dp0frontend"
start "TaskPilot Frontend" cmd /k "npm run dev:classic"

echo All services are starting...
echo Backend: http://localhost:5000
echo AI Service: http://localhost:8000
echo Frontend: http://localhost:3000
pause
