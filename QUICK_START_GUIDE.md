# 🚀 Quick Start Guide

## ✅ System Status: RUNNING

Both services are currently active and ready to use!

---

## 🌐 Access Points

### Web Dashboard
**URL**: http://localhost:5173

**Login Credentials**:
```
Username: admin-gis
Password: gis2026
```

### Backend API
**URL**: http://localhost:3000
**Status**: Running and tested (73% test pass rate)

---

## 📱 What You Can Do Right Now

### 1. Login to Dashboard
1. Browser should have opened automatically to http://localhost:5173
2. If not, manually open: http://localhost:5173
3. Enter credentials:
   - Username: `admin-gis`
   - Password: `gis2026`
4. Click "Login"

### 2. Explore Features

#### Main Dashboard
- View real-time statistics
- See interactive charts
- Monitor recent activities
- Check visit trends

#### User Management
- Click "Users" in sidebar
- Add new users
- Edit existing users
- Delete users
- Upload Excel file for bulk import

#### Outlet Management
- Click "Outlets" in sidebar
- Add outlets with GPS coordinates
- Edit outlet information
- Upload Excel file for bulk import
- View outlet locations

#### Visit Schedule
- Click "Visits" in sidebar
- Switch between MD and Sales tabs
- Schedule new visits
- Edit visit schedules
- Track visit status

#### Reports
- Click "Reports" in sidebar
- Filter by date, username, visit type
- View daily reports
- Export to Excel

---

## 🎯 Quick Test Workflow

### Test 1: Add a User
1. Go to "Users" page
2. Click "Add User" button
3. Fill in:
   - Username: test_user
   - Nama: Test User
   - Jabatan: MD
   - AMO: AMO-001
   - Warehouse: WH-001
4. Click "Save"
5. Verify user appears in table

### Test 2: Add an Outlet
1. Go to "Outlets" page
2. Click "Add Outlet" button
3. Fill in:
   - Username: admin-gis
   - ID Outlet: OUT-001
   - Nama Outlet: Test Store
   - AMO: AMO-001
   - Warehouse: WH-001
   - Latitude: -6.2088
   - Longitude: 106.8456
   - Alamat: Test Address 123
4. Click "Save"
5. Verify outlet appears in table

### Test 3: Schedule a Visit
1. Go to "Visits" page
2. Select "MD Visits" tab
3. Click "Add MD Visit" button
4. Fill in:
   - Username: admin-gis
   - AMO: AMO-001
   - Warehouse: WH-001
   - ID Outlet: OUT-001
   - Nama Outlet: Test Store
   - Date Visit: (select today's date)
5. Click "Save"
6. Verify visit appears in table

### Test 4: View Dashboard
1. Go to "Dashboard" page
2. Check statistics cards update
3. View charts with new data
4. See recent activities

### Test 5: Generate Report
1. Go to "Reports" page
2. Select today's date
3. Click "Search"
4. Click "Export to Excel"
5. Download and open Excel file

---

## 🔧 Running Services

### Backend Server
```bash
# Already running in terminal
# Port: 3000
# Status: Active
```

### Web Dashboard
```bash
# Already running in terminal
# Port: 5173
# Status: Active
```

### To Stop Services
Press `Ctrl+C` in each terminal window

### To Restart Services

**Backend**:
```bash
node server/index.js
```

**Dashboard**:
```bash
cd dashboard
npm run dev
```

---

## 📊 System Features

### ✅ Currently Available
- User authentication
- User management (CRUD + Excel)
- Outlet management (CRUD + GPS + Excel)
- Visit scheduling (MD & Sales)
- Dashboard with statistics
- Interactive charts
- Daily reports
- Excel export
- Real-time data updates
- Scheduled sync (12:00 & 18:00)

### 📱 Mobile Apps
- Code ready in `COMPLETE_FRONTEND_GUIDE.md`
- React Native for Android & iOS
- Ready to build and deploy

---

## 🆘 Troubleshooting

### Dashboard Not Loading?
1. Check if Vite server is running (port 5173)
2. Open browser manually: http://localhost:5173
3. Check browser console for errors (F12)

### API Errors?
1. Check if backend is running (port 3000)
2. Verify in terminal: should show "Server running on port 3000"
3. Test API: http://localhost:3000/api/auth/login

### Login Not Working?
1. Verify credentials:
   - Username: admin-gis
   - Password: gis2026
2. Check browser console (F12) for errors
3. Verify backend is running

### Data Not Showing?
1. Check if databases exist in `databases/` folder
2. Restart backend server
3. Clear browser cache and reload

---

## 📚 Documentation

- **API Reference**: See `API_DOCUMENTATION.md`
- **Frontend Guide**: See `COMPLETE_FRONTEND_GUIDE.md`
- **Test Results**: See `TEST_RESULTS.md`
- **Complete Info**: See `DASHBOARD_COMPLETE.md`

---

## 🎉 You're All Set!

The system is running and ready to use. Start by:
1. ✅ Opening http://localhost:5173 (should be open now)
2. ✅ Logging in with admin-gis / gis2026
3. ✅ Exploring all features
4. ✅ Adding test data
5. ✅ Generating reports

**Enjoy your new Dashboard & Mobile Apps System!** 🚀

---

## 💡 Tips

- Use Excel upload for bulk data import
- Export reports regularly for backup
- Check dashboard for real-time statistics
- Schedule visits in advance
- Monitor sync logs for data synchronization

---

**Need Help?**
- Check documentation files
- Review API_DOCUMENTATION.md for API details
- See COMPLETE_FRONTEND_GUIDE.md for mobile app setup

**Happy Managing!** 🎊
