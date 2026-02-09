@echo off
title Fiammetta - Caldaia Intelligente
color 0A

echo ===================================================
echo        FIAMMETTA - Caldaia Intelligente
echo ===================================================
echo.

cd /d "%~dp0"

:: 1. Check Ollama
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Ollama non trovato. Installalo da https://ollama.com
    pause
    exit /b 1
)

:: 2. Pull model if needed
echo [1/4] Verifico modello AI...
ollama pull llama3.2:1b

:: 3. Start Boiler Simulator
echo.
echo [2/4] Avvio simulatore caldaia...
start "Fiammetta - Boiler Sim" cmd /k "cd backend && python src/opentherm_boiler_sim.py"
timeout /t 2 /nobreak >nul

:: 4. Start Backend API
echo.
echo [3/4] Avvio backend API...
start "Fiammetta - Backend API" cmd /k "cd backend && set PYTHONPATH=. && python -m uvicorn src.api:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

:: 5. Start Frontend
echo.
echo [4/4] Avvio frontend...
cd frontend
if not exist "node_modules" (
    echo [INFO] Installazione dipendenze frontend...
    call npm install
)
start "Fiammetta - Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo    FIAMMETTA IN ESECUZIONE
echo.
echo    Frontend: http://localhost:5173
echo    API:      http://localhost:8000/docs
echo ===================================================
echo.
pause
