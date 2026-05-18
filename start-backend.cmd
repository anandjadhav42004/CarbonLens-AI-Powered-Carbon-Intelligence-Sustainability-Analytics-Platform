@echo off
cd /d "%~dp0BACKEND"
echo Starting CarbonLens backend on port 5001...
node server.js
pause
