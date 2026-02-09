@echo off
title Home Assistant AI Launcher
color 0A

echo ===================================================
echo      HOME ASSISTANT AI - NEXT GEN SYSTEM
echo ===================================================

cd /d "%~dp0"

:: 1. Check Python Environment
if not exist ".venv" (
    echo [INFO] Virtual environment not found. Creating one...
    python -m venv .venv
    echo [INFO] Upgrading pip...
    call .venv\Scripts\activate
    python -m pip install --upgrade pip
) else (
    call .venv\Scripts\activate
)

echo [INFO] Updating dependencies...
pip install -r requirements.txt > nul
echo [OK] Dependencies ready.

:: 2. Start Middleware & Simulators
echo.
echo [1/3] Launching Boiler Simulator...
start "Boiler Sim" cmd /k "call .venv\Scripts\activate && python src/opentherm_boiler_sim.py"
:: Give it a moment to bind port
timeout /t 2 /nobreak > nul

:: 3. Start Backend
echo.
echo [2/3] Launching AI Backend (FastAPI)...
start "AI Backend API" cmd /k "call .venv\Scripts\activate && uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload"

:: 4. Start Frontend
echo.
echo [3/3] Launching Web Interface (Next.js)...
cd web-interface
if not exist "node_modules" (
    echo [INFO] Installing Frontend Dependencies (this may take a while)...
    call npm install
)

:: Failsafe for specific UI libs
if not exist "node_modules\recharts" (
    echo [INFO] Installing Recharts & Lucide...
    call npm install recharts lucide-react clsx tailwind-merge
)

start "Web Dashboard" cmd /k "npm run dev"

echo.
echo ===================================================
echo    SYSTEM RUNNING
echo    - API: http://localhost:8000/docs
echo    - UI:  http://localhost:3000
echo ===================================================
echo.
pause
