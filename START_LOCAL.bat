@echo off
echo ========================================
echo    STARTING FLASHWORK LOCALLY
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/4] Installing backend dependencies...
cd flashwork\backend
if not exist node_modules (
    echo Installing packages...
    call npm install
) else (
    echo ✓ Dependencies already installed
)
echo.

echo [3/4] Checking environment variables...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create flashwork/backend/.env file
    pause
    exit /b 1
)
echo ✓ Environment file exists
echo.

echo [4/4] Starting backend server...
echo.
echo ========================================
echo    BACKEND STARTING ON PORT 5000
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo.
echo To access the frontend:
echo 1. Open flashwork/frontend/index.html in your browser
echo 2. Or use Live Server in VS Code
echo 3. Or run: python -m http.server 8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm start
