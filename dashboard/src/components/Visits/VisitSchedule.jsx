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
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { visitAPI } from '../../services/api';

function VisitSchedule() {
  const [tabValue, setTabValue] = useState(0);
  const [mdVisits, setMdVisits] = useState([]);
  const [salesVisits, setSalesVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    amo: '',
    warehouse: '',
    idoutlet: '',
    namaoutlet: '',
    datevisit: '',
  });

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      const [mdResponse, salesResponse] = await Promise.all([
        visitAPI.getMD(),
        visitAPI.getSales(),
      ]);
      setMdVisits(mdResponse.data.data);
      setSalesVisits(salesResponse.data.data);
      setError('');
    } catch (error) {
      setError('Failed to load visits');
      console.error('Error loading visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (visit = null) => {
    if (visit) {
      setEditingVisit(visit);
      setFormData({
        username: visit.username,
        amo: visit.amo,
        warehouse: visit.warehouse,
        idoutlet: visit.idoutlet,
        namaoutlet: visit.namaoutlet,
        datevisit: visit.datevisit,
      });
    } else {
      setEditingVisit(null);
      setFormData({
        username: '',
        amo: '',
        warehouse: '',
        idoutlet: '',
        namaoutlet: '',
        datevisit: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVisit(null);
  };

  const handleSubmit = async () => {
    try {
      const isMD = tabValue === 0;
      if (editingVisit) {
        if (isMD) {
          await visitAPI.updateMD(editingVisit.id, formData);
        } else {
          await visitAPI.updateSales(editingVisit.id, formData);
        }
      } else {
        if (isMD) {
          await visitAPI.createMD(formData);
        } else {
          await visitAPI.createSales(formData);
        }
      }
      handleCloseDialog();
      loadVisits();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save visit');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      try {
        const isMD = tabValue === 0;
        if (isMD) {
          await visitAPI.deleteMD(id);
        } else {
          await visitAPI.deleteSales(id);
        }
        loadVisits();
      } catch (error) {
        setError('Failed to delete visit');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const currentVisits = tabValue === 0 ? mdVisits : salesVisits;
  const visitType = tabValue === 0 ? 'MD' : 'Sales';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Visit Schedule</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add {visitType} Visit
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="MD Visits" />
          <Tab label="Sales Visits" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>AMO</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>ID Outlet</TableCell>
                <TableCell>Nama Outlet</TableCell>
                <TableCell>Date Visit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>{visit.username}</TableCell>
                  <TableCell>{visit.amo}</TableCell>
                  <TableCell>{visit.warehouse}</TableCell>
                  <TableCell>{visit.idoutlet}</TableCell>
                  <TableCell>{visit.namaoutlet}</TableCell>
                  <TableCell>{visit.datevisit}</TableCell>
                  <TableCell>{visit.status}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(visit)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(visit.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVisit ? `Edit ${visitType} Visit` : `Add ${visitType} Visit`}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="AMO"
            value={formData.amo}
            onChange={(e) => setFormData({ ...formData, amo: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Warehouse"
            value={formData.warehouse}
            onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="ID Outlet"
            value={formData.idoutlet}
            onChange={(e) => setFormData({ ...formData, idoutlet: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nama Outlet"
            value={formData.namaoutlet}
            onChange={(e) => setFormData({ ...formData, namaoutlet: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Date Visit"
            type="date"
            value={formData.datevisit}
            onChange={(e) => setFormData({ ...formData, datevisit: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VisitSchedule;
