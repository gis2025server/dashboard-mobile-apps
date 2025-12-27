@echo off
echo ========================================
echo Starting Dashboard API Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if PM2 is installed
where pm2 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PM2 is not installed. Installing PM2...
    call npm install -g pm2
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install PM2
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating .env from .env.production.example...
    copy .env.production.example .env
    echo.
    echo IMPORTANT: Please edit .env file with your actual configuration!
    echo Press any key to open .env file...
    pause
    notepad .env
)

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Stop existing PM2 process if running
echo Stopping existing processes...
call pm2 stop dashboard-api 2>nul
call pm2 delete dashboard-api 2>nul

REM Start the application with PM2
echo Starting application with PM2...
call pm2 start ecosystem.config.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Server started successfully!
    echo ========================================
    echo.
    echo API Server: http://localhost:3000
    echo.
    echo Useful PM2 Commands:
    echo   pm2 status          - Check application status
    echo   pm2 logs            - View application logs
    echo   pm2 restart all     - Restart application
    echo   pm2 stop all        - Stop application
    echo   pm2 monit           - Monitor application
    echo.
    echo To save PM2 configuration for auto-restart:
    echo   pm2 save
    echo   pm2 startup
    echo.
    
    REM Show PM2 status
    call pm2 status
) else (
    echo.
    echo ERROR: Failed to start the server
    echo Check the logs for more details: pm2 logs
)

echo.
pause
