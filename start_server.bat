@echo off
title Ragebait CAPTCHA Gauntlet Server
echo ========================================================
echo Starting Ragebait CAPTCHA Gauntlet on http://localhost:8080/
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
