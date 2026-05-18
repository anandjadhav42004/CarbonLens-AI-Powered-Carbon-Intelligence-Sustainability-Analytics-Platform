@echo off
cd /d "%~dp0FRONTEND"
echo Starting CarbonLens frontend...
npm.cmd run dev -- --host 127.0.0.1
pause
