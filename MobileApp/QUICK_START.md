# 🚀 Mobile App Quick Start Guide

## Step 1: Install Dependencies

```bash
cd MobileApp
npm install
```

This will install all required packages (may take 2-3 minutes).

## Step 2: Configure API Connection

1. **Find your computer's IP address:**

   **Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

   **Mac/Linux:**
   ```bash
   ifconfig
   ```
   Look for "inet" address

2. **Update API URL:**

   Open `src/utils/constants.js` and change:
   ```javascript
   const API_URL = 'http://YOUR_IP:3000/api';
   ```
   
   Example:
   ```javascript
   const API_URL = 'http://192.168.1.100:3000/api';
   ```

## Step 3: Start Backend Server

In a separate terminal:
```bash
cd ..
node server/index.js
```

Make sure you see: "Server running on port 3000"

## Step 4: Start Mobile App

```bash
npm start
```

You'll see a QR code in the terminal.

## Step 5: Run on Your Phone

### Option A: Using Expo Go (Easiest)

1. **Install Expo Go:**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Scan QR Code:**
   - Android: Open Expo Go app → Scan QR code
   - iOS: Open Camera app → Scan QR code → Tap notification

3. **Wait for app to load** (first time may take 1-2 minutes)

### Option B: Using Android Emulator

1. **Install Android Studio** (if not installed)
2. **Create an emulator** in Android Studio
3. **Start the emulator**
4. **Run:**
   ```bash
   npm run android
   ```

## Step 6: Login

```
Username: admin-gis
Password: gis2026
```

## ✅ Checklist

Before starting, make sure:

- [ ] Node.js is installed
- [ ] Backend server is running (port 3000)
- [ ] Phone and computer are on same WiFi
- [ ] API_URL is configured with your IP address
- [ ] Expo Go app is installed on phone (for Option A)

## 🎯 Quick Test

After login, try:

1. **View Dashboard** - See your statistics
2. **Go to Visits** - View scheduled visits
3. **Tap a visit** - Start visit action
4. **Check In** - Test GPS functionality
5. **Take Photos** - Test camera
6. **View Reports** - See visit history

## 🐛 Common Issues

### "Unable to connect to server"

**Fix:**
1. Check backend is running: `node server/index.js`
2. Verify IP address in `constants.js`
3. Ensure same WiFi network
4. Try: `http://YOUR_IP:3000/api/health` in browser

### "Network request failed"

**Fix:**
1. Check firewall settings
2. Temporarily disable antivirus
3. Restart backend server
4. Restart mobile app

### QR Code not scanning

**Fix:**
1. Make sure Expo Go is installed
2. Try typing the URL manually in Expo Go
3. Use `npm start --tunnel` for tunnel connection

### App loads but shows blank screen

**Fix:**
1. Check terminal for errors
2. Clear cache: `expo start -c`
3. Reinstall: `rm -rf node_modules && npm install`

## 📱 Development Tips

### Hot Reload
- Shake your phone to open developer menu
- Enable "Fast Refresh" for instant updates

### Debug Mode
- Shake phone → "Debug Remote JS"
- Open Chrome DevTools for debugging

### Clear Cache
```bash
expo start -c
```

### View Logs
- Terminal shows all console.log output
- Shake phone → "Show Performance Monitor"

## 🎉 You're Ready!

Your mobile app is now running and connected to the backend!

**Next Steps:**
- Test all features
- Try offline mode
- Build production APK (see BUILD_MOBILE_APP.md)

**Need Help?**
- Check MobileApp/README.md for detailed docs
- Review API_DOCUMENTATION.md for API details
- Check backend logs for errors

**Happy Testing!** 🚀
