# Dashboard & Mobile Apps System

A comprehensive monitoring, controlling, and reporting system with web dashboard and mobile applications for managing MD and Sales visits with GPS tracking, photo documentation, and real-time synchronization.

## 🚀 Features

### Web Dashboard
- **Authentication System**: Secure login with JWT tokens
- **Main Dashboard**: Real-time statistics with interactive graphs
- **User Management**: CRUD operations with Excel bulk upload
- **Outlet Management**: Manage outlets with GPS coordinates
- **Visit Scheduling**: Schedule MD and Sales visits
- **Visit Tracking**: Real-time visit monitoring with GPS check-in/check-out
- **Photo Documentation**: Before/after visit photos
- **Reporting**: Daily reports with Excel export
- **Real-time Sync**: Live data updates via WebSocket
- **Scheduled Sync**: Automatic backup sync at 12:00 & 18:00

### Mobile Apps (React Native)
- **Cross-platform**: Single codebase for iOS and Android
- **GPS Tracking**: Automatic location capture on check-in
- **Camera Integration**: Capture before/after photos
- **Offline Support**: Work without internet connection
- **Real-time Sync**: Live data synchronization with backend
- **Visit Management**: Complete visit workflow on mobile

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native CLI (for mobile development)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd apps
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./databases
UPLOAD_PATH=./uploads
EXCEL_UPLOAD_PATH=./uploads/excel
IMAGE_UPLOAD_PATH=./uploads/images
SYNC_SCHEDULE_1=0 12 * * *
SYNC_SCHEDULE_2=0 18 * * *
DEFAULT_ADMIN_USERNAME=admin-gis
DEFAULT_ADMIN_PASSWORD=gis2026
NODE_ENV=development
```

### 4. Start the backend server
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
apps/
├── server/
│   ├── controllers/       # Business logic
│   ├── database/          # Database schemas and initialization
│   ├── middleware/        # Authentication middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── index.js          # Main server file
├── dashboard/            # React web dashboard (to be created)
├── mobile-app/          # React Native mobile app (to be created)
├── uploads/             # Uploaded files (images, excel)
├── databases/           # SQLite database files
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
├── README.md           # This file
└── TODO.md            # Development progress
```

## 🗄️ Database Schema

### Tables:
1. **menulogin** - User authentication
2. **datauser** - User information (nama, jabatan, amo, warehouse)
3. **dataoutlet** - Outlet details with GPS coordinates
4. **datavisitmd** - MD visit schedules
5. **datavisitsales** - Sales visit schedules
6. **visitaction** - Visit tracking with GPS and photos
7. **synclog** - Synchronization activity logs

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/users` - Add user (admin only)
- `PUT /api/auth/users/:id` - Edit user (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Add user (admin only)
- `PUT /api/users/:id` - Edit user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `POST /api/users/upload-excel` - Bulk upload via Excel (admin only)

### Outlet Management
- `GET /api/outlets` - Get all outlets
- `GET /api/outlets/:id` - Get outlet by ID
- `POST /api/outlets` - Add outlet (admin only)
- `PUT /api/outlets/:id` - Edit outlet (admin only)
- `DELETE /api/outlets/:id` - Delete outlet (admin only)
- `POST /api/outlets/upload-excel` - Bulk upload via Excel (admin only)

### Visit Scheduling
- `GET /api/visits/md` - Get MD visits
- `POST /api/visits/md` - Add MD visit (admin only)
- `PUT /api/visits/md/:id` - Edit MD visit (admin only)
- `DELETE /api/visits/md/:id` - Delete MD visit (admin only)
- `POST /api/visits/md/upload-excel` - Bulk upload MD visits (admin only)
- `GET /api/visits/sales` - Get Sales visits
- `POST /api/visits/sales` - Add Sales visit (admin only)
- `PUT /api/visits/sales/:id` - Edit Sales visit (admin only)
- `DELETE /api/visits/sales/:id` - Delete Sales visit (admin only)
- `POST /api/visits/sales/upload-excel` - Bulk upload Sales visits (admin only)

### Visit Actions
- `POST /api/visit-actions/start` - Start visit
- `POST /api/visit-actions/checkin` - Check-in with GPS
- `POST /api/visit-actions/upload-photo` - Upload documentation photo
- `POST /api/visit-actions/update-status` - Update POSM status
- `POST /api/visit-actions/checkout` - Check-out
- `GET /api/visit-actions` - Get all visit actions
- `GET /api/visit-actions/:id` - Get visit action by ID
- `GET /api/visit-actions/user/:username` - Get user's visit actions

### Dashboard
- `GET /api/dashboard/stats` - Get global statistics (admin only)
- `GET /api/dashboard/my-dashboard` - Get user dashboard

### Reports
- `GET /api/reports/daily` - Get daily report
- `GET /api/reports/export` - Export report to Excel
- `GET /api/reports/summary` - Get report summary

### Sync
- `POST /api/sync/trigger` - Trigger manual sync (admin only)
- `GET /api/sync/logs` - Get sync logs (admin only)

## 🔐 Default Credentials

- **Username**: `admin-gis`
- **Password**: `gis2026`

⚠️ **Important**: Change these credentials in production!

## 🕐 Scheduled Synchronization

The system automatically performs data synchronization at:
- **12:00 PM** (noon)
- **6:00 PM** (18:00)

You can modify these schedules in the `.env` file using cron syntax.

## 📱 Mobile App Development

### Initialize React Native project
```bash
npx react-native init MobileApp
cd MobileApp
```

### Install dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-maps react-native-image-picker
npm install @react-native-async-storage/async-storage
npm install socket.io-client axios
```

### Run on Android
```bash
npx react-native run-android
```

### Run on iOS
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## 🌐 Web Dashboard Development

### Initialize React app
```bash
npx create-react-app dashboard
cd dashboard
```

### Install dependencies
```bash
npm install react-router-dom axios
npm install chart.js react-chartjs-2
npm install @mui/material @emotion/react @emotion/styled
npm install socket.io-client
```

### Start development server
```bash
npm start
```

## 🧪 Testing

### Test API with curl
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin-gis","password":"gis2026"}'

# Get dashboard stats (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"
```

## 📝 Development Progress

See [TODO.md](TODO.md) for detailed development progress and next steps.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Support

For support, please contact the development team.

---

**Built with ❤️ using Node.js, React, and React Native**
