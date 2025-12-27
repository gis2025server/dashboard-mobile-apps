# aaPanel Deployment Checklist

Use this checklist to ensure your application is properly deployed and configured with aaPanel.

## 📋 Pre-Deployment

- [ ] aaPanel installed and accessible at `http://YOUR_SERVER_IP:7800`
- [ ] aaPanel admin credentials saved securely
- [ ] Server has at least 2GB RAM and 20GB disk space
- [ ] Windows Server is up to date
- [ ] Administrator access available

## 🔧 Software Installation

- [ ] Node.js installed (v18+ recommended)
  - [ ] Verify: `node --version`
  - [ ] Verify: `npm --version`
- [ ] PM2 installed globally
  - [ ] Install: `npm install -g pm2`
  - [ ] Verify: `pm2 --version`
- [ ] Git installed (optional, for version control)
  - [ ] Verify: `git --version`

## 📁 Application Setup

- [ ] Application files uploaded to server
  - [ ] Location: `C:\wwwroot\dashboard-api` (or your chosen directory)
- [ ] `.env` file created and configured
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET` set (min 32 characters)
  - [ ] `CORS_ORIGIN` set to your server IP
  - [ ] `DEFAULT_ADMIN_PASSWORD` changed from default
- [ ] Dependencies installed
  - [ ] Run: `npm install`
  - [ ] Verify: `node_modules` directory exists
- [ ] Required directories created
  - [ ] `databases` directory exists
  - [ ] `uploads` directory exists
  - [ ] `uploads\excel` directory exists
  - [ ] `uploads\images` directory exists
  - [ ] `logs` directory exists

## 🔥 Firewall Configuration

- [ ] Port 3000 opened in Windows Firewall
  - [ ] Run: `netsh advfirewall firewall add rule name="Node.js API" dir=in action=allow protocol=TCP localport=3000`
- [ ] Port 7800 opened for aaPanel (if accessing remotely)
- [ ] Other necessary ports opened (if any)

## 🚀 Application Deployment

- [ ] Application started with PM2
  - [ ] Run: `start-production.bat`
  - [ ] Or: `pm2 start ecosystem.config.js`
- [ ] Application status verified
  - [ ] Run: `pm2 status`
  - [ ] Status shows "online"
- [ ] Application logs checked
  - [ ] Run: `pm2 logs dashboard-api`
  - [ ] No critical errors shown
- [ ] PM2 configured to start on boot
  - [ ] Run: `pm2 startup`
  - [ ] Run: `pm2 save`

## 🌐 Nginx Configuration (Optional)

- [ ] Nginx installed in aaPanel
- [ ] Website created in aaPanel
- [ ] Reverse proxy configured
  - [ ] Target: `http://127.0.0.1:3000`
- [ ] Nginx configuration tested
  - [ ] Run: `nginx -t` (in aaPanel terminal)
- [ ] Nginx reloaded
  - [ ] In aaPanel: App Store > Nginx > Reload

## ✅ Testing

- [ ] API accessible directly
  - [ ] Test: `http://YOUR_SERVER_IP:3000`
  - [ ] Should show API welcome message
- [ ] API accessible through Nginx (if configured)
  - [ ] Test: `http://YOUR_SERVER_IP`
- [ ] Login endpoint working
  - [ ] Test: POST to `/api/auth/login`
  - [ ] Default credentials work
- [ ] File uploads working
  - [ ] Test: Upload a file through API
  - [ ] File saved in `uploads` directory
- [ ] Database operations working
  - [ ] Test: Create/Read/Update/Delete operations
  - [ ] Database file created in `databases` directory
- [ ] WebSocket connection working
  - [ ] Test: Real-time sync features
  - [ ] Socket.IO connection established

## 📱 Client Configuration

- [ ] Mobile app configured
  - [ ] `API_BASE_URL` updated to server IP
  - [ ] File: `MobileApp/src/config/environment.js`
  - [ ] Format: `http://YOUR_SERVER_IP:3000/api`
- [ ] Dashboard configured
  - [ ] `API_BASE_URL` updated to server IP
  - [ ] File: `dashboard/src/services/api.js`
  - [ ] Format: `http://YOUR_SERVER_IP:3000/api`
- [ ] Mobile app tested
  - [ ] Login works
  - [ ] Data sync works
  - [ ] GPS tracking works
  - [ ] Photo upload works
- [ ] Dashboard tested
  - [ ] Login works
  - [ ] All pages load correctly
  - [ ] Charts display data
  - [ ] Excel upload works

## 🔐 Security

- [ ] Default admin password changed
  - [ ] Update in `.env` file
  - [ ] Update in database
- [ ] JWT secret is strong and unique
  - [ ] Minimum 32 characters
  - [ ] Random and complex
- [ ] CORS configured properly
  - [ ] Not set to `*` in production
  - [ ] Set to specific origin
- [ ] File upload limits configured
  - [ ] `MAX_FILE_SIZE` set appropriately
  - [ ] `MAX_FILES` set appropriately
- [ ] Rate limiting enabled
  - [ ] Check middleware configuration
- [ ] Sensitive files protected
  - [ ] `.env` not accessible via web
  - [ ] Database files not accessible via web

## 📊 Monitoring

- [ ] PM2 monitoring enabled
  - [ ] Run: `pm2 monit`
- [ ] Log rotation configured
  - [ ] Run: `pm2 install pm2-logrotate`
- [ ] aaPanel monitoring enabled
  - [ ] System monitoring active
  - [ ] Alerts configured
- [ ] Backup strategy in place
  - [ ] Database backup scheduled
  - [ ] Application files backup scheduled
  - [ ] Backup location defined

## 📝 Documentation

- [ ] Server IP address documented
- [ ] Admin credentials documented (securely)
- [ ] API endpoints documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available
- [ ] Team members trained

## 🔄 Post-Deployment

- [ ] Application running for 24 hours without issues
- [ ] All features tested in production
- [ ] Performance acceptable
- [ ] No memory leaks detected
- [ ] Logs reviewed for errors
- [ ] Backup tested and verified
- [ ] Rollback plan prepared
- [ ] Monitoring alerts working

## 📞 Support Information

- [ ] Support contact information documented
- [ ] Escalation process defined
- [ ] Emergency procedures documented
- [ ] Maintenance window scheduled

---

## ✅ Sign-off

**Deployed by**: ___________________  
**Date**: ___________________  
**Verified by**: ___________________  
**Date**: ___________________  

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🆘 Quick Troubleshooting

If something goes wrong:

1. **Check application status**: `pm2 status`
2. **Check logs**: `pm2 logs dashboard-api`
3. **Restart application**: `pm2 restart dashboard-api`
4. **Check system**: Run `check-system.bat`
5. **Review documentation**: See `AAPANEL_SETUP_GUIDE.md`

---

**Keep this checklist for future deployments and updates!**
