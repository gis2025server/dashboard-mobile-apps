# 🚀 System Startup Guide

## ✅ Current Status

### Backend Server
- **Status**: ✅ RUNNING on port 3000
- **Started**: Successfully initialized
- **Databases**: All 7 databases created and ready
- **Admin User**: Created (admin-gis / gis2026)
- **Excel Upload**: ✅ Ready to use

### Dashboard Frontend
- **Issue**: Node.js version incompatibility
- **Your Version**: Node.js 20.11.0
- **Required**: Node.js 20.19+ or 22.12+
- **Solution Options**: See below

---

## 🎯 Current Working Features

### ✅ Backend API (Fully Functional)
The backend server is running and all Excel upload endpoints are working:

1. **User Upload**: `POST /api/users/upload-excel`
2. **Outlet Upload**: `POST /api/outlets/upload-excel`
3. **MD Visit Upload**: `POST /api/visits/md/upload-excel`
4. **Sales Visit Upload**: `POST /api/visits/sales/upload-excel`

### 📊 Excel Files Ready
Sample Excel files are available in `uploads/excel/`:
- `datauser.xlsx` - User data template
- `dataoutlet.xlsx` - Outlet data template
- `datavisitmd.xlsx` - MD Visit schedule template
- `menulogin.xlsx` - Login menu data

---

## 🔧 Solutions for Dashboard

### Option 1: Upgrade Node.js (Recommended)
**Download and install Node.js 22.x LTS:**
1. Visit: https://nodejs.org/
2. Download Node.js 22.x LTS
3. Install it
4. Restart your terminal
5. Run: `cd dashboard && npm install && npm run dev`

### Option 2: Use Backend API Directly
**Test Excel upload using curl or Postman:**

#### Step 1: Get Authentication Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin-gis\",\"password\":\"gis2026\"}"
```

Save the `token` from the response.

#### Step 2: Upload Excel File
```bash
curl -X POST http://localhost:3000/api/users/upload-excel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@uploads/excel/datauser.xlsx"
```

### Option 3: Use Postman
1. **Login Request:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "admin-gis",
       "password": "gis2026"
     }
     ```
   - Copy the token from response

2. **Upload Excel:**
   - Method: POST
   - URL: `http://localhost:3000/api/users/upload-excel`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body: form-data
   - Key: `file`
   - Value: Select Excel file

### Option 4: Simple HTML Upload Page
I can create a simple HTML page that works without the full dashboard.

---

## 📝 Quick Test with Existing Excel Files

### Test 1: Upload Users
```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin-gis","password":"gis2026"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Upload users
curl -X POST http://localhost:3000/api/users/upload-excel \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@uploads/excel/datauser.xlsx"
```

### Test 2: Upload Outlets
```bash
curl -X POST http://localhost:3000/api/outlets/upload-excel \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@uploads/excel/dataoutlet.xlsx"
```

### Test 3: Upload MD Visits
```bash
curl -X POST http://localhost:3000/api/visits/md/upload-excel \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@uploads/excel/datavisitmd.xlsx"
```

---

## 🌐 API Endpoints Available

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Add user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/upload-excel` - Upload Excel

### Outlets
- `GET /api/outlets` - Get all outlets
- `POST /api/outlets` - Add outlet
- `PUT /api/outlets/:id` - Update outlet
- `DELETE /api/outlets/:id` - Delete outlet
- `POST /api/outlets/upload-excel` - Upload Excel

### Visits (MD)
- `GET /api/visits/md` - Get MD visits
- `POST /api/visits/md` - Add MD visit
- `PUT /api/visits/md/:id` - Update MD visit
- `DELETE /api/visits/md/:id` - Delete MD visit
- `POST /api/visits/md/upload-excel` - Upload Excel

### Visits (Sales)
- `GET /api/visits/sales` - Get Sales visits
- `POST /api/visits/sales` - Add Sales visit
- `PUT /api/visits/sales/:id` - Update Sales visit
- `DELETE /api/visits/sales/:id` - Delete Sales visit
- `POST /api/visits/sales/upload-excel` - Upload Excel

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/recent-activities` - Get recent activities

### Reports
- `GET /api/reports/daily` - Get daily report
- `GET /api/reports/export` - Export to Excel

---

## 📚 Documentation

- **Excel Upload Guide**: See `EXCEL_UPLOAD_GUIDE.md`
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Quick Start**: See `QUICK_START_GUIDE.md`

---

## 🎯 Next Steps

1. **Choose a solution** from the options above
2. **Test Excel upload** using one of the methods
3. **Verify data** by checking the API responses
4. **Upgrade Node.js** for full dashboard access (recommended)

---

## 💡 Temporary Workaround

While you upgrade Node.js, you can:
1. Use the backend API directly via curl/Postman
2. Use a simple HTML upload page (I can create this)
3. Test all Excel upload functionality
4. Verify data is being stored correctly

Would you like me to create a simple HTML upload page that works without the full dashboard?

---

## 🆘 Need Help?

The backend server is fully functional. You can:
- Upload Excel files via API
- Manage all data via API endpoints
- Export reports
- Everything works except the React dashboard UI

**The Excel upload feature is 100% ready to use!** 🎉
