const { getDatabase, runQuery, getRow, getAllRows } = require('../database/init');
const path = require('path');
const fs = require('fs');

// Start visit - get scheduled visits for a user on a specific date
const startVisit = async (req, res) => {
  try {
    const { date, username } = req.body;

    if (!date || !username) {
      return res.status(400).json({
        success: false,
        message: 'Date and username are required'
      });
    }

    // Get MD visits
    const mdDb = getDatabase('datavisitmd');
    const mdVisits = await getAllRows(
      mdDb,
      'SELECT * FROM datavisitmd WHERE username = ? AND datevisit = ? AND status = ?',
      [username, date, 'scheduled']
    );

    // Get Sales visits
    const salesDb = getDatabase('datavisitsales');
    const salesVisits = await getAllRows(
      salesDb,
      'SELECT * FROM datavisitsales WHERE username = ? AND datevisit = ? AND status = ?',
      [username, date, 'scheduled']
    );

    // Combine and add visit type
    const allVisits = [
      ...mdVisits.map(v => ({ ...v, visit_type: 'md' })),
      ...salesVisits.map(v => ({ ...v, visit_type: 'sales' }))
    ];

    res.json({
      success: true,
      data: allVisits
    });
  } catch (error) {
    console.error('Start visit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get visits',
      error: error.message
    });
  }
};

// Check-in to a visit location
const checkIn = async (req, res) => {
  try {
    const { visit_id, visit_type, username, latitude, longitude } = req.body;

    if (!visit_id || !visit_type || !username || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Get visit details
    const visitDbName = visit_type === 'md' ? 'datavisitmd' : 'datavisitsales';
    const visitDb = getDatabase(visitDbName);
    const tableName = visit_type === 'md' ? 'datavisitmd' : 'datavisitsales';
    
    const visit = await getRow(
      visitDb,
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [visit_id]
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }

    // Get outlet details
    const outletDb = getDatabase('dataoutlet');
    const outlet = await getRow(
      outletDb,
      'SELECT * FROM dataoutlet WHERE idoutlet = ?',
      [visit.idoutlet]
    );

    if (!outlet) {
      return res.status(404).json({
        success: false,
        message: 'Outlet not found'
      });
    }

    // Get user details
    const userDb = getDatabase('datauser');
    const user = await getRow(
      userDb,
      'SELECT * FROM datauser WHERE username = ?',
      [username]
    );

    // Create visit action record
    const actionDb = getDatabase('visitaction');
    const result = await runQuery(
      actionDb,
      `INSERT INTO visitaction (
        visit_id, visit_type, username, nama_md, amo, warehouse, idoutlet, namaoutlet, alamatoutlet,
        outlet_latitude, outlet_longitude, checkin_latitude, checkin_longitude, checkin_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        visit_id,
        visit_type,
        username,
        user ? user.nama : username,
        visit.amo || '',
        visit.warehouse || '',
        outlet.idoutlet,
        outlet.namaoutlet,
        outlet.alamatoutlet,
        outlet.latitude,
        outlet.longitude,
        latitude,
        longitude
      ]
    );

    res.json({
      success: true,
      message: 'Check-in successful',
      data: { 
        action_id: result.lastID,
        outlet: outlet
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check-in',
      error: error.message
    });
  }
};

// Upload documentation photo
const uploadPhoto = async (req, res) => {
  try {
    const { action_id, photo_type } = req.body;

    if (!action_id || !photo_type || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Action ID, photo type, and file are required'
      });
    }

    if (!['before', 'after'].includes(photo_type)) {
      return res.status(400).json({
        success: false,
        message: 'Photo type must be "before" or "after"'
      });
    }

    const photoPath = `/uploads/images/${req.file.filename}`;
    const db = getDatabase('visitaction');

    const field = photo_type === 'before' ? 'dokumentasi_before' : 'dokumentasi_after';
    await runQuery(
      db,
      `UPDATE visitaction SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [photoPath, action_id]
    );

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: { photoPath }
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo',
      error: error.message
    });
  }
};

// Update POSM status
const updateStatus = async (req, res) => {
  try {
    const { action_id, status_posm } = req.body;

    if (!action_id || !status_posm) {
      return res.status(400).json({
        success: false,
        message: 'Action ID and POSM status are required'
      });
    }

    const validStatuses = ['terpasang', 'outlet tidak ada', 'toko tutup'];
    if (!validStatuses.includes(status_posm)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid POSM status. Must be: terpasang, outlet tidak ada, or toko tutup'
      });
    }

    const db = getDatabase('visitaction');
    await runQuery(
      db,
      'UPDATE visitaction SET status_posm = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status_posm, action_id]
    );

    res.json({
      success: true,
      message: 'POSM status updated successfully'
    });
  } catch (error) {
    console.error('Update POSM status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update POSM status',
      error: error.message
    });
  }
};

// Check-out from visit
const checkOut = async (req, res) => {
  try {
    const { action_id, latitude, longitude } = req.body;

    if (!action_id || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Action ID and GPS coordinates are required'
      });
    }

    const db = getDatabase('visitaction');
    
    // Verify all required fields are filled
    const action = await getRow(
      db,
      'SELECT * FROM visitaction WHERE id = ?',
      [action_id]
    );
    
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Visit action not found'
      });
    }

    if (!action.checkin_time) {
      return res.status(400).json({
        success: false,
        message: 'Must check-in first'
      });
    }

    if (!action.dokumentasi_before || !action.dokumentasi_after) {
      return res.status(400).json({
        success: false,
        message: 'Must upload both before and after photos'
      });
    }

    if (!action.status_posm) {
      return res.status(400).json({
        success: false,
        message: 'Must set POSM status'
      });
    }

    // Update checkout info
    await runQuery(
      db,
      'UPDATE visitaction SET checkout_latitude = ?, checkout_longitude = ?, checkout_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [latitude, longitude, action_id]
    );

    // Update visit status to completed
    const visitDbName = action.visit_type === 'md' ? 'datavisitmd' : 'datavisitsales';
    const visitDb = getDatabase(visitDbName);
    const tableName = action.visit_type === 'md' ? 'datavisitmd' : 'datavisitsales';
    
    await runQuery(
      visitDb,
      `UPDATE ${tableName} SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [action.visit_id]
    );

    res.json({
      success: true,
      message: 'Check-out successful. Visit completed!'
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check-out',
      error: error.message
    });
  }
};

// Get all visit actions
const getAllVisitActions = async (req, res) => {
  try {
    const { username, date, status } = req.query;

    let query = 'SELECT * FROM visitaction WHERE 1=1';
    const params = [];

    if (username) {
      query += ' AND username = ?';
      params.push(username);
    }

    if (date) {
      query += ' AND DATE(created_at) = ?';
      params.push(date);
    }

    if (status === 'completed') {
      query += ' AND checkout_time IS NOT NULL';
    } else if (status === 'in_progress') {
      query += ' AND checkout_time IS NULL';
    }

    query += ' ORDER BY created_at DESC';

    const db = getDatabase('visitaction');
    const actions = await getAllRows(db, query, params);

    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Get visit actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get visit actions',
      error: error.message
    });
  }
};

// Get visit action by ID
const getVisitActionById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = getDatabase('visitaction');
    const action = await getRow(
      db,
      'SELECT * FROM visitaction WHERE id = ?',
      [id]
    );

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Visit action not found'
      });
    }

    res.json({
      success: true,
      data: action
    });
  } catch (error) {
    console.error('Get visit action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get visit action',
      error: error.message
    });
  }
};

// Get visit actions by username
const getVisitActionsByUser = async (req, res) => {
  try {
    const { username } = req.params;

    const db = getDatabase('visitaction');
    const actions = await getAllRows(
      db,
      'SELECT * FROM visitaction WHERE username = ? ORDER BY created_at DESC',
      [username]
    );

    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Get user visit actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user visit actions',
      error: error.message
    });
  }
};

module.exports = {
  startVisit,
  checkIn,
  uploadPhoto,
  updateStatus,
  checkOut,
  getAllVisitActions,
  getVisitActionById,
  getVisitActionsByUser
};
