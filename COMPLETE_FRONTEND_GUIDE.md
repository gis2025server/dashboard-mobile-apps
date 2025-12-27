# Complete Frontend Development Guide

This guide provides all the code and instructions to build the Web Dashboard and Mobile Apps (Android & iOS) for the Dashboard & Mobile Apps System.

## Part 1: Web Dashboard (React)

### Step 1: Create React Dashboard Project

```bash
# Create new React app with Vite (faster than create-react-app)
npm create vite@latest dashboard -- --template react
cd dashboard
npm install

# Install required dependencies
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material recharts socket.io-client xlsx
```

### Step 2: Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── Login/
│   │   │   └── Login.jsx
│   │   ├── Dashboard/
│   │   │   ├── MainDashboard.jsx
│   │   │   └── Charts.jsx
│   │   ├── Users/
│   │   │   ├── UserList.jsx
│   │   │   ├── UserForm.jsx
│   │   │   └── ExcelUpload.jsx
│   │   ├── Outlets/
│   │   │   ├── OutletList.jsx
│   │   │   ├── OutletForm.jsx
│   │   │   └── OutletMap.jsx
│   │   ├── Visits/
│   │   │   ├── VisitSchedule.jsx
│   │   │   ├── StartVisit.jsx
│   │   │   └── VisitAction.jsx
│   │   ├── Reports/
│   │   │   ├── DailyReport.jsx
│   │   │   └── ReportExport.jsx
│   │   └── Layout/
│   │       ├── Sidebar.jsx
│   │       └── Header.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── socket.js
│   ├── utils/
│   │   ├── auth.js
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

### Step 3: Core Files

#### src/services/api.js
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getUsers: () => api.get('/auth/users'),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  uploadExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/users/upload-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const outletAPI = {
  getAll: () => api.get('/outlets'),
  getById: (id) => api.get(`/outlets/${id}`),
  create: (data) => api.post('/outlets', data),
  update: (id, data) => api.put(`/outlets/${id}`, data),
  delete: (id) => api.delete(`/outlets/${id}`),
  uploadExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/outlets/upload-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const visitAPI = {
  getMD: () => api.get('/visits/md'),
  getSales: () => api.get('/visits/sales'),
  createMD: (data) => api.post('/visits/md', data),
  createSales: (data) => api.post('/visits/sales', data),
  updateMD: (id, data) => api.put(`/visits/md/${id}`, data),
  updateSales: (id, data) => api.put(`/visits/sales/${id}`, data),
  deleteMD: (id) => api.delete(`/visits/md/${id}`),
  deleteSales: (id) => api.delete(`/visits/sales/${id}`),
};

export const visitActionAPI = {
  start: (data) => api.post('/visit-actions/start', data),
  checkin: (data) => api.post('/visit-actions/checkin', data),
  uploadPhoto: (file, type, actionId) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photo_type', type);
    formData.append('action_id', actionId);
    return api.post('/visit-actions/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateStatus: (data) => api.post('/visit-actions/update-status', data),
  checkout: (data) => api.post('/visit-actions/checkout', data),
  getAll: () => api.get('/visit-actions'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getMyDashboard: () => api.get('/dashboard/my-dashboard'),
};

export const reportAPI = {
  getDaily: (params) => api.get('/reports/daily', { params }),
  export: (params) => api.get('/reports/export', { params, responseType: 'blob' }),
  getSummary: (params) => api.get('/reports/summary', { params }),
};

export default api;
```

#### src/components/Login/Login.jsx
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { authAPI } from '../../services/api';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Dashboard Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              autoFocus
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" align="center">
            Default: admin-gis / gis2026
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
```

#### src/components/Dashboard/MainDashboard.jsx
```javascript
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  People,
  Store,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { dashboardAPI } from '../../services/api';
import Charts from './Charts';

function MainDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.summary?.totalUsers || 0,
      icon: <People fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Total Outlets',
      value: stats?.summary?.totalOutlets || 0,
      icon: <Store fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'MD Visits',
      value: stats?.summary?.totalMdVisits || 0,
      icon: <Assignment fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Completed Actions',
      value: stats?.summary?.completedActions || 0,
      icon: <CheckCircle fontSize="large" />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Charts data={stats?.charts} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainDashboard;
```

### Step 4: Run Dashboard

```bash
cd dashboard
npm run dev
```

The dashboard will be available at http://localhost:5173

---

## Part 2: Mobile Apps (React Native)

### Step 1: Create React Native Project

```bash
# Install React Native CLI globally
npm install -g react-native-cli

# Create new React Native project
npx react-native init MobileApp
cd MobileApp

# Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios react-native-maps react-native-image-picker
npm install @react-native-async-storage/async-storage
npm install socket.io-client
npm install react-native-geolocation-service
```

### Step 2: Project Structure

```
MobileApp/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── VisitListScreen.js
│   │   ├── VisitActionScreen.js
│   │   └── ReportScreen.js
│   ├── components/
│   │   ├── VisitCard.js
│   │   ├── MapView.js
│   │   └── PhotoCapture.js
│   ├── services/
│   │   ├── api.js
│   │   ├── location.js
│   │   └── storage.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── utils/
│       └── constants.js
├── App.js
└── package.json
```

### Step 3: Core Mobile Files

#### src/services/api.js (Mobile)
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_SERVER_IP:3000/api'; // Replace with your server IP

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const visitActionAPI = {
  start: (data) => api.post('/visit-actions/start', data),
  checkin: (data) => api.post('/visit-actions/checkin', data),
  uploadPhoto: async (uri, type, actionId) => {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('photo_type', type);
    formData.append('action_id', actionId);
    
    return api.post('/visit-actions/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateStatus: (data) => api.post('/visit-actions/update-status', data),
  checkout: (data) => api.post('/visit-actions/checkout', data),
};

export const dashboardAPI = {
  getMyDashboard: () => api.get('/dashboard/my-dashboard'),
};

export default api;
```

#### src/screens/LoginScreen.js
```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
```

#### src/screens/VisitActionScreen.js
```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { visitActionAPI } from '../services/api';

function VisitActionScreen({ route, navigation }) {
  const { visit } = route.params;
  const [actionId, setActionId] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [photoBefore, setPhotoBefore] = useState(null);
  const [photoAfter, setPhotoAfter] = useState(null);
  const [location, setLocation] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const handleCheckIn = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);

      const response = await visitActionAPI.checkin({
        visit_id: visit.id,
        visit_type: visit.type,
        username: visit.username,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });

      setActionId(response.data.data.action_id);
      setCheckedIn(true);
      Alert.alert('Success', 'Checked in successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in');
    }
  };

  const handleTakePhoto = async (type) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Error', 'Failed to capture photo');
        return;
      }

      const photo = response.assets[0];
      
      try {
        await visitActionAPI.uploadPhoto(photo.uri, type, actionId);
        
        if (type === 'before') {
          setPhotoBefore(photo.uri);
        } else {
          setPhotoAfter(photo.uri);
        }
        
        Alert.alert('Success', 'Photo uploaded successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload photo');
      }
    });
  };

  const handleUpdateStatus = async (status) => {
    try {
      await visitActionAPI.updateStatus({
        action_id: actionId,
        status_posm: status,
      });
      Alert.alert('Success', 'Status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleCheckOut = async () => {
    try {
      const loc = await getCurrentLocation();
      
      await visitActionAPI.checkout({
        action_id: actionId,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });

      Alert.alert('Success', 'Visit completed', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to check out');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{visit.namaoutlet}</Text>
        <Text style={styles.subtitle}>{visit.alamatoutlet}</Text>
      </View>

      {!checkedIn ? (
        <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Documentation Before</Text>
            {photoBefore && (
              <Image source={{ uri: photoBefore }} style={styles.photo} />
            )}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => handleTakePhoto('before')}
            >
              <Text style={styles.buttonText}>Take Photo Before</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Documentation After</Text>
            {photoAfter && (
              <Image source={{ uri: photoAfter }} style={styles.photo} />
            )}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => handleTakePhoto('after')}
            >
              <Text style={styles.buttonText}>Take Photo After</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>POSM Status</Text>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusSuccess]}
              onPress={() => handleUpdateStatus('terpasang')}
            >
              <Text style={styles.buttonText}>Terpasang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusWarning]}
              onPress={() => handleUpdateStatus('outlet tidak ada')}
            >
              <Text style={styles.buttonText}>Outlet Tidak Ada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusDanger]}
              onPress={() => handleUpdateStatus('toko tutup')}
            >
              <Text style={styles.buttonText}>Toko Tutup</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.checkoutButton]}
            onPress={handleCheckOut}
          >
            <Text style={styles.buttonText}>Check Out</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusSection: {
    marginBottom: 20,
  },
  statusButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusSuccess: {
    backgroundColor: '#2e7d32',
  },
  statusWarning: {
    backgroundColor: '#ed6c02',
  },
  statusDanger: {
    backgroundColor: '#d32f2f',
  },
  checkoutButton: {
    backgroundColor: '#9c27b0',
  },
});

export default VisitActionScreen;
```

### Step 4: Run Mobile Apps

#### For Android:
```bash
# Start Metro bundler
npx react-native start

# In another terminal, run Android
npx react-native run-android
```

#### For iOS (Mac only):
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

---

## Part 3: Configuration & Deployment

### Backend Configuration for Production

1. **Update .env for production:**
```env
PORT=3000
JWT_SECRET=your-very-secure-secret-key-change-this
DB_PATH=./databases
UPLOAD_PATH=./uploads
NODE_ENV=production
```

2. **Enable CORS for mobile apps:**
```javascript
// In server/index.js, update CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://YOUR_MOBILE_IP:*'],
  credentials: true
}));
```

### Mobile App Configuration

1. **Update API URL in mobile app:**
```javascript
// src/services/api.js
const API_URL = 'http://YOUR_SERVER_IP:3000/api';
```

2. **Add permissions in AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

3. **Add permissions in Info.plist (iOS):**
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location access for check-in</string>
```

### Build Mobile Apps for Production

#### Android APK:
```bash
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/app-release.apk
```

#### iOS IPA (requires Mac & Apple Developer Account):
```bash
# Open Xcode
open ios/MobileApp.xcworkspace

# Select Product > Archive
# Follow Xcode distribution wizard
```

---

## Testing Checklist

### Web Dashboard Testing:
- [ ] Login with admin-gis/gis2026
- [ ] View dashboard statistics
- [ ] Add/Edit/Delete users
- [ ] Upload Excel for users
- [ ] Add/Edit/Delete outlets
- [ ] View outlets on map
- [ ] Schedule MD visits
- [ ] Schedule Sales visits
- [ ] View reports
- [ ] Export reports to Excel

### Mobile App Testing:
- [ ] Login on mobile
- [ ] View dashboard
- [ ] Start visit
- [ ] Check-in with GPS
- [ ] Take photo before
- [ ] Take photo after
- [ ] Update POSM status
- [ ] Check-out with GPS
- [ ] Verify data syncs to dashboard

### Integration Testing:
- [ ] Data added on web appears on mobile
- [ ] Data added on mobile appears on web
- [ ] Real-time sync works
- [ ] Scheduled sync at 12:00 & 18:00
- [ ] Photos upload correctly
- [ ] GPS coordinates accurate
- [ ] Excel export works
- [ ] Reports show correct data

---

## Quick Start Commands

```bash
# Terminal 1: Start Backend
cd c:/Project/apps
node server/index.js

# Terminal 2: Start Web Dashboard
cd c:/Project/apps/dashboard
npm run dev

# Terminal 3: Start Mobile App
cd c:/Project/apps/MobileApp
npx react-native start

# Terminal 4: Run Android
cd c:/Project/apps/MobileApp
npx react-native run-android
```

---

## Support & Documentation

- Backend API: http://localhost:3000/api
- Web Dashboard: http://localhost:5173
- API Documentation: See API_DOCUMENTATION.md
- Default Login: admin-gis / gis2026

## Next Steps

1. Create dashboard project with Vite
2. Install all dependencies
3. Copy the provided code files
4. Configure API URLs
5. Test web dashboard
6. Create mobile app project
7. Install mobile dependencies
8. Copy mobile code files
9. Configure permissions
10. Test mobile apps
11. Build production versions

This guide provides everything needed to build the complete system!
