@echo off
echo ========================================
echo Update Client Configuration
echo ========================================
echo.

REM Get server IP
echo Please enter your server IP address:
set /p SERVER_IP="Server IP: "

if "%SERVER_IP%"=="" (
    echo ERROR: Server IP cannot be empty!
    pause
    exit /b 1
)

echo.
echo Updating configuration files with IP: %SERVER_IP%
echo.

REM Update Mobile App Configuration
if exist "MobileApp\src\config\environment.js" (
    echo [1/3] Updating Mobile App configuration...
    
    REM Create backup
    copy "MobileApp\src\config\environment.js" "MobileApp\src\config\environment.js.backup" >nul 2>&1
    
    REM Update the file
    powershell -Command "(Get-Content 'MobileApp\src\config\environment.js') -replace 'localhost', '%SERVER_IP%' | Set-Content 'MobileApp\src\config\environment.js'"
    
    echo [OK] Mobile App configuration updated
) else (
    echo [SKIP] Mobile App configuration not found
)

REM Update Dashboard Configuration
if exist "dashboard\src\services\api.js" (
    echo [2/3] Updating Dashboard configuration...
    
    REM Create backup
    copy "dashboard\src\services\api.js" "dashboard\src\services\api.js.backup" >nul 2>&1
    
    REM Update the file
    powershell -Command "(Get-Content 'dashboard\src\services\api.js') -replace 'localhost', '%SERVER_IP%' | Set-Content 'dashboard\src\services\api.js'"
    
    echo [OK] Dashboard configuration updated
) else (
    echo [SKIP] Dashboard configuration not found
)

REM Update .env file
if exist ".env" (
    echo [3/3] Updating .env configuration...
    
    REM Create backup
    copy ".env" ".env.backup" >nul 2>&1
    
    REM Update CORS_ORIGIN
    powershell -Command "(Get-Content '.env') -replace 'CORS_ORIGIN=.*', 'CORS_ORIGIN=http://%SERVER_IP%:3000' | Set-Content '.env'"
    
    echo [OK] .env configuration updated
) else (
    echo [SKIP] .env file not found
)

echo.
echo ========================================
echo Configuration Update Complete
echo ========================================
echo.
echo Updated configurations:
echo - Mobile App API URL: http://%SERVER_IP%:3000/api
echo - Dashboard API URL: http://%SERVER_IP%:3000/api
echo - CORS Origin: http://%SERVER_IP%:3000
echo.
echo Backup files created with .backup extension
echo.
echo Next steps:
echo 1. Restart the backend server: pm2 restart dashboard-api
echo 2. Rebuild mobile app: cd MobileApp ^&^& npm run android
echo 3. Rebuild dashboard: cd dashboard ^&^& npm run build
echo.
pause
