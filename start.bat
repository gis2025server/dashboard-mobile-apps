@echo off
echo ========================================
echo Starting Dashboard & Mobile Apps Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    (
        echo PORT=3000
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo DB_PATH=./databases
        echo UPLOAD_PATH=./uploads
        echo EXCEL_UPLOAD_PATH=./uploads/excel
        echo IMAGE_UPLOAD_PATH=./uploads/images
        echo SYNC_SCHEDULE_1=0 12 * * *
        echo SYNC_SCHEDULE_2=0 18 * * *
        echo DEFAULT_ADMIN_USERNAME=admin-gis
        echo DEFAULT_ADMIN_PASSWORD=gis2026
        echo NODE_ENV=development
    ) > .env
    echo .env file created!
    echo.
)

echo Starting server...
echo.
node server/index.js

pause
