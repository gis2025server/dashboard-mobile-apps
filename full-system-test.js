const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testUserId = '';
let testOutletId = '';
let testVisitMdId = '';
let testVisitSalesId = '';
let testVisitActionId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status} - ${testName}`, color);
  if (details) log(`  ${details}`, 'cyan');
}

// Test counter
let totalTests = 0;
let passedTests = 0;

async function runTest(testName, testFn) {
  totalTests++;
  try {
    await testFn();
    passedTests++;
    logTest(testName, true);
    return true;
  } catch (error) {
    logTest(testName, false, error.message);
    return false;
  }
}

// ============================================
// AUTHENTICATION TESTS
// ============================================
async function testAuthentication() {
  log('\n=== AUTHENTICATION TESTS ===', 'blue');

  await runTest('Login with valid credentials', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin-gis',
      password: 'gis2026'
    });
    if (!response.data.success) throw new Error('Login failed');
    if (!response.data.token) throw new Error('No token received');
    authToken = response.data.token;
  });

  await runTest('Login with invalid credentials', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'invalid',
        password: 'wrong'
      });
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) return;
      throw error;
    }
  });

  await runTest('Access protected route without token', async () => {
    try {
      await axios.get(`${BASE_URL}/users`);
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) return;
      throw error;
    }
  });
}

// ============================================
// USER MANAGEMENT TESTS
// ============================================
async function testUserManagement() {
  log('\n=== USER MANAGEMENT TESTS ===', 'blue');

  await runTest('Get all users', async () => {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get users');
  });

  await runTest('Create new user', async () => {
    const response = await axios.post(`${BASE_URL}/users`, {
      username: `test_user_${Date.now()}`,
      nama: 'Test User',
      jabatan: 'MD',
      amo: 'AMO-001',
      warehouse: 'WH-001'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to create user');
    testUserId = response.data.data.id;
  });

  await runTest('Update user', async () => {
    const response = await axios.put(`${BASE_URL}/users/${testUserId}`, {
      nama: 'Updated Test User',
      jabatan: 'Sales',
      amo: 'AMO-002',
      warehouse: 'WH-002'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to update user');
  });

  await runTest('Get user by ID', async () => {
    const response = await axios.get(`${BASE_URL}/users/${testUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get user');
    if (response.data.data.nama !== 'Updated Test User') {
      throw new Error('User not updated correctly');
    }
  });
}

// ============================================
// OUTLET MANAGEMENT TESTS
// ============================================
async function testOutletManagement() {
  log('\n=== OUTLET MANAGEMENT TESTS ===', 'blue');

  await runTest('Create new outlet', async () => {
    const response = await axios.post(`${BASE_URL}/outlets`, {
      username: 'admin-gis',
      amo: 'AMO-001',
      warehouse: 'WH-001',
      idoutlet: `OUT-${Date.now()}`,
      namaoutlet: 'Test Outlet',
      alamatoutlet: 'Test Address 123',
      latitude: -6.2088,
      longitude: 106.8456
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to create outlet');
    testOutletId = response.data.data.id;
  });

  await runTest('Update outlet with GPS coordinates', async () => {
    const response = await axios.put(`${BASE_URL}/outlets/${testOutletId}`, {
      namaoutlet: 'Updated Test Outlet',
      latitude: -6.2100,
      longitude: 106.8500
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to update outlet');
  });

  await runTest('Get all outlets', async () => {
    const response = await axios.get(`${BASE_URL}/outlets`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get outlets');
    if (!Array.isArray(response.data.data)) throw new Error('Invalid response format');
  });
}

// ============================================
// VISIT SCHEDULING TESTS
// ============================================
async function testVisitScheduling() {
  log('\n=== VISIT SCHEDULING TESTS ===', 'blue');

  await runTest('Create MD visit schedule', async () => {
    const response = await axios.post(`${BASE_URL}/visits/md`, {
      username: 'admin-gis',
      amo: 'AMO-001',
      warehouse: 'WH-001',
      idoutlet: 'OUT-001',
      namaoutlet: 'Test Outlet',
      datevisit: new Date().toISOString().split('T')[0]
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to create MD visit');
    testVisitMdId = response.data.data.id;
  });

  await runTest('Create Sales visit schedule', async () => {
    const response = await axios.post(`${BASE_URL}/visits/sales`, {
      username: 'admin-gis',
      amo: 'AMO-001',
      warehouse: 'WH-001',
      idoutlet: 'OUT-001',
      namaoutlet: 'Test Outlet',
      datevisit: new Date().toISOString().split('T')[0]
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to create Sales visit');
    testVisitSalesId = response.data.data.id;
  });

  await runTest('Get MD visits', async () => {
    const response = await axios.get(`${BASE_URL}/visits/md`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get MD visits');
  });

  await runTest('Get Sales visits', async () => {
    const response = await axios.get(`${BASE_URL}/visits/sales`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get Sales visits');
  });
}

// ============================================
// VISIT ACTION WORKFLOW TESTS
// ============================================
async function testVisitActionWorkflow() {
  log('\n=== VISIT ACTION WORKFLOW TESTS ===', 'blue');

  await runTest('Start visit', async () => {
    const response = await axios.post(`${BASE_URL}/visit-actions/start`, {
      visit_type: 'md',
      username: 'admin-gis',
      datevisit: new Date().toISOString().split('T')[0]
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to start visit');
    if (!response.data.data.visits) throw new Error('No visits returned');
  });

  await runTest('Check-in with GPS', async () => {
    const response = await axios.post(`${BASE_URL}/visit-actions/checkin`, {
      visit_id: testVisitMdId,
      visit_type: 'md',
      latitude: -6.2088,
      longitude: 106.8456
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to check-in');
    testVisitActionId = response.data.data.id;
  });

  await runTest('Update POSM status', async () => {
    const response = await axios.put(`${BASE_URL}/visit-actions/${testVisitActionId}/status`, {
      status_posm: 'terpasang'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to update status');
  });

  await runTest('Check-out', async () => {
    const response = await axios.post(`${BASE_URL}/visit-actions/checkout`, {
      visit_action_id: testVisitActionId,
      latitude: -6.2088,
      longitude: 106.8456
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to check-out');
  });

  await runTest('Get all visit actions', async () => {
    const response = await axios.get(`${BASE_URL}/visit-actions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get visit actions');
  });
}

// ============================================
// DASHBOARD TESTS
// ============================================
async function testDashboard() {
  log('\n=== DASHBOARD TESTS ===', 'blue');

  await runTest('Get dashboard statistics', async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get stats');
    if (!response.data.data.summary) throw new Error('No summary data');
    if (!response.data.data.charts) throw new Error('No chart data');
  });

  await runTest('Get user dashboard', async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get user dashboard');
  });
}

// ============================================
// REPORT TESTS
// ============================================
async function testReports() {
  log('\n=== REPORT TESTS ===', 'blue');

  await runTest('Get daily report', async () => {
    const response = await axios.get(`${BASE_URL}/reports/daily`, {
      params: {
        date: new Date().toISOString().split('T')[0]
      },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get daily report');
  });

  await runTest('Get report summary', async () => {
    const response = await axios.get(`${BASE_URL}/reports/summary`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get report summary');
  });

  await runTest('Export report to Excel', async () => {
    const response = await axios.get(`${BASE_URL}/reports/export`, {
      params: {
        date: new Date().toISOString().split('T')[0]
      },
      headers: { Authorization: `Bearer ${authToken}` },
      responseType: 'blob'
    });
    if (!response.data) throw new Error('No data received');
  });
}

// ============================================
// SYNC TESTS
// ============================================
async function testSync() {
  log('\n=== SYNC TESTS ===', 'blue');

  await runTest('Trigger manual sync', async () => {
    const response = await axios.post(`${BASE_URL}/sync/trigger`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to trigger sync');
  });

  await runTest('Get sync logs', async () => {
    const response = await axios.get(`${BASE_URL}/sync/logs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to get sync logs');
  });
}

// ============================================
// CLEANUP TESTS
// ============================================
async function testCleanup() {
  log('\n=== CLEANUP TESTS ===', 'blue');

  await runTest('Delete test user', async () => {
    if (!testUserId) return;
    const response = await axios.delete(`${BASE_URL}/users/${testUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to delete user');
  });

  await runTest('Delete test outlet', async () => {
    if (!testOutletId) return;
    const response = await axios.delete(`${BASE_URL}/outlets/${testOutletId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to delete outlet');
  });

  await runTest('Delete test MD visit', async () => {
    if (!testVisitMdId) return;
    const response = await axios.delete(`${BASE_URL}/visits/md/${testVisitMdId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to delete MD visit');
  });

  await runTest('Delete test Sales visit', async () => {
    if (!testVisitSalesId) return;
    const response = await axios.delete(`${BASE_URL}/visits/sales/${testVisitSalesId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!response.data.success) throw new Error('Failed to delete Sales visit');
  });
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  log('\n╔════════════════════════════════════════════╗', 'cyan');
  log('║   FULL SYSTEM TEST - Backend API          ║', 'cyan');
  log('╚════════════════════════════════════════════╝', 'cyan');

  try {
    await testAuthentication();
    await testUserManagement();
    await testOutletManagement();
    await testVisitScheduling();
    await testVisitActionWorkflow();
    await testDashboard();
    await testReports();
    await testSync();
    await testCleanup();

    // Final summary
    log('\n╔════════════════════════════════════════════╗', 'cyan');
    log('║           TEST SUMMARY                     ║', 'cyan');
    log('╚════════════════════════════════════════════╝', 'cyan');
    log(`Total Tests: ${totalTests}`, 'blue');
    log(`Passed: ${passedTests}`, 'green');
    log(`Failed: ${totalTests - passedTests}`, 'red');
    log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`, 'yellow');

    if (passedTests === totalTests) {
      log('\n🎉 ALL TESTS PASSED! 🎉', 'green');
    } else {
      log('\n⚠️  SOME TESTS FAILED ⚠️', 'red');
    }

  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests();
