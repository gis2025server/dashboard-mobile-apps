const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test login
async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin-gis',
      password: 'gis2026'
    });
    
    if (response.data.success) {
      authToken = response.data.token;
      console.log('✓ Login successful');
      console.log('Token:', authToken.substring(0, 20) + '...');
      return true;
    }
  } catch (error) {
    console.log('✗ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get dashboard stats
async function testDashboardStats() {
  console.log('\n=== Testing Dashboard Stats ===');
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      console.log('✓ Dashboard stats retrieved');
      console.log('Total Users:', response.data.data.summary.totalUsers);
      console.log('Total Outlets:', response.data.data.summary.totalOutlets);
      return true;
    }
  } catch (error) {
    console.log('✗ Dashboard stats failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test add user
async function testAddUser() {
  console.log('\n=== Testing Add User ===');
  try {
    const response = await axios.post(`${BASE_URL}/users`, {
      username: 'test_user',
      nama: 'Test User',
      jabatan: 'Sales',
      amo: 'AMO-TEST',
      warehouse: 'WH-Test'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      console.log('✓ User added successfully');
      console.log('User ID:', response.data.data.id);
      return true;
    }
  } catch (error) {
    console.log('✗ Add user failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get all users
async function testGetUsers() {
  console.log('\n=== Testing Get All Users ===');
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      console.log('✓ Users retrieved');
      console.log('Total users:', response.data.data.length);
      return true;
    }
  } catch (error) {
    console.log('✗ Get users failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test health check
async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    
    if (response.data.success) {
      console.log('✓ API is running');
      console.log('Timestamp:', response.data.timestamp);
      return true;
    }
  } catch (error) {
    console.log('✗ Health check failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('========================================');
  console.log('API Testing Suite');
  console.log('========================================');
  
  let passed = 0;
  let failed = 0;
  
  // Test health check first
  if (await testHealthCheck()) passed++; else failed++;
  
  // Test login
  if (await testLogin()) {
    passed++;
    
    // Only run authenticated tests if login succeeds
    if (await testDashboardStats()) passed++; else failed++;
    if (await testAddUser()) passed++; else failed++;
    if (await testGetUsers()) passed++; else failed++;
  } else {
    failed++;
  }
  
  console.log('\n========================================');
  console.log('Test Results');
  console.log('========================================');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('========================================\n');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite error:', error.message);
  process.exit(1);
});
