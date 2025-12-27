const { getDatabase, runQuery, getRow, getAllRows } = require('../database/init');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Get daily report
const getDailyReport = async (req, res) => {
  try {
    const { date, username, visit_type } = req.query;

    let query = 'SELECT * FROM visitaction WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND DATE(created_at) = ?';
      params.push(date);
    }

    if (username) {
      query += ' AND username = ?';
      params.push(username);
    }

    if (visit_type) {
      query += ' AND visit_type = ?';
      params.push(visit_type);
    }

    query += ' ORDER BY created_at DESC';

    const db = getDatabase('visitaction');
    const reports = await getAllRows(db, query, params);

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily report',
      error: error.message
    });
  }
};

// Export report to Excel
const exportReport = async (req, res) => {
  try {
    const { date, username, visit_type, start_date, end_date } = req.query;

    let query = 'SELECT * FROM visitaction WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND DATE(created_at) = ?';
      params.push(date);
    }

    if (start_date && end_date) {
      query += ' AND DATE(created_at) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    if (username) {
      query += ' AND username = ?';
      params.push(username);
    }

    if (visit_type) {
      query += ' AND visit_type = ?';
      params.push(visit_type);
    }

    query += ' ORDER BY created_at DESC';

    const db = getDatabase('visitaction');
    const reports = await getAllRows(db, query, params);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Report');

    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Visit Type', key: 'visit_type', width: 12 },
      { header: 'Username', key: 'username', width: 15 },
      { header: 'Nama MD', key: 'nama_md', width: 20 },
      { header: 'AMO', key: 'amo', width: 15 },
      { header: 'Warehouse', key: 'warehouse', width: 15 },
      { header: 'ID Outlet', key: 'idoutlet', width: 15 },
      { header: 'Nama Outlet', key: 'namaoutlet', width: 25 },
      { header: 'Alamat Outlet', key: 'alamatoutlet', width: 35 },
      { header: 'Check-in Time', key: 'checkin_time', width: 20 },
      { header: 'Check-out Time', key: 'checkout_time', width: 20 },
      { header: 'Dokumentasi Before', key: 'dokumentasi_before', width: 30 },
      { header: 'Dokumentasi After', key: 'dokumentasi_after', width: 30 },
      { header: 'Status POSM', key: 'status_posm', width: 20 }
    ];

    // Add data rows
    reports.forEach(report => {
      worksheet.addRow({
        id: report.id,
        visit_type: report.visit_type || '-',
        username: report.username,
        nama_md: report.nama_md,
        amo: report.amo || '-',
        warehouse: report.warehouse || '-',
        idoutlet: report.idoutlet,
        namaoutlet: report.namaoutlet,
        alamatoutlet: report.alamatoutlet,
        checkin_time: report.checkin_time || '-',
        checkout_time: report.checkout_time || '-',
        dokumentasi_before: report.dokumentasi_before || '-',
        dokumentasi_after: report.dokumentasi_after || '-',
        status_posm: report.status_posm || '-'
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generate filename
    const dateStr = date || (start_date && end_date ? `${start_date}_to_${end_date}` : 'all');
    const filename = `report_${dateStr}_${Date.now()}.xlsx`;
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    // Write to file
    await workbook.xlsx.writeFile(filepath);

    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Delete file after download
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    });
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: error.message
    });
  }
};

// Get report summary
const getReportSummary = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const db = getDatabase('visitaction');
    
    let query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_visits,
        SUM(CASE WHEN checkout_time IS NOT NULL THEN 1 ELSE 0 END) as completed_visits,
        SUM(CASE WHEN status_posm = 'terpasang' THEN 1 ELSE 0 END) as terpasang,
        SUM(CASE WHEN status_posm = 'outlet tidak ada' THEN 1 ELSE 0 END) as outlet_tidak_ada,
        SUM(CASE WHEN status_posm = 'toko tutup' THEN 1 ELSE 0 END) as toko_tutup
      FROM visitaction
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      query += ' AND DATE(created_at) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND DATE(created_at) <= ?';
      params.push(end_date);
    }

    query += ' GROUP BY DATE(created_at) ORDER BY date DESC';

    const summary = await getAllRows(db, query, params);

    // Get overall totals
    let totalQuery = `
      SELECT 
        COUNT(*) as total_visits,
        SUM(CASE WHEN checkout_time IS NOT NULL THEN 1 ELSE 0 END) as completed_visits,
        SUM(CASE WHEN status_posm = 'terpasang' THEN 1 ELSE 0 END) as terpasang,
        SUM(CASE WHEN status_posm = 'outlet tidak ada' THEN 1 ELSE 0 END) as outlet_tidak_ada,
        SUM(CASE WHEN status_posm = 'toko tutup' THEN 1 ELSE 0 END) as toko_tutup
      FROM visitaction
      WHERE 1=1
    `;

    const totalParams = [];

    if (start_date) {
      totalQuery += ' AND DATE(created_at) >= ?';
      totalParams.push(start_date);
    }

    if (end_date) {
      totalQuery += ' AND DATE(created_at) <= ?';
      totalParams.push(end_date);
    }

    const totals = await getRow(db, totalQuery, totalParams);

    res.json({
      success: true,
      data: {
        summary,
        totals
      }
    });
  } catch (error) {
    console.error('Get report summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report summary',
      error: error.message
    });
  }
};

module.exports = {
  getDailyReport,
  exportReport,
  getReportSummary
};
