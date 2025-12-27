@echo off
echo ========================================
echo Expo Mobile App Setup (Easier Method)
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed ✓
echo.

REM Install Expo CLI
echo [2/6] Installing Expo CLI...
call npm install -g expo-cli
echo Expo CLI installed ✓
echo.

REM Check if MobileApp directory exists
echo [3/6] Checking for existing MobileApp...
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

REM Create Expo project
echo [4/6] Creating Expo project...
echo This may take a few minutes...
call npx create-expo-app MobileApp --template blank
if errorlevel 1 (
    echo ERROR: Failed to create Expo project!
    pause
    exit /b 1
)
echo Expo project created ✓
echo.

:INSTALL_DEPS
REM Install dependencies
echo [5/6] Installing dependencies...
cd MobileApp

echo Installing navigation...
call npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

echo Installing utilities...
call npx expo install axios @react-native-async-storage/async-storage

echo Installing Expo modules...
call npx expo install expo-location expo-camera expo-image-picker expo-constants

echo All dependencies installed ✓
echo.

REM Create directory structure
echo [6/6] Creating project structure...
if not exist "src\" mkdir src
if not exist "src\screens\" mkdir src\screens
if not exist "src\components\" mkdir src\components
if not exist "src\services\" mkdir src\services
if not exist "src\navigation\" mkdir src\navigation
if not exist "src\utils\" mkdir src\utils
echo Project structure created ✓
echo.

REM Get local IP address
echo Detecting your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP_ADDR=%%a
    goto :IP_FOUND
)
:IP_FOUND
set IP_ADDR=%IP_ADDR:~1%
echo Your IP address: %IP_ADDR%
echo.

REM Create API configuration
(
echo const API_URL = 'http://%IP_ADDR%:3000/api';
echo.
echo export default API_URL;
) > src\utils\constants.js

REM Create app.json configuration
(
echo {
echo   "expo": {
echo     "name": "Dashboard Mobile App",
echo     "slug": "dashboard-mobile-app",
echo     "version": "1.0.0",
echo     "orientation": "portrait",
echo     "icon": "./assets/icon.png",
echo     "userInterfaceStyle": "light",
echo     "splash": {
echo       "image": "./assets/splash.png",
echo       "resizeMode": "contain",
echo       "backgroundColor": "#ffffff"
echo     },
echo     "assetBundlePatterns": [
echo       "**/*"
echo     ],
echo     "ios": {
echo       "supportsTablet": true,
echo       "bundleIdentifier": "com.dashboard.mobileapp"
echo     },
echo     "android": {
echo       "adaptiveIcon": {
echo         "foregroundImage": "./assets/adaptive-icon.png",
echo         "backgroundColor": "#ffffff"
echo       },
echo       "package": "com.dashboard.mobileapp",
echo       "permissions": [
echo         "CAMERA",
echo         "ACCESS_FINE_LOCATION",
echo         "ACCESS_COARSE_LOCATION",
echo         "READ_EXTERNAL_STORAGE",
echo         "WRITE_EXTERNAL_STORAGE"
echo       ]
echo     },
echo     "web": {
echo       "favicon": "./assets/favicon.png"
echo     },
echo     "plugins": [
echo       [
echo         "expo-camera",
echo         {
echo           "cameraPermission": "Allow app to access your camera for taking photos"
echo         }
echo       ],
echo       [
echo         "expo-location",
echo         {
echo           "locationAlwaysAndWhenInUsePermission": "Allow app to use your location for check-in"
echo         }
echo       ]
echo     ]
echo   }
echo }
) > app.json

REM Create README
(
echo # Dashboard Mobile App ^(Expo^)
echo.
echo ## Quick Start
echo.
echo ### Development:
echo ```bash
echo # Start Expo
echo npm start
echo.
echo # Or use Expo Go app on your phone
echo # Scan the QR code that appears
echo ```
echo.
echo ### Build APK:
echo ```bash
echo # Build for Android
echo eas build --platform android --profile preview
echo ```
echo.
echo ## API Configuration
echo.
echo Server URL: http://%IP_ADDR%:3000/api
echo.
echo To change, edit: `src/utils/constants.js`
echo.
echo ## Testing with Expo Go
echo.
echo 1. Install "Expo Go" app on your Android/iOS device
echo 2. Make sure your phone and computer are on the same WiFi
echo 3. Run `npm start` in this directory
echo 4. Scan the QR code with Expo Go app
echo 5. Login with: admin-gis / gis2026
echo.
echo ## Building Standalone App
echo.
echo 1. Install EAS CLI: `npm install -g eas-cli`
echo 2. Create Expo account: `eas login`
echo 3. Configure build: `eas build:configure`
echo 4. Build APK: `eas build --platform android --profile preview`
) > README.md

cd ..

echo ========================================
echo Expo Setup Complete! ✓
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Install "Expo Go" app on your phone from:
echo    - Android: Google Play Store
echo    - iOS: App Store
echo.
echo 2. Start the backend server:
echo    node server/index.js
echo.
echo 3. Start the Expo app:
echo    cd MobileApp
echo    npm start
echo.
echo 4. Scan the QR code with Expo Go app
echo.
echo 5. Your API URL is: http://%IP_ADDR%:3000/api
echo.
echo Advantages of Expo:
echo - No need for Android Studio initially
echo - Test on real device easily with Expo Go
echo - Easier to build and deploy
echo - Hot reload works great
echo.
echo ========================================
echo.
pause
