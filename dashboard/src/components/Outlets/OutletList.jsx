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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Upload } from '@mui/icons-material';
import { outletAPI } from '../../services/api';

function OutletList() {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    amo: '',
    warehouse: '',
    idoutlet: '',
    namaoutlet: '',
    alamatoutlet: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    loadOutlets();
  }, []);

  const loadOutlets = async () => {
    try {
      const response = await outletAPI.getAll();
      setOutlets(response.data.data);
      setError('');
    } catch (error) {
      setError('Failed to load outlets');
      console.error('Error loading outlets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (outlet = null) => {
    if (outlet) {
      setEditingOutlet(outlet);
      setFormData({
        username: outlet.username,
        amo: outlet.amo,
        warehouse: outlet.warehouse,
        idoutlet: outlet.idoutlet,
        namaoutlet: outlet.namaoutlet,
        alamatoutlet: outlet.alamatoutlet,
        latitude: outlet.latitude,
        longitude: outlet.longitude,
      });
    } else {
      setEditingOutlet(null);
      setFormData({
        username: '',
        amo: '',
        warehouse: '',
        idoutlet: '',
        namaoutlet: '',
        alamatoutlet: '',
        latitude: '',
        longitude: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOutlet(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };
      
      if (editingOutlet) {
        await outletAPI.update(editingOutlet.id, data);
      } else {
        await outletAPI.create(data);
      }
      handleCloseDialog();
      loadOutlets();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save outlet');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this outlet?')) {
      try {
        await outletAPI.delete(id);
        loadOutlets();
      } catch (error) {
        setError('Failed to delete outlet');
      }
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await outletAPI.uploadExcel(file);
        loadOutlets();
        alert('Excel file uploaded successfully');
      } catch (error) {
        setError('Failed to upload Excel file');
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Outlet Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            component="label"
            sx={{ mr: 1 }}
          >
            Upload Excel
            <input type="file" hidden accept=".xlsx,.xls" onChange={handleExcelUpload} />
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Outlet
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Outlet</TableCell>
              <TableCell>Nama Outlet</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>GPS</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outlets.map((outlet) => (
              <TableRow key={outlet.id}>
                <TableCell>{outlet.idoutlet}</TableCell>
                <TableCell>{outlet.namaoutlet}</TableCell>
                <TableCell>{outlet.alamatoutlet}</TableCell>
                <TableCell>{outlet.warehouse}</TableCell>
                <TableCell>
                  {outlet.latitude}, {outlet.longitude}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(outlet)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(outlet.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingOutlet ? 'Edit Outlet' : 'Add Outlet'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="ID Outlet"
              value={formData.idoutlet}
              onChange={(e) => setFormData({ ...formData, idoutlet: e.target.value })}
              disabled={!!editingOutlet}
            />
            <TextField
              fullWidth
              label="Nama Outlet"
              value={formData.namaoutlet}
              onChange={(e) => setFormData({ ...formData, namaoutlet: e.target.value })}
            />
            <TextField
              fullWidth
              label="AMO"
              value={formData.amo}
              onChange={(e) => setFormData({ ...formData, amo: e.target.value })}
            />
            <TextField
              fullWidth
              label="Warehouse"
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
            />
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            />
          </Box>
          <TextField
            margin="normal"
            fullWidth
            label="Alamat Outlet"
            multiline
            rows={2}
            value={formData.alamatoutlet}
            onChange={(e) => setFormData({ ...formData, alamatoutlet: e.target.value })}
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

export default OutletList;
