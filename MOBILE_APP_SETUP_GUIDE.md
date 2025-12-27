# Mobile App Setup & Build Guide

## Overview
This guide will help you create, build, and connect a React Native mobile app with your existing dashboard system.

---

## Prerequisites

### Required Software:
1. **Node.js** (Already installed ✅)
2. **Android Studio** (for Android development)
3. **Xcode** (for iOS development - Mac only)
4. **Java JDK 11 or higher**
5. **React Native CLI**

### Check Your Setup:
```bash
node --version
npm --version
java -version
```

---

## Part 1: Install React Native CLI

```bash
# Install React Native CLI globally
npm install -g react-native-cli

# Verify installation
npx react-native --version
```

---

## Part 2: Create Mobile App Project

### Option A: Using React Native CLI (Recommended)

```bash
# Navigate to your apps directory
cd d:/final-apps/apps

# Create new React Native project
npx react-native@latest init MobileApp

# Navigate to project
cd MobileApp

# Install required dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install react-native-geolocation-service
npm install react-native-image-picker
npm install socket.io-client

# Link native dependencies (for React Native < 0.60)
npx react-native link
```

### Option B: Using Expo (Easier for beginners)

```bash
# Install Expo CLI
npm install -g expo-cli

# Create Expo project
cd d:/final-apps/apps
npx create-expo-app MobileApp

cd MobileApp

# Install dependencies
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install axios
npx expo install @react-native-async-storage/async-storage
npx expo install expo-location
npx expo install expo-camera
npx expo install expo-image-picker
```

---

## Part 3: Project Structure

```
MobileApp/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── VisitListScreen.js
│   │   ├── VisitActionScreen.js
│   │   ├── CheckInScreen.js
│   │   └── ReportScreen.js
│   ├── components/
│   │   ├── VisitCard.js
│   │   ├── PhotoCapture.js
│   │   └── StatusButton.js
│   ├── services/
│   │   ├── api.js
│   │   ├── location.js
│   │   └── storage.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── utils/
│       └── constants.js
├── App.js
├── app.json
└── package.json
```

---

## Part 4: Get Your Server IP Address

### On Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.0.x.x)

### On Mac/Linux:
```bash
ifconfig
```
Look for "inet" address

**Example:** If your IP is `192.168.1.100`, your API URL will be:
```
http://192.168.1.100:3000/api
```

---

## Part 5: Configure Backend for Mobile Access

### 1. Update CORS in server/index.js

```javascript
// Update CORS configuration to allow mobile app access
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### 2. Make sure your backend is accessible

```bash
# Start your backend server
node server/index.js

# Test from another device on same network
# Open browser and go to: http://YOUR_IP:3000
```

---

## Part 6: Android Setup

### 1. Install Android Studio
- Download from: https://developer.android.com/studio
- Install Android SDK
- Install Android Virtual Device (AVD)

### 2. Set Environment Variables

Add to your system environment variables:
```
ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 3. Configure Android Permissions

Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add these permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:usesCleartextTraffic="true">
      <!-- usesCleartextTraffic allows HTTP connections -->
      
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

---

## Part 7: Build & Run Mobile App

### For Development (with Metro Bundler):

```bash
# Terminal 1: Start Metro Bundler
cd d:/final-apps/apps/MobileApp
npx react-native start

# Terminal 2: Run on Android
npx react-native run-android

# Or run on iOS (Mac only)
npx react-native run-ios
```

### For Production Build:

#### Android APK:
```bash
cd d:/final-apps/apps/MobileApp/android

# Clean build
./gradlew clean

# Build release APK
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

#### Android AAB (for Google Play):
```bash
cd d:/final-apps/apps/MobileApp/android
./gradlew bundleRelease

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## Part 8: Testing Workflow

### 1. Start Backend Server
```bash
cd d:/final-apps/apps
node server/index.js
```

### 2. Start Dashboard (Optional)
```bash
cd d:/final-apps/apps/dashboard
npm run dev
```

### 3. Start Mobile App
```bash
cd d:/final-apps/apps/MobileApp
npx react-native start
# In another terminal:
npx react-native run-android
```

### 4. Test Features:
- [ ] Login with credentials
- [ ] View dashboard
- [ ] View visit list
- [ ] Start visit
- [ ] Check-in with GPS
- [ ] Take photos
- [ ] Update POSM status
- [ ] Check-out
- [ ] Verify data syncs to backend

---

## Part 9: Troubleshooting

### Common Issues:

#### 1. "Unable to connect to development server"
**Solution:**
```bash
# Make sure Metro bundler is running
npx react-native start --reset-cache

# Check if port 8081 is available
netstat -ano | findstr :8081
```

#### 2. "Network request failed"
**Solutions:**
- Check if backend server is running
- Verify API URL has correct IP address
- Make sure phone/emulator is on same network
- Check firewall settings
- Enable `usesCleartextTraffic` in AndroidManifest.xml

#### 3. "Build failed" errors
**Solutions:**
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Metro cache
npx react-native start --reset-cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### 4. Camera/Location not working
**Solution:**
- Check permissions in AndroidManifest.xml
- Request runtime permissions in code
- Test on real device (emulator may not support camera/GPS)

---

## Part 10: Deployment Checklist

### Before Building Production APK:

- [ ] Update API URL to production server
- [ ] Remove console.log statements
- [ ] Test all features thoroughly
- [ ] Generate signing key for Android
- [ ] Update app version in package.json
- [ ] Update app version in android/app/build.gradle
- [ ] Test on multiple devices
- [ ] Optimize images and assets
- [ ] Enable ProGuard (optional)
- [ ] Test offline functionality

### Generate Signing Key (Android):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

---

## Quick Start Script

Save this as `start-mobile.bat`:

```batch
@echo off
echo ========================================
echo Starting Mobile App Development
echo ========================================
echo.

REM Check if MobileApp exists
if not exist "MobileApp\" (
    echo Mobile app not found. Please create it first.
    echo Run: npx react-native init MobileApp
    pause
    exit
)

echo Starting Metro Bundler...
start cmd /k "cd MobileApp && npx react-native start"

timeout /t 5

echo Starting Android App...
start cmd /k "cd MobileApp && npx react-native run-android"

echo.
echo Mobile app is starting...
echo.
pause
```

---

## API Endpoints Used by Mobile App

```
POST   /api/auth/login              - Login
GET    /api/dashboard/my-dashboard  - Get user dashboard
GET    /api/visits/md               - Get MD visits
GET    /api/visits/sales            - Get Sales visits
POST   /api/visit-actions/start     - Start visit
POST   /api/visit-actions/checkin   - Check-in
POST   /api/visit-actions/upload-photo - Upload photo
POST   /api/visit-actions/update-status - Update POSM status
POST   /api/visit-actions/checkout  - Check-out
GET    /api/visit-actions           - Get all actions
```

---

## Next Steps

1. **Create Mobile App Project:**
   ```bash
   cd d:/final-apps/apps
   npx react-native init MobileApp
   ```

2. **Install Dependencies** (see Part 2)

3. **Copy Code Files** (I'll provide these next)

4. **Configure API URL** with your server IP

5. **Run on Android:**
   ```bash
   npx react-native run-android
   ```

6. **Test All Features**

7. **Build Production APK**

---

## Support

- React Native Docs: https://reactnative.dev/docs/getting-started
- Troubleshooting: https://reactnative.dev/docs/troubleshooting
- Android Studio: https://developer.android.com/studio

---

**Ready to start? Let me know if you want me to:**
1. Create the mobile app project structure
2. Generate all the code files
3. Create automated setup scripts
4. Help with specific configuration
