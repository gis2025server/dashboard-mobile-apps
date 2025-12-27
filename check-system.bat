@echo off
echo ========================================
echo System Requirements Check
echo ========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [FAIL] Node.js is NOT installed
    echo Please install from: https://nodejs.org/
)
echo.

REM Check npm
echo [2/5] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [FAIL] npm is NOT installed
)
echo.

REM Check PM2
echo [3/5] Checking PM2...
where pm2 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PM2 is installed
    pm2 --version
) else (
    echo [WARN] PM2 is NOT installed
    echo Install with: npm install -g pm2
)
echo.

REM Check if port 3000 is available
echo [4/5] Checking port 3000...
netstat -ano | findstr :3000 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [WARN] Port 3000 is already in use
    echo Processes using port 3000:
    netstat -ano | findstr :3000
) else (
    echo [OK] Port 3000 is available
)
echo.

REM Check required directories
echo [5/5] Checking required directories...
if exist "databases" (
    echo [OK] databases directory exists
) else (
    echo [WARN] databases directory missing
    echo Creating databases directory...
    mkdir databases
)

if exist "uploads" (
    echo [OK] uploads directory exists
) else (
    echo [WARN] uploads directory missing
    echo Creating uploads directory...
    mkdir uploads
    mkdir uploads\excel
    mkdir uploads\images
)

if exist "logs" (
    echo [OK] logs directory exists
) else (
    echo [WARN] logs directory missing
    echo Creating logs directory...
    mkdir logs
)
echo.

REM Check .env file
echo Checking configuration...
if exist ".env" (
    echo [OK] .env file exists
) else (
    echo [WARN] .env file missing
    if exist ".env.production.example" (
        echo Creating .env from template...
        copy .env.production.example .env
        echo [OK] .env file created
        echo IMPORTANT: Please edit .env with your configuration!
    ) else (
        echo [FAIL] .env.production.example not found
    )
)
echo.

REM Check node_modules
echo Checking dependencies...
if exist "node_modules" (
    echo [OK] Dependencies are installed
) else (
    echo [WARN] Dependencies not installed
    echo Run: npm install
)
echo.

REM Summary
echo ========================================
echo System Check Complete
echo ========================================
echo.
echo Next Steps:
echo 1. Install any missing requirements
echo 2. Edit .env file with your configuration
echo 3. Run: npm install (if needed)
echo 4. Run: start-production.bat
echo.
pause
