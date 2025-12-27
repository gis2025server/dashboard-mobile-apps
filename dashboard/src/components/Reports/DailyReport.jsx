import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { reportAPI } from '../../services/api';

function DailyReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    username: '',
    visit_type: '',
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getDaily(filters);
      setReports(response.data.data);
      setError('');
    } catch (error) {
      setError('Failed to load reports');
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await reportAPI.export(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${filters.date || 'all'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to export report');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Daily Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Username"
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Visit Type"
              select
              SelectProps={{ native: true }}
              value={filters.visit_type}
              onChange={(e) => setFilters({ ...filters, visit_type: e.target.value })}
            >
              <option value="">All</option>
              <option value="md">MD</option>
              <option value="sales">Sales</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={loadReports}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Total Records: {reports.length}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={reports.length === 0}
        >
          Export to Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Visit Type</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Nama MD</TableCell>
              <TableCell>Outlet</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Status POSM</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.visit_type}</TableCell>
                  <TableCell>{report.username}</TableCell>
                  <TableCell>{report.nama_md}</TableCell>
                  <TableCell>{report.namaoutlet}</TableCell>
                  <TableCell>
                    {report.checkin_time
                      ? new Date(report.checkin_time).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {report.checkout_time
                      ? new Date(report.checkout_time).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>{report.status_posm || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DailyReport;
