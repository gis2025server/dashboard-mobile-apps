import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login/Login';
import MainDashboard from './components/Dashboard/MainDashboard';
import UserList from './components/Users/UserList';
import OutletList from './components/Outlets/OutletList';
import VisitSchedule from './components/Visits/VisitSchedule';
import DailyReport from './components/Reports/DailyReport';
import AuthUserList from './components/Auth/AuthUserList';
import Layout from './components/Layout/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<MainDashboard />} />
                    <Route path="/auth-users" element={<AuthUserList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/outlets" element={<OutletList />} />
                    <Route path="/visits" element={<VisitSchedule />} />
                    <Route path="/reports" element={<DailyReport />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
