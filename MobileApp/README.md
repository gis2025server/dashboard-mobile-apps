# Dashboard Mobile App

React Native mobile application for the Dashboard & Mobile Apps System.

## 📱 Features

- **User Authentication**: Secure login with JWT tokens
- **Dashboard**: Real-time statistics and overview
- **Visit Management**: View and manage scheduled visits (MD & Sales)
- **GPS Check-in/Check-out**: Location-based visit tracking
- **Photo Documentation**: Before/after photos with camera integration
- **POSM Status Updates**: Track installation status
- **Reports**: View visit history and reports
- **Offline Support**: Store data locally when offline

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- Expo Go app on your phone (from Play Store/App Store)
- Backend server running on your computer

### Installation

1. **Install dependencies:**
   ```bash
   cd MobileApp
   npm install
   ```

2. **Configure API URL:**
   
   Open `src/utils/constants.js` and update the API_URL:
   
   ```javascript
   // Find your computer's IP address using: ipconfig (Windows) or ifconfig (Mac/Linux)
   const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
   // Example: const API_URL = 'http://192.168.1.100:3000/api';
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Run on your phone:**
   - Open Expo Go app on your phone
   - Scan the QR code shown in terminal
   - App will load on your phone

### Login Credentials

```
Username: admin-gis
Password: gis2026
```

## 📂 Project Structure

```
MobileApp/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Navigation setup
    ├── screens/
    │   ├── LoginScreen.js      # Login screen
    │   ├── DashboardScreen.js  # Dashboard with stats
    │   ├── VisitListScreen.js  # List of visits
    │   ├── VisitActionScreen.js # Visit check-in/out
    │   └── ReportScreen.js     # Reports view
    ├── services/
    │   ├── api.js              # API calls
    │   ├── storage.js          # Local storage
    │   └── location.js         # GPS services
    └── utils/
        └── constants.js        # App constants
```

## 🔧 Configuration

### API Connection

The app connects to your backend server. Make sure:

1. Backend server is running: `node server/index.js`
2. Your phone and computer are on the same WiFi network
3. API_URL in `constants.js` uses your computer's IP address

### Permissions

The app requires these permissions:
- **Camera**: For taking before/after photos
- **Location**: For GPS check-in/check-out
- **Storage**: For saving photos

## 📱 Usage

### 1. Login
- Open the app
- Enter username and password
- Tap "Login"

### 2. View Dashboard
- See today's visit statistics
- View recent activities
- Access quick actions

### 3. Manage Visits
- Tap "Visits" tab
- Switch between MD and Sales visits
- Tap a visit to start

### 4. Perform Visit
- **Check In**: Tap "Check In" when at outlet location
- **Take Photos**: Take before and after photos
- **Update Status**: Select POSM status (Terpasang/Outlet Tidak Ada/Toko Tutup)
- **Check Out**: Complete the visit

### 5. View Reports
- Tap "Reports" tab
- Filter by All/Today/This Week
- View visit history and details

## 🛠️ Development

### Run in Development Mode
```bash
npm start
```

### Run on Android Emulator
```bash
npm run android
```

### Run on iOS Simulator (Mac only)
```bash
npm run ios
```

### Build APK for Android
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

## 🐛 Troubleshooting

### Cannot Connect to Server

**Problem**: App shows "Unable to connect to server"

**Solutions**:
1. Check if backend server is running
2. Verify API_URL in `constants.js` has correct IP address
3. Ensure phone and computer are on same WiFi
4. Try disabling firewall temporarily

### Location Not Working

**Problem**: GPS check-in fails

**Solutions**:
1. Grant location permission when prompted
2. Enable location services on your phone
3. Try outdoors for better GPS signal

### Camera Not Working

**Problem**: Cannot take photos

**Solutions**:
1. Grant camera permission when prompted
2. Check if camera works in other apps
3. Restart the app

### App Crashes on Startup

**Solutions**:
1. Clear Expo cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for errors in terminal

## 📊 API Endpoints Used

- `POST /api/auth/login` - User authentication
- `GET /api/dashboard/my-dashboard` - Dashboard data
- `GET /api/visits/md` - MD visits
- `GET /api/visits/sales` - Sales visits
- `POST /api/visit-actions/checkin` - Check in
- `POST /api/visit-actions/upload-photo` - Upload photo
- `POST /api/visit-actions/update-status` - Update POSM status
- `POST /api/visit-actions/checkout` - Check out
- `GET /api/visit-actions` - Get all visit actions

## 🔐 Security

- JWT tokens stored securely in AsyncStorage
- Automatic token refresh on API calls
- Logout clears all stored data
- HTTPS recommended for production

## 📝 Notes

- App requires internet connection for API calls
- Offline mode stores data locally for later sync
- Photos are compressed before upload
- GPS accuracy depends on device and location

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API_DOCUMENTATION.md
3. Check backend server logs
4. Verify network connectivity

## 📄 License

This project is part of the Dashboard & Mobile Apps System.
