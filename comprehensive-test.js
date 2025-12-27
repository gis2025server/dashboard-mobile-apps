const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testData = {
  userId: null,
  outletId: null,
  mdVisitId: null,
  salesVisitId: null,
  actionId: null
};

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function test(name, fn) {
  try {
    await fn();
    log(`✓ ${name}`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${name}`, 'red');
    log(`  Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  log('\n========================================', 'blue');
  log('COMPREHENSIVE API TEST SUITE', 'blue');
  log('========================================\n', 'blue');

  // 1. Authentication Tests
  log('=== AUTHENTICATION TESTS ===', 'yellow');
  
  if (await test('Login with default admin', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin-gis',
      password: 'gis2026'
    });
    authToken = res.data.token;
    if (!authToken) throw new Error('No token received');
  })) passed++; else failed++;

  if (await test('Login with wrong password should fail', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'admin-gis',
        password: 'wrong'
      });
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response?.status === 401) return;
      throw error;
    }
  })) passed++; else failed++;

  const headers = { Authorization: `Bearer ${authToken}` };

  // 2. User Management Tests
  log('\n=== USER MANAGEMENT TESTS ===', 'yellow');

  if (await test('Add new user', async () => {
    const res = await axios.post(`${BASE_URL}/users`, {
      username: 'test_user',
      nama: 'Test User',
      jabatan: 'MD',
      amo: 'AMO001',
      warehouse: 'WH001'
    }, { headers });
    testData.userId = res.data.data.id;
  })) passed++; else failed++;

  if (await test('Get all users', async () => {
    const res = await axios.get(`${BASE_URL}/users`, { headers });
    if (res.data.data.length === 0) throw new Error('No users found');
  })) passed++; else failed++;

  if (await test('Get user by ID', async () => {
    await axios.get(`${BASE_URL}/users/${testData.userId}`, { headers });
  })) passed++; else failed++;

  if (await test('Update user', async () => {
    await axios.put(`${BASE_URL}/users/${testData.userId}`, {
      nama: 'Updated Test User'
    }, { headers });
  })) passed++; else failed++;

  // 3. Outlet Management Tests
  log('\n=== OUTLET MANAGEMENT TESTS ===', 'yellow');

  if (await test('Add new outlet', async () => {
    const res = await axios.post(`${BASE_URL}/outlets`, {
      username: 'test_user',
      amo: 'AMO001',
      warehouse: 'WH001',
      idoutlet: 'OUT001',
      namaoutlet: 'Test Outlet',
      alamatoutlet: 'Jl. Test No. 123',
      latitude: -6.2088,
      longitude: 106.8456
    }, { headers });
    testData.outletId = res.data.data.id;
  })) passed++; else failed++;

  if (await test('Get all outlets', async () => {
    const res = await axios.get(`${BASE_URL}/outlets`, { headers });
    if (res.data.data.length === 0) throw new Error('No outlets found');
  })) passed++; else failed++;

  if (await test('Get outlet by ID', async () => {
    await axios.get(`${BASE_URL}/outlets/${testData.outletId}`, { headers });
  })) passed++; else failed++;

  if (await test('Update outlet', async () => {
    await axios.put(`${BASE_URL}/outlets/${testData.outletId}`, {
      namaoutlet: 'Updated Test Outlet'
    }, { headers });
  })) passed++; else failed++;

  // 4. MD Visit Schedule Tests
  log('\n=== MD VISIT SCHEDULE TESTS ===', 'yellow');

  if (await test('Add MD visit schedule', async () => {
    const res = await axios.post(`${BASE_URL}/visits/md`, {
      username: 'test_user',
      amo: 'AMO001',
      warehouse: 'WH001',
      idoutlet: 'OUT001',
      namaoutlet: 'Test Outlet',
      datevisit: '2025-12-25'
    }, { headers });
    testData.mdVisitId = res.data.data.id;
  })) passed++; else failed++;

  if (await test('Get all MD visits', async () => {
    const res = await axios.get(`${BASE_URL}/visits/md`, { headers });
    if (res.data.data.length === 0) throw new Error('No MD visits found');
  })) passed++; else failed++;

  if (await test('Get MD visit by ID', async () => {
    await axios.get(`${BASE_URL}/visits/md/${testData.mdVisitId}`, { headers });
  })) passed++; else failed++;

  // 5. Sales Visit Schedule Tests
  log('\n=== SALES VISIT SCHEDULE TESTS ===', 'yellow');

  if (await test('Add Sales visit schedule', async () => {
    const res = await axios.post(`${BASE_URL}/visits/sales`, {
      username: 'test_user',
      amo: 'AMO001',
      warehouse: 'WH001',
      idoutlet: 'OUT001',
      namaoutlet: 'Test Outlet',
      datevisit: '2025-12-26'
    }, { headers });
    testData.salesVisitId = res.data.data.id;
  })) passed++; else failed++;

  if (await test('Get all Sales visits', async () => {
    const res = await axios.get(`${BASE_URL}/visits/sales`, { headers });
    if (res.data.data.length === 0) throw new Error('No Sales visits found');
  })) passed++; else failed++;

  // 6. Visit Action Tests
  log('\n=== VISIT ACTION TESTS ===', 'yellow');

  if (await test('Start visit', async () => {
    const res = await axios.post(`${BASE_URL}/visit-actions/start`, {
      date: '2025-12-25',
      username: 'test_user'
    }, { headers });
    if (res.data.data.length === 0) throw new Error('No visits found for date');
  })) passed++; else failed++;

  if (await test('Check-in to visit', async () => {
    const res = await axios.post(`${BASE_URL}/visit-actions/checkin`, {
      visit_id: testData.mdVisitId,
      visit_type: 'md',
      username: 'test_user',
      latitude: -6.2088,
      longitude: 106.8456
    }, { headers });
    testData.actionId = res.data.data.action_id;
  })) passed++; else failed++;

  if (await test('Update POSM status', async () => {
    await axios.post(`${BASE_URL}/visit-actions/update-status`, {
      action_id: testData.actionId,
      status_posm: 'terpasang'
    }, { headers });
  })) passed++; else failed++;

  if (await test('Get all visit actions', async () => {
    const res = await axios.get(`${BASE_URL}/visit-actions`, { headers });
    if (res.data.data.length === 0) throw new Error('No visit actions found');
  })) passed++; else failed++;

  if (await test('Get visit action by ID', async () => {
    await axios.get(`${BASE_URL}/visit-actions/${testData.actionId}`, { headers });
  })) passed++; else failed++;

  // 7. Dashboard Tests
  log('\n=== DASHBOARD TESTS ===', 'yellow');

  if (await test('Get dashboard statistics', async () => {
    const res = await axios.get(`${BASE_URL}/dashboard/stats`, { headers });
    if (!res.data.data.summary) throw new Error('No summary data');
  })) passed++; else failed++;

  if (await test('Get user dashboard', async () => {
    const res = await axios.get(`${BASE_URL}/dashboard/my-dashboard`, { headers });
    if (!res.data.data.stats) throw new Error('No stats data');
  })) passed++; else failed++;

  // 8. Report Tests
  log('\n=== REPORT TESTS ===', 'yellow');

  if (await test('Get daily report', async () => {
    await axios.get(`${BASE_URL}/reports/daily`, { headers });
  })) passed++; else failed++;

  if (await test('Get report summary', async () => {
    const res = await axios.get(`${BASE_URL}/reports/summary`, { headers });
    if (!res.data.data.summary) throw new Error('No summary data');
  })) passed++; else failed++;

  // 9. Sync Tests
  log('\n=== SYNC TESTS ===', 'yellow');

  if (await test('Trigger manual sync', async () => {
    const res = await axios.post(`${BASE_URL}/sync/trigger`, {}, { headers });
    if (!res.data.success) throw new Error('Sync failed');
  })) passed++; else failed++;

  if (await test('Get sync logs', async () => {
    const res = await axios.get(`${BASE_URL}/sync/logs`, { headers });
    if (!res.data.data) throw new Error('No sync logs');
  })) passed++; else failed++;

  // 10. Cleanup Tests
  log('\n=== CLEANUP TESTS ===', 'yellow');

  if (await test('Delete MD visit', async () => {
    await axios.delete(`${BASE_URL}/visits/md/${testData.mdVisitId}`, { headers });
  })) passed++; else failed++;

  if (await test('Delete Sales visit', async () => {
    await axios.delete(`${BASE_URL}/visits/sales/${testData.salesVisitId}`, { headers });
  })) passed++; else failed++;

  if (await test('Delete outlet', async () => {
    await axios.delete(`${BASE_URL}/outlets/${testData.outletId}`, { headers });
  })) passed++; else failed++;

  if (await test('Delete user', async () => {
    await axios.delete(`${BASE_URL}/users/${testData.userId}`, { headers });
  })) passed++; else failed++;

  // Results
  log('\n========================================', 'blue');
  log('TEST RESULTS', 'blue');
  log('========================================', 'blue');
  log(`Total Tests: ${passed + failed}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`, 'blue');
  log('========================================\n', 'blue');

  if (failed === 0) {
    log('🎉 ALL TESTS PASSED! 🎉', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED', 'yellow');
  }
}

runTests().catch(error => {
  log(`\n❌ Test suite error: ${error.message}`, 'red');
  process.exit(1);
});
