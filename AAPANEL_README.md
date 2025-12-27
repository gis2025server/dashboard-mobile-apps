# aaPanel Integration for Dashboard & Mobile Apps System

## 📖 Overview

This package includes everything you need to deploy and connect your Dashboard & Mobile Apps System with aaPanel on Windows Server.

## 📦 What's Included

### Configuration Files
- **`ecosystem.config.js`** - PM2 process manager configuration
- **`.env.production.example`** - Production environment template
- **`nginx-config-example.conf`** - Nginx reverse proxy configuration example

### Deployment Scripts
- **`start-production.bat`** - Start the application with PM2
- **`stop-production.bat`** - Stop the application
- **`check-system.bat`** - Verify system requirements
- **`update-client-config.bat`** - Update client configurations with server IP

### Documentation
- **`AAPANEL_SETUP_GUIDE.md`** - Complete setup guide (detailed)
- **`AAPANEL_QUICK_START.md`** - Quick start guide (5 minutes)
- **`DEPLOYMENT_CHECKLIST.md`** - Deployment checklist
- **`AAPANEL_README.md`** - This file

## 🚀 Quick Start

### 1. Install Prerequisites

**Install aaPanel:**
- Download from: https://www.aapanel.com/download.html
- Run installer as Administrator
- Access at: `http://YOUR_SERVER_IP:7800`

**Install Node.js:**
- Download from: https://nodejs.org/
- Install LTS version (v18 or v20)
- Verify: `node --version`

**Install PM2:**
```cmd
npm install -g pm2
```

### 2. Deploy Application

```cmd
# Navigate to application directory
cd C:\wwwroot\dashboard-api

# Run system check
check-system.bat

# Configure environment
copy .env.production.example .env
notepad .env

# Install dependencies
npm install

# Start application
start-production.bat
```

### 3. Configure Firewall

```cmd
# Open port 3000 (run as Administrator)
netsh advfirewall firewall add rule name="Node.js API" dir=in action=allow protocol=TCP localport=3000
```

### 4. Test

Open browser: `http://YOUR_SERVER_IP:3000`

## 📋 System Requirements

- **Operating System**: Windows Server 2012 R2 or later
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: Minimum 20GB free space
- **Node.js**: v18.x or v20.x (LTS)
- **aaPanel**: Latest version

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
CORS_ORIGIN=http://YOUR_SERVER_IP:3000

# Database
DB_PATH=./databases

# Uploads
UPLOAD_PATH=./uploads
EXCEL_UPLOAD_PATH=./uploads/excel
IMAGE_UPLOAD_PATH=./uploads/images

# Sync Schedule
SYNC_SCHEDULE_1=0 12 * * *
SYNC_SCHEDULE_2=0 18 * * *

# Admin
DEFAULT_ADMIN_USERNAME=admin-gis
DEFAULT_ADMIN_PASSWORD=gis2026
```

### Client Configuration

**Mobile App** (`MobileApp/src/config/environment.js`):
```javascript
export const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

**Dashboard** (`dashboard/src/services/api.js`):
```javascript
const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

**Quick Update**: Run `update-client-config.bat` to automatically update all client configurations.

## 📁 Directory Structure

```
C:\wwwroot\dashboard-api\
├── server/                 # Backend server code
├── dashboard/              # React dashboard
├── MobileApp/              # React Native mobile app
├── databases/              # SQLite databases
├── uploads/                # Uploaded files
│   ├── excel/             # Excel files
│   └── images/            # Image files
├── logs/                   # Application logs
├── ecosystem.config.js     # PM2 configuration
├── .env                    # Environment variables
└── start-production.bat    # Startup script
```

## 🔌 API Endpoints

Base URL: `http://YOUR_SERVER_IP:3000/api`

### Authentication
- `POST /auth/login` - User login
- `POST /auth/users` - Add user (admin)
- `PUT /auth/users/:id` - Edit user (admin)
- `DELETE /auth/users/:id` - Delete user (admin)

### Users
- `GET /users` - Get all users
- `POST /users/upload-excel` - Bulk upload (admin)

### Outlets
- `GET /outlets` - Get all outlets
- `POST /outlets/upload-excel` - Bulk upload (admin)

### Visits
- `GET /visits/md` - Get MD visits
- `GET /visits/sales` - Get Sales visits
- `POST /visits/md/upload-excel` - Bulk upload (admin)

### Visit Actions
- `POST /visit-actions/start` - Start visit
- `POST /visit-actions/checkin` - Check-in with GPS
- `POST /visit-actions/upload-photo` - Upload photo
- `POST /visit-actions/checkout` - Check-out

### Dashboard
- `GET /dashboard/stats` - Global statistics (admin)
- `GET /dashboard/my-dashboard` - User dashboard

### Reports
- `GET /reports/daily` - Daily report
- `GET /reports/export` - Export to Excel

## 🛠️ Management Commands

### Application Management
```cmd
# Start application
start-production.bat

# Stop application
stop-production.bat

# Check system requirements
check-system.bat

# Update client configurations
update-client-config.bat
```

### PM2 Commands
```cmd
# View status
pm2 status

# View logs
pm2 logs dashboard-api

# Restart application
pm2 restart dashboard-api

# Monitor resources
pm2 monit

# Stop application
pm2 stop dashboard-api

# Delete from PM2
pm2 delete dashboard-api
```

### Troubleshooting Commands
```cmd
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Check Node.js version
node --version

# Check PM2 version
pm2 --version

# View application logs
pm2 logs dashboard-api --lines 100

# Clear PM2 logs
pm2 flush
```

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Configure CORS properly (not `*`)
- [ ] Enable Windows Firewall
- [ ] Only open necessary ports
- [ ] Keep Node.js and packages updated
- [ ] Regular security audits: `npm audit`
- [ ] Regular backups of database and uploads

## 📊 Monitoring

### PM2 Monitoring
```cmd
# Real-time monitoring
pm2 monit

# Check status
pm2 status

# View logs
pm2 logs
```

### aaPanel Monitoring
- Go to aaPanel > Monitor
- Enable system monitoring
- Set up alerts for CPU, Memory, Disk usage

### Log Files
- **Application logs**: `logs/api-out.log`, `logs/api-error.log`
- **Nginx logs**: `logs/nginx-access.log`, `logs/nginx-error.log`
- **PM2 logs**: `~/.pm2/logs/`

## 🔄 Backup Strategy

### Database Backup
```cmd
# Manual backup
copy databases\*.db C:\backups\dashboard-api\

# Or use aaPanel backup feature
# Files > Select databases folder > Compress > Download
```

### Automated Backup (Optional)
Create a scheduled task in Windows:
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., daily at 2 AM)
4. Action: Start a program
5. Program: `xcopy`
6. Arguments: `C:\wwwroot\dashboard-api\databases C:\backups\dashboard-api\%date% /E /I /Y`

## 🆘 Troubleshooting

### Application Won't Start
```cmd
# Check logs
pm2 logs dashboard-api

# Check if port is in use
netstat -ano | findstr :3000

# Restart application
pm2 restart dashboard-api
```

### Cannot Access API
1. Check firewall (port 3000 open?)
2. Check if application is running: `pm2 status`
3. Check server IP is correct
4. Check CORS configuration in `.env`

### Database Errors
```cmd
# Ensure directories exist
mkdir databases
mkdir uploads

# Check permissions
# Right-click folder > Properties > Security
# Ensure "Users" have Read & Write

# Restart application
pm2 restart dashboard-api
```

### Upload Errors
```cmd
# Create upload directories
mkdir uploads\excel
mkdir uploads\images

# Check permissions
# Ensure "Users" have Read & Write

# Restart application
pm2 restart dashboard-api
```

## 📚 Documentation Links

- **Complete Setup Guide**: `AAPANEL_SETUP_GUIDE.md`
- **Quick Start Guide**: `AAPANEL_QUICK_START.md`
- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Main README**: `README.md`
- **API Documentation**: `API_DOCUMENTATION.md`

## 🔗 External Resources

- **aaPanel**: https://www.aapanel.com/
- **aaPanel Documentation**: https://doc.aapanel.com/
- **Node.js**: https://nodejs.org/
- **PM2**: https://pm2.keymetrics.io/
- **Express.js**: https://expressjs.com/

## 📞 Support

### Common Issues
See `AAPANEL_SETUP_GUIDE.md` > Troubleshooting section

### Getting Help
1. Check application logs: `pm2 logs dashboard-api`
2. Review documentation files
3. Check aaPanel documentation
4. Contact system administrator

## ✅ Deployment Checklist

Use `DEPLOYMENT_CHECKLIST.md` for a complete deployment checklist.

Quick checklist:
- [ ] aaPanel installed
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Application deployed
- [ ] .env configured
- [ ] Firewall configured
- [ ] Application started
- [ ] API tested
- [ ] Clients configured
- [ ] Monitoring enabled

## 🎉 Success!

Once deployed, your application will be accessible at:
- **API**: `http://YOUR_SERVER_IP:3000`
- **aaPanel**: `http://YOUR_SERVER_IP:7800`

**Default Login**:
- Username: `admin-gis`
- Password: `gis2026`

⚠️ **Remember to change the default password!**

---

## 📝 Version History

- **v1.0.0** - Initial aaPanel integration package
  - PM2 configuration
  - Deployment scripts
  - Complete documentation
  - Nginx configuration example

---

**Built with ❤️ for aaPanel Windows Server**

For detailed instructions, see **AAPANEL_SETUP_GUIDE.md**
