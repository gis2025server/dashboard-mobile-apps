# 📊 Excel Upload Guide

## Overview
The dashboard system supports bulk data import via Excel files (.xlsx, .xls) for Users, Outlets, MD Visits, and Sales Visits.

## ✅ System Status

### Backend Server
- **Status**: ✅ Running on port 3000
- **Excel Upload Endpoints**: Active and ready
- **Upload Directory**: `uploads/excel/`

### Sample Excel Files Available
The following sample Excel files are already in the `uploads/excel/` folder:
- `datauser.xlsx` - User data template
- `dataoutlet.xlsx` - Outlet data template  
- `datavisitmd.xlsx` - MD Visit data template
- `menulogin.xlsx` - Login menu data

---

## 📋 Excel File Formats

### 1. User Data (datauser.xlsx)
**Columns Required:**
| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| username | User's username | Yes | john_doe |
| nama | Full name | Yes | John Doe |
| jabatan | Position/Role | No | MD |
| amo | AMO code | No | AMO-001 |
| warehouse | Warehouse code | No | WH-001 |

**Example:**
```
username    | nama      | jabatan | amo     | warehouse
john_doe    | John Doe  | MD      | AMO-001 | WH-001
jane_smith  | Jane Smith| Sales   | AMO-002 | WH-002
```

### 2. Outlet Data (dataoutlet.xlsx)
**Columns Required:**
| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| username | Owner username | Yes | admin-gis |
| id_outlet | Outlet ID | Yes | OUT-001 |
| nama_outlet | Outlet name | Yes | Store ABC |
| amo | AMO code | No | AMO-001 |
| warehouse | Warehouse code | No | WH-001 |
| latitude | GPS Latitude | No | -6.2088 |
| longitude | GPS Longitude | No | 106.8456 |
| alamat | Address | No | Jl. Example 123 |

**Example:**
```
username  | id_outlet | nama_outlet | amo     | warehouse | latitude | longitude | alamat
admin-gis | OUT-001   | Store ABC   | AMO-001 | WH-001    | -6.2088  | 106.8456  | Jl. Example 123
admin-gis | OUT-002   | Store XYZ   | AMO-002 | WH-002    | -6.2100  | 106.8500  | Jl. Sample 456
```

### 3. MD Visit Data (datavisitmd.xlsx)
**Columns Required:**
| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| username | User assigned | Yes | john_doe |
| amo | AMO code | No | AMO-001 |
| warehouse | Warehouse code | No | WH-001 |
| id_outlet | Outlet ID | Yes | OUT-001 |
| nama_outlet | Outlet name | Yes | Store ABC |
| date_visit | Visit date | Yes | 2024-01-15 |

**Example:**
```
username | amo     | warehouse | id_outlet | nama_outlet | date_visit
john_doe | AMO-001 | WH-001    | OUT-001   | Store ABC   | 2024-01-15
john_doe | AMO-001 | WH-001    | OUT-002   | Store XYZ   | 2024-01-16
```

### 4. Sales Visit Data (datavisitsales.xlsx)
Same format as MD Visit Data.

---

## 🚀 How to Upload Excel Files

### Method 1: Using the Dashboard UI (Recommended)

#### For Users:
1. Open dashboard at http://localhost:5173
2. Login with credentials (admin-gis / gis2026)
3. Navigate to **Users** page
4. Click **"Upload Excel"** button
5. Select your Excel file (.xlsx or .xls)
6. Wait for upload confirmation
7. Check the results (success count, error count)

#### For Outlets:
1. Navigate to **Outlets** page
2. Click **"Upload Excel"** button
3. Select your Excel file
4. Confirm upload

#### For Visits:
1. Navigate to **Visits** page
2. Select **MD Visits** or **Sales Visits** tab
3. Click **"Upload Excel"** button
4. Select your Excel file
5. Confirm upload

### Method 2: Using API Directly (For Testing)

#### Upload Users:
```bash
curl -X POST http://localhost:3000/api/users/upload-excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@uploads/excel/datauser.xlsx"
```

#### Upload Outlets:
```bash
curl -X POST http://localhost:3000/api/outlets/upload-excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@uploads/excel/dataoutlet.xlsx"
```

#### Upload MD Visits:
```bash
curl -X POST http://localhost:3000/api/visits/md/upload-excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@uploads/excel/datavisitmd.xlsx"
```

#### Upload Sales Visits:
```bash
curl -X POST http://localhost:3000/api/visits/sales/upload-excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@uploads/excel/datavisitsales.xlsx"
```

---

## ✅ Upload Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Upload complete. 10 records added, 0 errors",
  "data": {
    "successCount": 10,
    "errorCount": 0,
    "errors": []
  }
}
```

### Partial Success Response:
```json
{
  "success": true,
  "message": "Upload complete. 8 records added, 2 errors",
  "data": {
    "successCount": 8,
    "errorCount": 2,
    "errors": [
      "Row 3: Username and nama are required",
      "Row 7: Duplicate entry"
    ]
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

## 🔧 Troubleshooting

### Issue: "No file uploaded"
**Solution**: Ensure you're selecting a file before clicking upload.

### Issue: "Only Excel files (.xls, .xlsx) are allowed"
**Solution**: Make sure your file has .xlsx or .xls extension.

### Issue: "Username and nama are required"
**Solution**: Check that required columns have values in all rows.

### Issue: File size too large
**Solution**: Excel files are limited to 10MB. Split large files into smaller batches.

### Issue: Upload button not working
**Solution**: 
1. Check if you're logged in
2. Verify you have admin permissions
3. Check browser console for errors (F12)

---

## 📝 Best Practices

1. **Always use the first row for headers** - The system skips row 1 assuming it contains column names.

2. **Test with small files first** - Upload 5-10 records initially to verify format.

3. **Keep backups** - Save original Excel files before uploading.

4. **Check for duplicates** - The system may reject duplicate usernames or IDs.

5. **Use consistent date format** - Use YYYY-MM-DD format for dates (e.g., 2024-01-15).

6. **Validate GPS coordinates** - Ensure latitude/longitude are valid decimal numbers.

7. **Remove empty rows** - Delete any empty rows at the end of your Excel file.

---

## 🎯 Quick Test Workflow

### Test User Upload:
1. Open `uploads/excel/datauser.xlsx` in Excel
2. Add a test row:
   ```
   test_user | Test User | MD | AMO-TEST | WH-TEST
   ```
3. Save the file
4. Upload via dashboard
5. Verify user appears in Users list

### Test Outlet Upload:
1. Open `uploads/excel/dataoutlet.xlsx` in Excel
2. Add a test row with valid GPS coordinates
3. Save and upload
4. Verify outlet appears in Outlets list

---

## 📊 Sample Data

### Sample User Data:
```excel
username    nama            jabatan    amo        warehouse
john_md     John MD         MD         AMO-001    WH-JAKARTA
jane_sales  Jane Sales      Sales      AMO-002    WH-BANDUNG
bob_admin   Bob Admin       Admin      AMO-003    WH-SURABAYA
```

### Sample Outlet Data:
```excel
username    id_outlet    nama_outlet        amo        warehouse    latitude    longitude    alamat
admin-gis   OUT-001      Toko Maju         AMO-001    WH-JAKARTA   -6.2088     106.8456     Jl. Sudirman 123
admin-gis   OUT-002      Warung Berkah     AMO-001    WH-JAKARTA   -6.2100     106.8500     Jl. Thamrin 456
admin-gis   OUT-003      Mini Market XYZ   AMO-002    WH-BANDUNG   -6.9175     107.6191     Jl. Asia Afrika 789
```

---

## 🔐 Security Notes

- Excel upload requires **admin authentication**
- Files are temporarily stored in `uploads/excel/` directory
- Files are automatically deleted after processing
- Maximum file size: 10MB
- Only .xlsx and .xls formats are accepted

---

## 📞 Support

If you encounter issues:
1. Check the backend server logs
2. Verify file format matches templates
3. Ensure all required fields are filled
4. Check for special characters in data
5. Review the error messages in upload response

---

## 🎉 Success!

Once uploaded successfully:
- Data appears immediately in the dashboard
- You can edit/delete individual records
- Data is stored in SQLite databases
- Changes sync across all connected clients

**Happy Uploading!** 📊✨
