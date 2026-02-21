@echo off
echo ========================================
echo    STARTING PAYBURST APPLICATION
echo ========================================
echo.

echo [1/3] Starting PostgreSQL...
net start postgresql-x64-18
if %errorlevel% neq 0 (
    echo PostgreSQL is already running or failed to start
)
echo.

echo [2/3] Starting Backend Server (Port 5000)...
start "PAYBURST Backend" cmd /k "cd flashwork\backend && npm start"
timeout /t 3 /nobreak >nul
echo.

echo [3/3] Starting Frontend Server (Port 8080)...
start "PAYBURST Frontend" cmd /k "cd flashwork\frontend && python -m http.server 8080"
timeout /t 2 /nobreak >nul
echo.

echo ========================================
echo    PAYBURST IS NOW RUNNING!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:8080
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:8080
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq PAYBURST Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PAYBURST Frontend*" /T /F >nul 2>&1
echo Servers stopped.
echo.
pause
