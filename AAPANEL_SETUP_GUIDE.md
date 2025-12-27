# aaPanel Setup Guide for Dashboard & Mobile Apps System

This guide will help you deploy and connect your Dashboard & Mobile Apps System with aaPanel on Windows Server.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [aaPanel Installation](#aapanel-installation)
3. [Node.js Setup](#nodejs-setup)
4. [Application Deployment](#application-deployment)
5. [Reverse Proxy Configuration](#reverse-proxy-configuration)
6. [PM2 Process Manager Setup](#pm2-process-manager-setup)
7. [Testing the Setup](#testing-the-setup)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## 📋 Prerequisites

Before starting, ensure you have:
- Windows Server (2012 R2 or later recommended)
- Administrator access to the server
- At least 2GB RAM and 20GB disk space
- Internet connection for downloading packages

---

## 🔧 aaPanel Installation

### Step 1: Download and Install aaPanel

1. **Download aaPanel for Windows**:
   - Visit: https://www.aapanel.com/download.html
   - Download the Windows version
   - Or use direct link: https://download.aapanel.com/install/aaPanel_setup.exe

2. **Install aaPanel**:
   ```cmd
   # Run the installer as Administrator
   # Follow the installation wizard
   # Default installation path: C:\BtSoft
   ```

3. **Access aaPanel**:
   - After installation, aaPanel will provide access URL
   - Default: `http://YOUR_SERVER_IP:7800`
   - Note down the username and password shown during installation

4. **Initial Setup**:
   - Login to aaPanel web interface
   - Complete the initial setup wizard
   - Install recommended software stack (if prompted)

---

## 📦 Node.js Setup

### Step 2: Install Node.js via aaPanel

1. **Login to aaPanel Dashboard**

2. **Navigate to App Store**:
   - Click on "App Store" in the left sidebar
   - Search for "Node.js"
   - Click "Install"

3. **Or Install Node.js Manually**:
   
   If Node.js is not available in aaPanel App Store:
   
   ```cmd
   # Download Node.js LTS for Windows
   # Visit: https://nodejs.org/
   # Download and install the Windows Installer (.msi)
   # Choose LTS version (v18.x or v20.x recommended)
   ```

4. **Verify Node.js Installation**:
   ```cmd
   node --version
   npm --version
   ```

5. **Install PM2 Process Manager**:
   ```cmd
   npm install -g pm2
   pm2 --version
   ```

---

## 🚀 Application Deployment

### Step 3: Deploy Your Application

1. **Create Website in aaPanel**:
   - Go to "Website" in aaPanel
   - Click "Add Site"
   - Fill in the details:
     - **Domain**: Your server IP (e.g., 192.168.1.100) or leave blank
     - **Root Directory**: Choose a directory (e.g., `C:\wwwroot\dashboard-api`)
     - **PHP Version**: Not needed (select "Pure Static")
   - Click "Submit"

2. **Upload Your Application**:
   
   **Option A: Using aaPanel File Manager**:
   - Go to "Files" in aaPanel
   - Navigate to your website directory (e.g., `C:\wwwroot\dashboard-api`)
   - Upload your application files (zip and extract)
   
   **Option B: Using FTP**:
   - Enable FTP in aaPanel (Website > FTP)
   - Use FileZilla or WinSCP to upload files
   
   **Option C: Using Git** (Recommended):
   ```cmd
   cd C:\wwwroot
   git clone <your-repository-url> dashboard-api
   cd dashboard-api
   ```

3. **Configure Environment Variables**:
   ```cmd
   cd C:\wwwroot\dashboard-api
   
   # Copy the example environment file
   copy .env.production.example .env
   
   # Edit .env file with your configuration
   notepad .env
   ```

   **Important**: Update these values in `.env`:
   ```env
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   CORS_ORIGIN=http://YOUR_SERVER_IP:3000
   ```

4. **Install Dependencies**:
   ```cmd
   cd C:\wwwroot\dashboard-api
   npm install
   ```

5. **Create Required Directories**:
   ```cmd
   mkdir databases
   mkdir uploads
   mkdir uploads\excel
   mkdir uploads\images
   mkdir logs
   ```

---

## 🔄 Reverse Proxy Configuration

### Step 4: Setup Nginx Reverse Proxy in aaPanel

1. **Install Nginx** (if not already installed):
   - Go to "App Store" in aaPanel
   - Search for "Nginx"
   - Click "Install"

2. **Configure Reverse Proxy**:
   
   - Go to "Website" in aaPanel
   - Find your site and click "Settings"
   - Go to "Reverse Proxy" tab
   - Click "Add Reverse Proxy"
   
   **Configuration**:
   ```
   Proxy Name: Dashboard API
   Target URL: http://127.0.0.1:3000
   Send Domain: $host
   ```

3. **Or Manually Edit Nginx Config**:
   
   - Go to "Website" > "Settings" > "Config File"
   - Add this configuration:
   
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
       
       # WebSocket support
       proxy_read_timeout 86400;
   }
   
   # Serve static files directly
   location /uploads {
       alias C:/wwwroot/dashboard-api/uploads;
       expires 30d;
       add_header Cache-Control "public, immutable";
   }
   ```

4. **Save and Reload Nginx**:
   - Click "Save"
   - Reload Nginx configuration

---

## 🔧 PM2 Process Manager Setup

### Step 5: Start Application with PM2

1. **Navigate to Application Directory**:
   ```cmd
   cd C:\wwwroot\dashboard-api
   ```

2. **Start Application Using the Provided Script**:
   ```cmd
   start-production.bat
   ```
   
   This script will:
   - Check if Node.js and PM2 are installed
   - Create .env file if it doesn't exist
   - Install dependencies
   - Start the application with PM2
   - Show application status

3. **Or Start Manually with PM2**:
   ```cmd
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Verify Application is Running**:
   ```cmd
   pm2 status
   pm2 logs dashboard-api
   ```

5. **Configure PM2 to Start on Boot**:
   ```cmd
   pm2 startup
   # Follow the instructions shown
   pm2 save
   ```

---

## ✅ Testing the Setup

### Step 6: Test Your Application

1. **Test API Directly**:
   ```cmd
   # Open browser or use curl
   http://YOUR_SERVER_IP:3000
   ```
   
   You should see:
   ```json
   {
     "success": true,
     "message": "Dashboard & Mobile Apps API Server",
     "version": "1.0.0"
   }
   ```

2. **Test Through Nginx** (if configured):
   ```cmd
   http://YOUR_SERVER_IP
   ```

3. **Test API Endpoints**:
   ```cmd
   # Test login endpoint
   curl -X POST http://YOUR_SERVER_IP:3000/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"username\":\"admin-gis\",\"password\":\"gis2026\"}"
   ```

4. **Test from Mobile App**:
   - Update mobile app configuration:
   ```javascript
   // MobileApp/src/config/environment.js
   export const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
   ```

5. **Test from Dashboard**:
   - Update dashboard configuration:
   ```javascript
   // dashboard/src/services/api.js
   const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
   ```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Application Won't Start

**Symptoms**: PM2 shows app as "errored" or "stopped"

**Solutions**:
```cmd
# Check logs
pm2 logs dashboard-api

# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Kill process using port 3000 (if needed)
taskkill /PID <PID> /F

# Restart application
pm2 restart dashboard-api
```

#### Issue 2: Cannot Access API

**Symptoms**: Connection refused or timeout

**Solutions**:
1. **Check Windows Firewall**:
   ```cmd
   # Open Windows Firewall
   # Add inbound rule for port 3000
   # Or run as Administrator:
   netsh advfirewall firewall add rule name="Node.js API" dir=in action=allow protocol=TCP localport=3000
   ```

2. **Check if application is running**:
   ```cmd
   pm2 status
   ```

3. **Check Nginx is running** (if using reverse proxy):
   - Go to aaPanel > "App Store" > "Nginx" > Check status

#### Issue 3: Database Errors

**Symptoms**: "Database not found" or "SQLITE_CANTOPEN"

**Solutions**:
```cmd
# Ensure databases directory exists
cd C:\wwwroot\dashboard-api
mkdir databases

# Check permissions
# Right-click databases folder > Properties > Security
# Ensure "Users" have Read & Write permissions

# Restart application
pm2 restart dashboard-api
```

#### Issue 4: Upload Errors

**Symptoms**: "Cannot upload files" or "ENOENT: no such file or directory"

**Solutions**:
```cmd
# Create upload directories
cd C:\wwwroot\dashboard-api
mkdir uploads
mkdir uploads\excel
mkdir uploads\images

# Check permissions
# Ensure "Users" have Read & Write permissions

# Restart application
pm2 restart dashboard-api
```

#### Issue 5: CORS Errors

**Symptoms**: "Access-Control-Allow-Origin" errors in browser console

**Solutions**:
1. Update `.env` file:
   ```env
   CORS_ORIGIN=http://YOUR_SERVER_IP:3000
   # Or allow all (not recommended for production)
   CORS_ORIGIN=*
   ```

2. Restart application:
   ```cmd
   pm2 restart dashboard-api
   ```

#### Issue 6: PM2 Not Starting on Boot

**Solutions**:
```cmd
# Remove existing startup configuration
pm2 unstartup

# Create new startup configuration
pm2 startup

# Follow the instructions shown
# Then save PM2 process list
pm2 save
```

---

## 🔧 Maintenance

### Regular Maintenance Tasks

#### 1. View Application Logs
```cmd
# View all logs
pm2 logs

# View specific app logs
pm2 logs dashboard-api

# View last 100 lines
pm2 logs dashboard-api --lines 100

# Clear logs
pm2 flush
```

#### 2. Monitor Application
```cmd
# Real-time monitoring
pm2 monit

# Check status
pm2 status

# Check resource usage
pm2 list
```

#### 3. Restart Application
```cmd
# Restart specific app
pm2 restart dashboard-api

# Restart all apps
pm2 restart all

# Reload with zero-downtime
pm2 reload dashboard-api
```

#### 4. Update Application
```cmd
cd C:\wwwroot\dashboard-api

# Pull latest changes (if using Git)
git pull

# Install new dependencies
npm install

# Restart application
pm2 restart dashboard-api
```

#### 5. Backup Database
```cmd
# Create backup directory
mkdir C:\backups\dashboard-api

# Copy database
copy C:\wwwroot\dashboard-api\databases\*.db C:\backups\dashboard-api\

# Or use aaPanel backup feature
# Go to "Files" > Select databases folder > "Compress" > Download
```

#### 6. Check Disk Space
```cmd
# Check disk usage
dir C:\wwwroot\dashboard-api /s

# Clean old logs
pm2 flush

# Clean old uploads (if needed)
# Manually delete old files from uploads folder
```

#### 7. Update Node.js and PM2
```cmd
# Update PM2
npm install -g pm2@latest

# Update PM2 in-memory
pm2 update

# Check versions
node --version
npm --version
pm2 --version
```

---

## 📊 Monitoring and Alerts

### Setup Monitoring in aaPanel

1. **Enable Monitoring**:
   - Go to aaPanel > "Monitor"
   - Enable system monitoring
   - Set up alerts for:
     - CPU usage > 80%
     - Memory usage > 80%
     - Disk usage > 90%

2. **PM2 Monitoring**:
   ```cmd
   # Install PM2 monitoring module
   pm2 install pm2-logrotate
   
   # Configure log rotation
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

---

## 🔐 Security Best Practices

1. **Change Default Credentials**:
   - Update `DEFAULT_ADMIN_PASSWORD` in `.env`
   - Change aaPanel admin password

2. **Use Strong JWT Secret**:
   - Generate a strong JWT secret (min 32 characters)
   - Update `JWT_SECRET` in `.env`

3. **Configure Firewall**:
   - Only open necessary ports (3000, 7800 for aaPanel)
   - Block all other incoming connections

4. **Regular Updates**:
   - Keep Node.js updated
   - Keep npm packages updated
   - Keep aaPanel updated

5. **Enable HTTPS** (Optional for future):
   - Obtain SSL certificate
   - Configure in aaPanel
   - Update CORS_ORIGIN to use https://

---

## 📞 Support

### Useful Commands Reference

```cmd
# Application Management
pm2 start ecosystem.config.js    # Start application
pm2 stop dashboard-api            # Stop application
pm2 restart dashboard-api         # Restart application
pm2 delete dashboard-api          # Remove from PM2
pm2 logs dashboard-api            # View logs
pm2 monit                         # Monitor resources

# System Information
node --version                    # Check Node.js version
npm --version                     # Check npm version
pm2 --version                     # Check PM2 version

# Network
netstat -ano | findstr :3000      # Check port 3000 usage
ipconfig                          # Get server IP address

# Firewall
netsh advfirewall firewall show rule name=all  # List firewall rules
```

### Getting Help

- **aaPanel Documentation**: https://doc.aapanel.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Node.js Documentation**: https://nodejs.org/docs/

---

## ✅ Quick Start Checklist

- [ ] aaPanel installed and accessible
- [ ] Node.js installed (v18+ recommended)
- [ ] PM2 installed globally
- [ ] Application files uploaded to server
- [ ] `.env` file configured with correct values
- [ ] Dependencies installed (`npm install`)
- [ ] Required directories created (databases, uploads, logs)
- [ ] Application started with PM2
- [ ] Firewall configured (port 3000 open)
- [ ] Nginx reverse proxy configured (optional)
- [ ] Application accessible via browser
- [ ] API endpoints tested and working
- [ ] PM2 configured to start on boot
- [ ] Backup strategy in place

---

## 🎉 Congratulations!

Your Dashboard & Mobile Apps System is now successfully deployed and connected with aaPanel!

**Access Points**:
- **API Server**: `http://YOUR_SERVER_IP:3000`
- **aaPanel**: `http://YOUR_SERVER_IP:7800`
- **Default Login**: username: `admin-gis`, password: `gis2026`

**Next Steps**:
1. Update mobile app to use server IP
2. Build and deploy dashboard frontend
3. Test all features thoroughly
4. Set up regular backups
5. Monitor application performance

---

**Built with ❤️ for aaPanel Windows Server**
