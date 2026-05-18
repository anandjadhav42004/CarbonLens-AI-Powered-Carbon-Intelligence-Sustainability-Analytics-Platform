@echo off
cd /d "%~dp0"
start "CarbonLens Backend" cmd /k start-backend.cmd
start "CarbonLens Frontend" cmd /k start-frontend.cmd
echo CarbonLens is starting.
echo Frontend: http://127.0.0.1:5174/
echo Backend health: http://localhost:5001/health
pause
