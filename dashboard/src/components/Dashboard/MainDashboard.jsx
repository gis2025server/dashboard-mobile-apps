import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
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
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
        Dashboard Overview
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
            <Typography variant="h6" gutterBottom>
              Statistics & Charts
            </Typography>
            <Charts data={stats?.charts} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <Box>
                {stats.recentActivities.slice(0, 5).map((activity, index) => (
                  <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2">
                      <strong>{activity.username}</strong> - {activity.namaoutlet}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(activity.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">No recent activities</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Scheduled MD Visits
                </Typography>
                <Typography variant="h6">
                  {stats?.summary?.scheduledMdVisits || 0}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Scheduled Sales Visits
                </Typography>
                <Typography variant="h6">
                  {stats?.summary?.scheduledSalesVisits || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Visit Actions
                </Typography>
                <Typography variant="h6">
                  {stats?.summary?.totalVisitActions || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainDashboard;
