# Build Mobile App - Complete Guide

## 🎯 Choose Your Path

### Option 1: Expo (Recommended for Quick Start) ⭐
**Best for:**
- Quick testing and development
- No Android Studio setup needed initially
- Easy testing on real devices
- Faster development cycle

**Limitations:**
- Slightly larger app size
- Some native modules may not work
- Need Expo Go app for testing

### Option 2: React Native CLI (Full Control)
**Best for:**
- Full native control
- Custom native modules
- Smaller app size
- Production-ready apps

**Requirements:**
- Android Studio setup
- More complex configuration
- Longer setup time

---

## 🚀 Quick Start with Expo (Easiest)

### Step 1: Run Setup Script
```bash
# Run the automated setup
setup-expo-app.bat
```

This will:
- ✅ Install Expo CLI
- ✅ Create MobileApp project
- ✅ Install all dependencies
- ✅ Configure API URL with your IP
- ✅ Set up project structure

### Step 2: Install Expo Go on Your Phone
- **Android:** [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Step 3: Start Backend Server
```bash
# Terminal 1: Start backend
node server/index.js
```

### Step 4: Start Mobile App
```bash
# Terminal 2: Start Expo
cd MobileApp
npm start
```

### Step 5: Test on Your Phone
1. Open Expo Go app
2. Scan the QR code from terminal
3. App will load on your phone
4. Login with: `admin-gis` / `gis2026`

### Step 6: Build APK (When Ready)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
cd MobileApp
eas build:configure

# Build APK
eas build --platform android --profile preview
```

---

## 🔧 Full Setup with React Native CLI

### Step 1: Install Prerequisites

#### Install Java JDK 11
1. Download from: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
2. Install and set JAVA_HOME environment variable

#### Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install Android SDK
3. Install Android Virtual Device (AVD)
4. Set ANDROID_HOME environment variable

### Step 2: Run Setup Script
```bash
# Run the automated setup
setup-mobile-app.bat
```

### Step 3: Configure Android Permissions

Edit `MobileApp/android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add these permissions before <application> tag -->
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
      
      <!-- Rest of application config -->
    </application>
</manifest>
```

### Step 4: Start Development

```bash
# Terminal 1: Start Metro Bundler
cd MobileApp
npx react-native start

# Terminal 2: Run on Android
npx react-native run-android
```

### Step 5: Build Production APK

```bash
cd MobileApp/android

# Clean build
./gradlew clean

# Build release APK
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 📱 Mobile App Code Files

I'll create all the necessary code files for you. The mobile app will have:

### Features:
- ✅ Login screen
- ✅ Dashboard with statistics
- ✅ Visit list (MD & Sales)
- ✅ Start visit functionality
- ✅ GPS check-in/check-out
- ✅ Photo capture (before/after)
- ✅ POSM status update
- ✅ Real-time sync with backend
- ✅ Offline support (basic)

### Screens:
1. **LoginScreen** - User authentication
2. **DashboardScreen** - Overview and statistics
3. **VisitListScreen** - List of scheduled visits
4. **VisitActionScreen** - Perform visit actions
5. **CheckInScreen** - GPS-based check-in
6. **ReportScreen** - View reports

---

## 🔌 Connect Mobile App with Dashboard

### 1. Update Backend CORS

Edit `server/index.js`:

```javascript
// Update CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### 2. Get Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```

### 3. Update API URL in Mobile App

The setup scripts automatically configure this, but you can manually update:

Edit `MobileApp/src/utils/constants.js`:
```javascript
const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
export default API_URL;
```

### 4. Test Connection

1. Start backend: `node server/index.js`
2. Start mobile app
3. Try to login
4. If connection fails, check:
   - Backend is running
   - IP address is correct
   - Phone/emulator on same network
   - Firewall allows port 3000

---

## 🧪 Testing Checklist

### Backend Testing:
- [ ] Backend server running on port 3000
- [ ] Can access http://YOUR_IP:3000 from browser
- [ ] CORS configured correctly
- [ ] All API endpoints working

### Mobile App Testing:
- [ ] App installs successfully
- [ ] Login works
- [ ] Dashboard loads
- [ ] Can view visits
- [ ] GPS check-in works
- [ ] Camera works
- [ ] Photos upload
- [ ] Data syncs to backend
- [ ] Check-out works

### Integration Testing:
- [ ] Data from dashboard appears in mobile
- [ ] Data from mobile appears in dashboard
- [ ] Real-time updates work
- [ ] Photos visible in both platforms
- [ ] Reports show mobile data

---

## 📦 Build Production APK

### Using Expo:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
cd MobileApp
eas build --platform android --profile preview

# Download APK from Expo dashboard
```

### Using React Native CLI:
```bash
cd MobileApp/android

# Generate signing key (first time only)
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Build
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🐛 Troubleshooting

### "Unable to connect to development server"
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Check port 8081
netstat -ano | findstr :8081
```

### "Network request failed"
- Check backend is running
- Verify IP address in constants.js
- Check firewall settings
- Enable usesCleartextTraffic in AndroidManifest.xml

### "Build failed"
```bash
# Clean build
cd android
./gradlew clean
cd ..

# Clear cache
npx react-native start --reset-cache

# Reinstall
rm -rf node_modules
npm install
```

### Camera/GPS not working
- Check permissions in AndroidManifest.xml
- Test on real device (emulator may not support)
- Request runtime permissions

---

## 📊 Comparison: Expo vs React Native CLI

| Feature | Expo | React Native CLI |
|---------|------|------------------|
| Setup Time | 5 minutes | 30+ minutes |
| Android Studio | Not needed | Required |
| Testing | Expo Go app | Emulator/Device |
| Build Process | EAS Build | Gradle |
| App Size | Larger (~50MB) | Smaller (~20MB) |
| Native Modules | Limited | Full access |
| Updates | OTA updates | Manual |
| Best For | Quick start | Production apps |

---

## 🎯 Recommended Workflow

### For Development & Testing:
1. Use **Expo** for quick iteration
2. Test on real device with Expo Go
3. Develop all features
4. Test thoroughly

### For Production:
1. Build with Expo EAS
2. Or migrate to React Native CLI if needed
3. Optimize and test
4. Deploy to Play Store

---

## 📝 Next Steps

### Option A: Quick Start with Expo (Recommended)
```bash
# 1. Run setup
setup-expo-app.bat

# 2. Install Expo Go on phone

# 3. Start backend
node server/index.js

# 4. Start mobile app
cd MobileApp
npm start

# 5. Scan QR code with Expo Go
```

### Option B: Full Setup with React Native CLI
```bash
# 1. Install Android Studio & Java JDK

# 2. Run setup
setup-mobile-app.bat

# 3. Configure Android permissions

# 4. Start backend
node server/index.js

# 5. Start mobile app
cd MobileApp
npx react-native start
npx react-native run-android
```

---

## 🆘 Need Help?

1. Check MOBILE_APP_SETUP_GUIDE.md for detailed instructions
2. See troubleshooting section above
3. Check React Native docs: https://reactnative.dev
4. Check Expo docs: https://docs.expo.dev

---

## ✅ Ready to Build?

Choose your option and run the setup script:
- **Expo (Easy):** `setup-expo-app.bat`
- **React Native CLI (Advanced):** `setup-mobile-app.bat`

After setup completes, I'll provide all the code files for the mobile app!
