const ExcelJS = require('exceljs');
const fs = require('fs');

async function createTestExcelFiles() {
  console.log('Creating test Excel files...\n');

  // Ensure directory exists
  if (!fs.existsSync('./uploads/excel')) {
    fs.mkdirSync('./uploads/excel', { recursive: true });
  }

  // 1. Create User Excel
  console.log('1. Creating datauser.xlsx...');
  const userWorkbook = new ExcelJS.Workbook();
  const userSheet = userWorkbook.addWorksheet('Users');
  
  userSheet.columns = [
    { header: 'username', key: 'username', width: 15 },
    { header: 'nama', key: 'nama', width: 25 },
    { header: 'jabatan', key: 'jabatan', width: 15 },
    { header: 'amo', key: 'amo', width: 15 },
    { header: 'warehouse', key: 'warehouse', width: 15 }
  ];
  
  userSheet.addRows([
    { username: 'user001', nama: 'John Doe', jabatan: 'MD', amo: 'AMO-001', warehouse: 'WH-001' },
    { username: 'user002', nama: 'Jane Smith', jabatan: 'Sales', amo: 'AMO-002', warehouse: 'WH-002' },
    { username: 'user003', nama: 'Bob Johnson', jabatan: 'MD', amo: 'AMO-001', warehouse: 'WH-001' }
  ]);
  
  await userWorkbook.xlsx.writeFile('./uploads/excel/datauser-test.xlsx');
  console.log('✅ datauser-test.xlsx created\n');

  // 2. Create Outlet Excel
  console.log('2. Creating dataoutlet.xlsx...');
  const outletWorkbook = new ExcelJS.Workbook();
  const outletSheet = outletWorkbook.addWorksheet('Outlets');
  
  outletSheet.columns = [
    { header: 'username', key: 'username', width: 15 },
    { header: 'amo', key: 'amo', width: 15 },
    { header: 'warehouse', key: 'warehouse', width: 15 },
    { header: 'idoutlet', key: 'idoutlet', width: 15 },
    { header: 'namaoutlet', key: 'namaoutlet', width: 30 },
    { header: 'alamatoutlet', key: 'alamatoutlet', width: 40 },
    { header: 'latitude', key: 'latitude', width: 15 },
    { header: 'longitude', key: 'longitude', width: 15 }
  ];
  
  outletSheet.addRows([
    { 
      username: 'admin-gis', 
      amo: 'AMO-001', 
      warehouse: 'WH-001', 
      idoutlet: 'OUT-001', 
      namaoutlet: 'Toko Maju Jaya', 
      alamatoutlet: 'Jl. Sudirman No. 123, Jakarta', 
      latitude: -6.2088, 
      longitude: 106.8456 
    },
    { 
      username: 'admin-gis', 
      amo: 'AMO-001', 
      warehouse: 'WH-001', 
      idoutlet: 'OUT-002', 
      namaoutlet: 'Toko Sejahtera', 
      alamatoutlet: 'Jl. Thamrin No. 456, Jakarta', 
      latitude: -6.1944, 
      longitude: 106.8229 
    },
    { 
      username: 'admin-gis', 
      amo: 'AMO-002', 
      warehouse: 'WH-002', 
      idoutlet: 'OUT-003', 
      namaoutlet: 'Toko Berkah', 
      alamatoutlet: 'Jl. Gatot Subroto No. 789, Jakarta', 
      latitude: -6.2297, 
      longitude: 106.8253 
    }
  ]);
  
  await outletWorkbook.xlsx.writeFile('./uploads/excel/dataoutlet-test.xlsx');
  console.log('✅ dataoutlet-test.xlsx created\n');

  // 3. Create MD Visit Excel
  console.log('3. Creating datavisitmd.xlsx...');
  const mdWorkbook = new ExcelJS.Workbook();
  const mdSheet = mdWorkbook.addWorksheet('MD Visits');
  
  mdSheet.columns = [
    { header: 'username', key: 'username', width: 15 },
    { header: 'amo', key: 'amo', width: 15 },
    { header: 'warehouse', key: 'warehouse', width: 15 },
    { header: 'idoutlet', key: 'idoutlet', width: 15 },
    { header: 'namaoutlet', key: 'namaoutlet', width: 30 },
    { header: 'datevisit', key: 'datevisit', width: 15 }
  ];
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  mdSheet.addRows([
    { username: 'admin-gis', amo: 'AMO-001', warehouse: 'WH-001', idoutlet: 'OUT-001', namaoutlet: 'Toko Maju Jaya', datevisit: today },
    { username: 'admin-gis', amo: 'AMO-001', warehouse: 'WH-001', idoutlet: 'OUT-002', namaoutlet: 'Toko Sejahtera', datevisit: tomorrow },
    { username: 'admin-gis', amo: 'AMO-002', warehouse: 'WH-002', idoutlet: 'OUT-003', namaoutlet: 'Toko Berkah', datevisit: today }
  ]);
  
  await mdWorkbook.xlsx.writeFile('./uploads/excel/datavisitmd-test.xlsx');
  console.log('✅ datavisitmd-test.xlsx created\n');

  // 4. Create Sales Visit Excel
  console.log('4. Creating datavisitsales.xlsx...');
  const salesWorkbook = new ExcelJS.Workbook();
  const salesSheet = salesWorkbook.addWorksheet('Sales Visits');
  
  salesSheet.columns = [
    { header: 'username', key: 'username', width: 15 },
    { header: 'amo', key: 'amo', width: 15 },
    { header: 'warehouse', key: 'warehouse', width: 15 },
    { header: 'idoutlet', key: 'idoutlet', width: 15 },
    { header: 'namaoutlet', key: 'namaoutlet', width: 30 },
    { header: 'datevisit', key: 'datevisit', width: 15 }
  ];
  
  salesSheet.addRows([
    { username: 'admin-gis', amo: 'AMO-001', warehouse: 'WH-001', idoutlet: 'OUT-001', namaoutlet: 'Toko Maju Jaya', datevisit: today },
    { username: 'admin-gis', amo: 'AMO-001', warehouse: 'WH-001', idoutlet: 'OUT-002', namaoutlet: 'Toko Sejahtera', datevisit: tomorrow }
  ]);
  
  await salesWorkbook.xlsx.writeFile('./uploads/excel/datavisitsales-test.xlsx');
  console.log('✅ datavisitsales-test.xlsx created\n');

  console.log('='.repeat(50));
  console.log('✅ All test Excel files created successfully!');
  console.log('='.repeat(50));
  console.log('\nFiles created:');
  console.log('- uploads/excel/datauser-test.xlsx (3 users)');
  console.log('- uploads/excel/dataoutlet-test.xlsx (3 outlets)');
  console.log('- uploads/excel/datavisitmd-test.xlsx (3 MD visits)');
  console.log('- uploads/excel/datavisitsales-test.xlsx (2 sales visits)');
}

createTestExcelFiles().catch(console.error);
