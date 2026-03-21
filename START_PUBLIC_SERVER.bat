@echo off
title Save Nepal From Corruption - Live Internet Server
color 0A
echo.
echo ==============================================================
echo   Starting Save Nepal From Corruption
echo   Mode: LIVE INTERNET SERVER (Running on your Laptop)
echo ==============================================================
echo.
echo [1] Starting your local server in the background...
start /B node server.js

:: Wait for server to start
timeout /t 3 /nobreak >nul

echo.
echo [2] Connecting your laptop safely to the Internet...
echo ==============================================================
echo   WAIT for a link that looks like: "your url is: https://..."
echo   COPY that link and send it to people!
echo.
echo   DO NOT CLOSE THIS WINDOW. If you close it, your website goes offline.
echo   All complaints will save directly to your ''data/complaints/'' folder!
echo ==============================================================
echo.

npx -y localtunnel --port 3000

echo.
echo Server disconnected.
pause
