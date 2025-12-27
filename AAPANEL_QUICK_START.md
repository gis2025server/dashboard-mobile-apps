# aaPanel Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install aaPanel
1. Download: https://www.aapanel.com/download.html
2. Run installer as Administrator
3. Access: `http://YOUR_SERVER_IP:7800`

### Step 2: Install Node.js
```cmd
# Download from https://nodejs.org/
# Install LTS version (v18 or v20)
# Verify installation:
node --version
npm --version
```

### Step 3: Install PM2
```cmd
npm install -g pm2
```

### Step 4: Deploy Application
```cmd
# Navigate to your application directory
cd C:\wwwroot\dashboard-api

# Copy environment file
copy .env.production.example .env

# Edit .env with your settings
notepad .env

# Install dependencies
npm install

# Start application
start-production.bat
```

### Step 5: Configure Firewall
```cmd
# Open port 3000 (run as Administrator)
netsh advfirewall firewall add rule name="Node.js API" dir=in action=allow protocol=TCP localport=3000
```

### Step 6: Test
Open browser: `http://YOUR_SERVER_IP:3000`

---

## 📝 Important Configuration

### Update .env file:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
CORS_ORIGIN=http://YOUR_SERVER_IP:3000
```

### Update Mobile App:
```javascript
// MobileApp/src/config/environment.js
export const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

### Update Dashboard:
```javascript
// dashboard/src/services/api.js
const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

---

## 🔧 Useful Commands

```cmd
# Start application
start-production.bat

# Stop application
stop-production.bat

# View logs
pm2 logs

# Check status
pm2 status

# Restart application
pm2 restart dashboard-api
```

---

## 🆘 Troubleshooting

### Application won't start?
```cmd
pm2 logs dashboard-api
```

### Can't access from browser?
1. Check firewall (port 3000 open?)
2. Check if app is running: `pm2 status`
3. Check server IP is correct

### Database errors?
```cmd
mkdir databases
mkdir uploads
pm2 restart dashboard-api
```

---

## 📚 Full Documentation

For detailed setup instructions, see: **AAPANEL_SETUP_GUIDE.md**

---

**Default Login**: 
- Username: `admin-gis`
- Password: `gis2026`

⚠️ **Change default password in production!**
