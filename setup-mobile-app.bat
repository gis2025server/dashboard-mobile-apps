@echo off
echo ========================================
echo Mobile App Setup Script
echo ========================================
echo.

REM Get current directory
set CURRENT_DIR=%cd%

REM Check if Node.js is installed
echo [1/10] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed ✓
echo.

REM Check if React Native CLI is installed
echo [2/10] Checking React Native CLI...
npx react-native --version >nul 2>&1
if errorlevel 1 (
    echo Installing React Native CLI...
    npm install -g react-native-cli
)
echo React Native CLI is ready ✓
echo.

REM Check if MobileApp directory exists
echo [3/10] Checking for existing MobileApp...
if exist "MobileApp\" (
    echo MobileApp directory already exists!
    set /p OVERWRITE="Do you want to recreate it? (y/n): "
    if /i "%OVERWRITE%"=="y" (
        echo Removing old MobileApp directory...
        rmdir /s /q MobileApp
    ) else (
        echo Keeping existing MobileApp directory.
        goto :INSTALL_DEPS
    )
)

REM Create React Native project
echo [4/10] Creating React Native project...
echo This may take several minutes...
npx react-native@latest init MobileApp
if errorlevel 1 (
    echo ERROR: Failed to create React Native project!
    pause
    exit /b 1
)
echo React Native project created ✓
echo.

:INSTALL_DEPS
REM Install dependencies
echo [5/10] Installing dependencies...
cd MobileApp

echo Installing navigation libraries...
call npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

echo Installing React Native dependencies...
call npm install react-native-screens react-native-safe-area-context

echo Installing utility libraries...
call npm install axios @react-native-async-storage/async-storage

echo Installing additional libraries...
call npm install react-native-vector-icons react-native-geolocation-service react-native-image-picker socket.io-client

echo All dependencies installed ✓
echo.

REM Create directory structure
echo [6/10] Creating project structure...
if not exist "src\" mkdir src
if not exist "src\screens\" mkdir src\screens
if not exist "src\components\" mkdir src\components
if not exist "src\services\" mkdir src\services
if not exist "src\navigation\" mkdir src\navigation
if not exist "src\utils\" mkdir src\utils
echo Project structure created ✓
echo.

REM Get local IP address
echo [7/10] Detecting your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP_ADDR=%%a
    goto :IP_FOUND
)
:IP_FOUND
set IP_ADDR=%IP_ADDR:~1%
echo Your IP address: %IP_ADDR%
echo.

REM Create API configuration file
echo [8/10] Creating API configuration...
(
echo const API_URL = 'http://%IP_ADDR%:3000/api';
echo.
echo export default API_URL;
) > src\utils\constants.js
echo API configuration created ✓
echo.

REM Update Android manifest for permissions
echo [9/10] Configuring Android permissions...
echo Please manually add permissions to android/app/src/main/AndroidManifest.xml
echo See MOBILE_APP_SETUP_GUIDE.md for details
echo.

REM Create README for mobile app
echo [10/10] Creating mobile app README...
(
echo # Mobile App
echo.
echo ## Quick Start
echo.
echo ### Development:
echo ```bash
echo # Terminal 1: Start Metro
echo npm start
echo.
echo # Terminal 2: Run Android
echo npm run android
echo ```
echo.
echo ### Build Production APK:
echo ```bash
echo cd android
echo ./gradlew assembleRelease
echo ```
echo.
echo APK will be in: `android/app/build/outputs/apk/release/app-release.apk`
echo.
echo ## API Configuration
echo.
echo Server URL: http://%IP_ADDR%:3000/api
echo.
echo To change the API URL, edit: `src/utils/constants.js`
echo.
echo ## Testing
echo.
echo 1. Make sure backend server is running on port 3000
echo 2. Make sure your device/emulator is on the same network
echo 3. Login with: admin-gis / gis2026
) > README.md
echo Mobile app README created ✓
echo.

cd ..

echo ========================================
echo Setup Complete! ✓
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Copy the mobile app code files to MobileApp/src/
echo    (I can generate these for you)
echo.
echo 2. Update Android permissions:
echo    Edit: MobileApp/android/app/src/main/AndroidManifest.xml
echo    See: MOBILE_APP_SETUP_GUIDE.md for details
echo.
echo 3. Start the backend server:
echo    node server/index.js
echo.
echo 4. Start the mobile app:
echo    cd MobileApp
echo    npm start
echo    (In another terminal) npm run android
echo.
echo 5. Your API URL is configured as:
echo    http://%IP_ADDR%:3000/api
echo.
echo ========================================
echo.
pause
