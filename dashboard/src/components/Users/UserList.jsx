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
import { userAPI } from '../../services/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    jabatan: '',
    amo: '',
    warehouse: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data);
      setError('');
    } catch (error) {
      setError('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        nama: user.nama,
        jabatan: user.jabatan,
        amo: user.amo,
        warehouse: user.warehouse,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        nama: '',
        jabatan: '',
        amo: '',
        warehouse: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, formData);
      } else {
        await userAPI.create(formData);
      }
      handleCloseDialog();
      loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        loadUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await userAPI.uploadExcel(file);
        loadUsers();
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
        <Typography variant="h4">User Management</Typography>
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
            Add User
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
              <TableCell>Username</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Jabatan</TableCell>
              <TableCell>AMO</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.nama}</TableCell>
                <TableCell>{user.jabatan}</TableCell>
                <TableCell>{user.amo}</TableCell>
                <TableCell>{user.warehouse}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={!!editingUser}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nama"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Jabatan"
            value={formData.jabatan}
            onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
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

export default UserList;
