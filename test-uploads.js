const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api';

async function testUploads() {
  try {
    console.log('='.repeat(50));
    console.log('Testing Excel Upload Functionality');
    console.log('='.repeat(50));
    console.log();

    // Step 1: Login
    console.log('1. Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin-gis',
      password: 'gis2026'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      console.log();

      // Step 2: Test User Upload
      console.log('2. Testing User Upload...');
      if (fs.existsSync('./uploads/excel/datauser-test.xlsx')) {
        const userForm = new FormData();
        userForm.append('file', fs.createReadStream('./uploads/excel/datauser-test.xlsx'));
        
        const userUpload = await axios.post(`${API_URL}/users/upload-excel`, userForm, {
          headers: {
            ...userForm.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userUpload.data.success) {
          console.log('✅ User upload successful');
          console.log(`   - Records added: ${userUpload.data.data.successCount}`);
          console.log(`   - Errors: ${userUpload.data.data.errorCount}`);
        } else {
          console.log('❌ User upload failed:', userUpload.data.message);
        }
      } else {
        console.log('⚠️  datauser.xlsx not found');
      }
      console.log();

      // Step 3: Test Outlet Upload
      console.log('3. Testing Outlet Upload...');
      if (fs.existsSync('./uploads/excel/dataoutlet-test.xlsx')) {
        const outletForm = new FormData();
        outletForm.append('file', fs.createReadStream('./uploads/excel/dataoutlet-test.xlsx'));
        
        const outletUpload = await axios.post(`${API_URL}/outlets/upload-excel`, outletForm, {
          headers: {
            ...outletForm.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (outletUpload.data.success) {
          console.log('✅ Outlet upload successful');
          console.log(`   - Records added: ${outletUpload.data.data.successCount}`);
          console.log(`   - Errors: ${outletUpload.data.data.errorCount}`);
        } else {
          console.log('❌ Outlet upload failed:', outletUpload.data.message);
        }
      } else {
        console.log('⚠️  dataoutlet.xlsx not found');
      }
      console.log();

      // Step 4: Test MD Visit Upload
      console.log('4. Testing MD Visit Upload...');
      if (fs.existsSync('./uploads/excel/datavisitmd-test.xlsx')) {
        const mdForm = new FormData();
        mdForm.append('file', fs.createReadStream('./uploads/excel/datavisitmd-test.xlsx'));
        
        const mdUpload = await axios.post(`${API_URL}/visits/md/upload-excel`, mdForm, {
          headers: {
            ...mdForm.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (mdUpload.data.success) {
          console.log('✅ MD Visit upload successful');
          console.log(`   - Records added: ${mdUpload.data.data.successCount}`);
          console.log(`   - Errors: ${mdUpload.data.data.errorCount}`);
        } else {
          console.log('❌ MD Visit upload failed:', mdUpload.data.message);
        }
      } else {
        console.log('⚠️  datavisitmd-test.xlsx not found');
      }
      console.log();

      // Step 5: Test Sales Visit Upload
      console.log('5. Testing Sales Visit Upload...');
      if (fs.existsSync('./uploads/excel/datavisitsales-test.xlsx')) {
        const salesForm = new FormData();
        salesForm.append('file', fs.createReadStream('./uploads/excel/datavisitsales-test.xlsx'));
        
        const salesUpload = await axios.post(`${API_URL}/visits/sales/upload-excel`, salesForm, {
          headers: {
            ...salesForm.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (salesUpload.data.success) {
          console.log('✅ Sales Visit upload successful');
          console.log(`   - Records added: ${salesUpload.data.data.successCount}`);
          console.log(`   - Errors: ${salesUpload.data.data.errorCount}`);
        } else {
          console.log('❌ Sales Visit upload failed:', salesUpload.data.message);
        }
      } else {
        console.log('⚠️  datavisitsales-test.xlsx not found');
      }
      console.log();

      // Step 6: Verify Data
      console.log('6. Verifying Uploaded Data...');
      
      const users = await axios.get(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Users in database: ${users.data.data.length}`);
      
      const outlets = await axios.get(`${API_URL}/outlets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Outlets in database: ${outlets.data.data.length}`);
      
      const mdVisits = await axios.get(`${API_URL}/visits/md`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ MD Visits in database: ${mdVisits.data.data.length}`);
      
      const salesVisits = await axios.get(`${API_URL}/visits/sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Sales Visits in database: ${salesVisits.data.data.length}`);
      
      console.log();
      console.log('='.repeat(50));
      console.log('✅ All Tests Completed Successfully!');
      console.log('='.repeat(50));
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.response?.data || error.message);
  }
}

testUploads();
