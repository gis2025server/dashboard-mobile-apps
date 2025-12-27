@echo off
echo ========================================
echo Stopping Dashboard API Server
echo ========================================
echo.

REM Check if PM2 is installed
where pm2 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PM2 is not installed!
    echo The server may not be running with PM2.
    pause
    exit /b 1
)

REM Stop the application
echo Stopping application...
call pm2 stop dashboard-api

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Server stopped successfully!
    echo ========================================
    echo.
    echo To start the server again, run: start-production.bat
    echo To delete the process completely, run: pm2 delete dashboard-api
    echo.
) else (
    echo.
    echo ERROR: Failed to stop the server
    echo The application may not be running.
)

call pm2 status
echo.
pause
