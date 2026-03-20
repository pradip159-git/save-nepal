@echo off
title Save Nepal From Corruption - Server
color 0A
echo.
echo ==========================================
echo   Save Nepal From Corruption - Starting Server
echo ==========================================
echo.

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Download the LTS version (recommended)
    echo After installing, run this file again.
    echo.
    pause
    start https://nodejs.org
    exit /b 1
)

echo [OK] Node.js found: 
node --version

:: Install dependencies if needed
if not exist "node_modules" (
    echo.
    echo [INFO] Installing dependencies for the first time...
    npm install
    echo [OK] Dependencies installed!
)

echo.
echo [INFO] Starting Save Nepal From Corruption server...
echo [INFO] Open your browser at: http://localhost:3000
echo [INFO] Press CTRL+C to stop the server
echo.
start "" "http://localhost:3000"
node server.js
pause
