const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase, runQuery, getRow, getAllRows } = require('../database/init');

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const db = getDatabase('menulogin');
    const user = await getRow(
      db,
      'SELECT * FROM menulogin WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, access_level: user.access_level },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        access_level: user.access_level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Add user
const addUser = async (req, res) => {
  try {
    const { username, password, access_level } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const db = getDatabase('menulogin');
    
    // Check if user already exists
    const existingUser = await getRow(
      db,
      'SELECT * FROM menulogin WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await runQuery(
      db,
      'INSERT INTO menulogin (username, password, access_level) VALUES (?, ?, ?)',
      [username, hashedPassword, access_level || 'user']
    );

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: { id: result.lastID, username, access_level: access_level || 'user' }
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add user',
      error: error.message
    });
  }
};

// Edit user
const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, access_level } = req.body;

    const db = getDatabase('menulogin');
    
    // Check if user exists
    const user = await getRow(
      db,
      'SELECT * FROM menulogin WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let query = 'UPDATE menulogin SET ';
    const params = [];

    if (username) {
      query += 'username = ?, ';
      params.push(username);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += 'password = ?, ';
      params.push(hashedPassword);
    }

    if (access_level) {
      query += 'access_level = ?, ';
      params.push(access_level);
    }

    query += 'updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    params.push(id);

    await runQuery(db, query, params);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Edit user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const db = getDatabase('menulogin');
    
    // Check if user exists
    const user = await getRow(
      db,
      'SELECT * FROM menulogin WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await runQuery(
      db,
      'DELETE FROM menulogin WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const db = getDatabase('menulogin');
    const users = await getAllRows(
      db,
      'SELECT id, username, access_level, created_at, updated_at FROM menulogin',
      []
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

module.exports = {
  login,
  addUser,
  editUser,
  deleteUser,
  getAllUsers
};
