# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 Login
**POST** `/auth/login`

Login to get JWT token.

**Request Body:**
```json
{
  "username": "admin-gis",
  "password": "gis2026"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin-gis",
    "access_level": "admin"
  }
}
```

### 1.2 Add User (Admin Only)
**POST** `/auth/users`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123",
  "access_level": "user"
}
```

### 1.3 Edit User (Admin Only)
**PUT** `/auth/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "user1",
  "password": "newpassword123",
  "access_level": "admin"
}
```

### 1.4 Delete User (Admin Only)
**DELETE** `/auth/users/:id`

**Headers:** `Authorization: Bearer <token>`

### 1.5 Get All Users (Admin Only)
**GET** `/auth/users`

**Headers:** `Authorization: Bearer <token>`

---

## 2. User Management Endpoints

### 2.1 Get All Users
**GET** `/users`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `username` (optional): Filter by username
- `jabatan` (optional): Filter by position
- `warehouse` (optional): Filter by warehouse

### 2.2 Get User by ID
**GET** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

### 2.3 Add User (Admin Only)
**POST** `/users`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "john_doe",
  "nama": "John Doe",
  "jabatan": "Sales Manager",
  "amo": "AMO-001",
  "warehouse": "WH-Jakarta"
}
```

### 2.4 Edit User (Admin Only)
**PUT** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "nama": "John Doe Updated",
  "jabatan": "Senior Sales Manager",
  "amo": "AMO-001",
  "warehouse": "WH-Jakarta"
}
```

### 2.5 Delete User (Admin Only)
**DELETE** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

### 2.6 Upload Excel (Admin Only)
**POST** `/users/upload-excel`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Excel file (.xlsx or .xls)

**Excel Format:**
| username | nama | jabatan | amo | warehouse |
|----------|------|---------|-----|-----------|
| user1 | John Doe | Manager | AMO-001 | WH-Jakarta |

---

## 3. Outlet Management Endpoints

### 3.1 Get All Outlets
**GET** `/outlets`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `username` (optional)
- `warehouse` (optional)
- `idoutlet` (optional)

### 3.2 Get Outlet by ID
**GET** `/outlets/:id`

**Headers:** `Authorization: Bearer <token>`

### 3.3 Add Outlet (Admin Only)
**POST** `/outlets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "john_doe",
  "amo": "AMO-001",
  "warehouse": "WH-Jakarta",
  "idoutlet": "OUT-001",
  "namaoutlet": "Toko ABC",
  "alamatoutlet": "Jl. Sudirman No. 123",
  "latitude": "-6.200000",
  "longitude": "106.816666"
}
```

### 3.4 Edit Outlet (Admin Only)
**PUT** `/outlets/:id`

**Headers:** `Authorization: Bearer <token>`

### 3.5 Delete Outlet (Admin Only)
**DELETE** `/outlets/:id`

**Headers:** `Authorization: Bearer <token>`

### 3.6 Upload Excel (Admin Only)
**POST** `/outlets/upload-excel`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Excel Format:**
| username | amo | warehouse | idoutlet | namaoutlet | alamatoutlet | latitude | longitude |
|----------|-----|-----------|----------|------------|--------------|----------|-----------|

---

## 4. Visit Scheduling Endpoints

### 4.1 MD Visits

#### Get All MD Visits
**GET** `/visits/md`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `username` (optional)
- `datevisit` (optional)
- `status` (optional): scheduled, completed, cancelled

#### Add MD Visit (Admin Only)
**POST** `/visits/md`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "john_doe",
  "amo": "AMO-001",
  "warehouse": "WH-Jakarta",
  "idoutlet": "OUT-001",
  "namaoutlet": "Toko ABC",
  "datevisit": "2025-01-15"
}
```

#### Edit MD Visit (Admin Only)
**PUT** `/visits/md/:id`

#### Delete MD Visit (Admin Only)
**DELETE** `/visits/md/:id`

#### Upload Excel (Admin Only)
**POST** `/visits/md/upload-excel`

**Excel Format:**
| username | amo | warehouse | idoutlet | namaoutlet | datevisit |
|----------|-----|-----------|----------|------------|-----------|

### 4.2 Sales Visits

Same endpoints as MD visits, but use `/visits/sales` instead of `/visits/md`

---

## 5. Visit Action Endpoints

### 5.1 Start Visit
**POST** `/visit-actions/start`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "datevisit": "2025-01-15",
  "username": "john_doe",
  "visit_type": "md"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Found 3 scheduled visits",
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "idoutlet": "OUT-001",
      "namaoutlet": "Toko ABC",
      "datevisit": "2025-01-15"
    }
  ]
}
```

### 5.2 Check-in
**POST** `/visit-actions/checkin`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "visit_schedule_id": 1,
  "visit_type": "md",
  "latitude": "-6.200000",
  "longitude": "106.816666"
}
```

### 5.3 Upload Photo
**POST** `/visit-actions/upload-photo`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `photo`: Image file (jpg, jpeg, png)
- `visit_action_id`: Visit action ID
- `photo_type`: "before" or "after"

### 5.4 Update Status
**POST** `/visit-actions/update-status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "visit_action_id": 1,
  "status_posm": "terpasang"
}
```

**Status Options:**
- `terpasang`
- `outlet tidak ada`
- `toko tutup`

### 5.5 Check-out
**POST** `/visit-actions/checkout`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "visit_action_id": 1,
  "latitude": "-6.200000",
  "longitude": "106.816666"
}
```

### 5.6 Get All Visit Actions
**GET** `/visit-actions`

**Headers:** `Authorization: Bearer <token>`

### 5.7 Get Visit Action by ID
**GET** `/visit-actions/:id`

**Headers:** `Authorization: Bearer <token>`

### 5.8 Get Visit Actions by User
**GET** `/visit-actions/user/:username`

**Headers:** `Authorization: Bearer <token>`

---

## 6. Dashboard Endpoints

### 6.1 Get Dashboard Statistics (Admin Only)
**GET** `/dashboard/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 10,
      "totalOutlets": 50,
      "totalMdVisits": 100,
      "completedMdVisits": 75,
      "scheduledMdVisits": 25
    },
    "charts": {
      "mdVisitsByDate": [...],
      "salesVisitsByDate": [...],
      "mdVisitsByWarehouse": [...],
      "salesVisitsByWarehouse": [...]
    },
    "recentActivities": [...]
  }
}
```

### 6.2 Get User Dashboard
**GET** `/dashboard/my-dashboard`

**Headers:** `Authorization: Bearer <token>`

---

## 7. Report Endpoints

### 7.1 Get Daily Report
**GET** `/reports/daily`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `date` (optional): YYYY-MM-DD format
- `username` (optional)
- `visit_type` (optional): md or sales

### 7.2 Export Report to Excel
**GET** `/reports/export`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `date` (optional): YYYY-MM-DD format
- `username` (optional)
- `visit_type` (optional): md or sales

**Response:** Excel file download

### 7.3 Get Report Summary
**GET** `/reports/summary`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD format
- `end_date` (optional): YYYY-MM-DD format

---

## 8. Sync Endpoints

### 8.1 Trigger Manual Sync (Admin Only)
**POST** `/sync/trigger`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "recordsSynced": 150
}
```

### 8.2 Get Sync Logs (Admin Only)
**GET** `/sync/logs`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of logs to retrieve (default: 50)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided" 
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3000');
```

### Events

#### Client → Server
```javascript
socket.emit('data-update', {
  type: 'visit-action',
  action: 'checkin',
  data: {...}
});
```

#### Server → Client
```javascript
socket.on('data-sync', (data) => {
  console.log('Data synced:', data);
});
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

**Last Updated:** 2025-01-15
