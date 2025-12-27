# 🔧 Mobile App Troubleshooting Guide

## Current Issue: Cannot Start Expo

### Problem
You're having trouble starting the Expo development server.

---

## ✅ Solution Steps

### Option 1: Manual Start (Recommended)

1. **Open a NEW terminal/command prompt**
2. **Navigate to MobileApp folder:**
   ```bash
   cd D:\final-apps\apps\MobileApp
   ```

3. **Start Expo:**
   ```bash
   npx expo start
   ```

4. **When prompted:**
   - If asked about port 8081 being used: Press **Y** to use port 8082
   - If asked about dependencies: Press **Y** to continue anyway

5. **You should see:**
   - A QR code in the terminal
   - Text saying "Metro waiting on exp://..."
   - Options to press 'a' for Android, 'w' for web, etc.

---

### Option 2: Use the Batch File

1. **Double-click:** `start-mobile-app.bat`
2. **When prompted about port:** Type **Y** and press Enter
3. **Wait for QR code to appear**

---

### Option 3: Fix Dependencies First

If you keep getting dependency warnings:

1. **Open terminal in MobileApp folder:**
   ```bash
   cd D:\final-apps\apps\MobileApp
   ```

2. **Fix dependencies:**
   ```bash
   npx expo install --fix
   ```

3. **Wait for it to complete (may take 2-3 minutes)**

4. **Then start Expo:**
   ```bash
   npx expo start
   ```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port 8081 Already in Use

**Symptoms:**
- Error: "Port 8081 is being used by another process"
- Prompt: "Use port 8082 instead?"

**Solution:**
- Press **Y** to use port 8082
- OR kill the process using port 8081:
  ```bash
  netstat -ano | findstr :8081
  taskkill /PID <PID_NUMBER> /F
  ```

---

### Issue 2: Dependency Version Warnings

**Symptoms:**
- Warning about react-native version mismatch
- Warning about expo packages version mismatch

**Solution:**
These warnings are usually safe to ignore. The app will still work.

If you want to fix them:
```bash
cd MobileApp
npx expo install --fix
```

---

### Issue 3: Metro Bundler Won't Start

**Symptoms:**
- Stuck at "Starting Metro Bundler"
- No QR code appears

**Solution:**
1. **Clear cache:**
   ```bash
   cd MobileApp
   npx expo start -c
   ```

2. **Or delete cache manually:**
   ```bash
   cd MobileApp
   rmdir /s /q .expo
   rmdir /s /q node_modules\.cache
   npx expo start
   ```

---

### Issue 4: Cannot Connect to Development Server

**Symptoms:**
- App shows "Unable to connect to development server"
- QR code scans but app won't load

**Solution:**
1. **Check both devices on same WiFi**
2. **Try tunnel mode:**
   ```bash
   cd MobileApp
   npx expo start --tunnel
   ```
3. **Check firewall settings** (may need to allow Node.js)

---

### Issue 5: Expo Go App Not Working

**Symptoms:**
- QR code won't scan
- App crashes on phone

**Solution:**
1. **Update Expo Go app** on your phone
2. **Try typing URL manually** in Expo Go:
   - Look for the URL in terminal (exp://192.168.0.43:8081)
   - Type it in Expo Go app
3. **Use tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```

---

## 📱 Step-by-Step: First Time Setup

### On Your Computer:

1. **Open NEW terminal**
2. **Navigate to project:**
   ```bash
   cd D:\final-apps\apps\MobileApp
   ```

3. **Start Expo:**
   ```bash
   npx expo start
   ```

4. **Wait for QR code** (may take 30-60 seconds first time)

### On Your Phone:

1. **Install Expo Go:**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Connect to same WiFi** as your computer

3. **Scan QR code:**
   - Android: Open Expo Go app → Scan QR code
   - iOS: Open Camera app → Point at QR code → Tap notification

4. **Wait for app to load** (first time may take 1-2 minutes)

5. **Login:**
   - Username: admin-gis
   - Password: gis2026

---

## 🔍 Checking If It's Working

### In Terminal, You Should See:

```
Starting Metro Bundler
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █ ██▀▀ ▀▄██ ▄▄▄▄▄ █
█ █   █ █  ▀█ ▀█▄▄█ █   █ █
[... QR code ...]

› Metro waiting on exp://192.168.0.43:8081
› Scan the QR code above with Expo Go

› Press a │ open Android
› Press w │ open web
```

### On Your Phone, You Should See:

1. **Loading screen** with Expo logo
2. **Login screen** with username/password fields
3. **No error messages**

---

## 🆘 Still Not Working?

### Try These Commands in Order:

1. **Clear everything and restart:**
   ```bash
   cd MobileApp
   rmdir /s /q node_modules
   rmdir /s /q .expo
   npm install
   npx expo start -c
   ```

2. **Use tunnel mode (slower but more reliable):**
   ```bash
   cd MobileApp
   npx expo start --tunnel
   ```

3. **Check if backend is running:**
   ```bash
   # In another terminal
   node server/index.js
   ```
   Should show: "Server running on port 3000"

---

## 📞 Quick Reference

### Start Mobile App:
```bash
cd MobileApp
npx expo start
```

### Start with Clear Cache:
```bash
cd MobileApp
npx expo start -c
```

### Start with Tunnel:
```bash
cd MobileApp
npx expo start --tunnel
```

### Fix Dependencies:
```bash
cd MobileApp
npx expo install --fix
```

### Reinstall Everything:
```bash
cd MobileApp
rmdir /s /q node_modules
npm install
```

---

## ✅ Success Checklist

Before testing the app, make sure:

- [ ] Backend server is running (port 3000)
- [ ] Expo is running (shows QR code)
- [ ] Phone has Expo Go installed
- [ ] Phone and computer on same WiFi
- [ ] Firewall allows Node.js connections
- [ ] No error messages in terminal

---

## 🎯 What to Do Right Now

1. **Open a NEW terminal window**
2. **Run these commands:**
   ```bash
   cd D:\final-apps\apps\MobileApp
   npx expo start
   ```
3. **When you see the QR code, scan it with Expo Go app**
4. **If prompted about port, press Y**
5. **Wait for app to load on your phone**

---

## 📝 Notes

- First time startup takes longer (1-2 minutes)
- Dependency warnings are usually safe to ignore
- If stuck, try clearing cache: `npx expo start -c`
- Tunnel mode is slower but more reliable for network issues

---

**Need more help?** Check the terminal output for specific error messages and search for them online or in Expo documentation.

**Good luck!** 🚀
