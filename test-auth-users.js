const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Test credentials
const adminCredentials = {
  username: 'admin-gis',
  password: 'gis2026'
};

let authToken = '';
let testUserId = null;

// Helper function to log test results
function logTest(testName, success, message) {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}`);
  if (message) console.log(`   ${message}`);
  console.log('');
}

// Test 1: Login to get token
async function testLogin() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    authToken = response.data.token;
    logTest('Login', true, `Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    logTest('Login', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 2: Get all login users
async function testGetAllUsers() {
  try {
    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const users = response.data.data;
    logTest('Get All Login Users', true, `Found ${users.length} users: ${users.map(u => u.username).join(', ')}`);
    return true;
  } catch (error) {
    logTest('Get All Login Users', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Create new login user
async function testCreateUser() {
  try {
    const newUser = {
      username: 'testuser-' + Date.now(),
      password: 'test123456',
      access_level: 'user'
    };
    
    const response = await axios.post(`${API_URL}/auth/users`, newUser, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testUserId = response.data.data.id;
    logTest('Create Login User', true, `Created user: ${newUser.username} (ID: ${testUserId})`);
    return true;
  } catch (error) {
    logTest('Create Login User', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Create duplicate user (should fail)
async function testCreateDuplicateUser() {
  try {
    const duplicateUser = {
      username: 'admin-gis',
      password: 'test123',
      access_level: 'user'
    };
    
    await axios.post(`${API_URL}/auth/users`, duplicateUser, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Create Duplicate User (Should Fail)', false, 'Should have rejected duplicate username');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('Create Duplicate User (Should Fail)', true, 'Correctly rejected: ' + error.response.data.message);
      return true;
    }
    logTest('Create Duplicate User (Should Fail)', false, error.message);
    return false;
  }
}

// Test 5: Create user without password (should fail)
async function testCreateUserWithoutPassword() {
  try {
    const invalidUser = {
      username: 'nopassword',
      access_level: 'user'
    };
    
    await axios.post(`${API_URL}/auth/users`, invalidUser, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Create User Without Password (Should Fail)', false, 'Should have rejected missing password');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('Create User Without Password (Should Fail)', true, 'Correctly rejected: ' + error.response.data.message);
      return true;
    }
    logTest('Create User Without Password (Should Fail)', false, error.message);
    return false;
  }
}

// Test 6: Update login user
async function testUpdateUser() {
  try {
    const updateData = {
      access_level: 'admin'
    };
    
    await axios.put(`${API_URL}/auth/users/${testUserId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Update Login User', true, `Updated user ID ${testUserId} to admin`);
    return true;
  } catch (error) {
    logTest('Update Login User', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 7: Update user password
async function testUpdateUserPassword() {
  try {
    const updateData = {
      password: 'newpassword123',
      access_level: 'user'
    };
    
    await axios.put(`${API_URL}/auth/users/${testUserId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Update User Password', true, `Updated password for user ID ${testUserId}`);
    return true;
  } catch (error) {
    logTest('Update User Password', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 8: Update non-existent user (should fail)
async function testUpdateNonExistentUser() {
  try {
    const updateData = {
      access_level: 'admin'
    };
    
    await axios.put(`${API_URL}/auth/users/99999`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Update Non-Existent User (Should Fail)', false, 'Should have rejected invalid user ID');
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      logTest('Update Non-Existent User (Should Fail)', true, 'Correctly rejected: ' + error.response.data.message);
      return true;
    }
    logTest('Update Non-Existent User (Should Fail)', false, error.message);
    return false;
  }
}

// Test 9: Delete login user
async function testDeleteUser() {
  try {
    await axios.delete(`${API_URL}/auth/users/${testUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Delete Login User', true, `Deleted user ID ${testUserId}`);
    return true;
  } catch (error) {
    logTest('Delete Login User', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 10: Delete non-existent user (should fail)
async function testDeleteNonExistentUser() {
  try {
    await axios.delete(`${API_URL}/auth/users/99999`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logTest('Delete Non-Existent User (Should Fail)', false, 'Should have rejected invalid user ID');
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      logTest('Delete Non-Existent User (Should Fail)', true, 'Correctly rejected: ' + error.response.data.message);
      return true;
    }
    logTest('Delete Non-Existent User (Should Fail)', false, error.message);
    return false;
  }
}

// Test 11: Access without token (should fail)
async function testUnauthorizedAccess() {
  try {
    await axios.get(`${API_URL}/auth/users`);
    
    logTest('Unauthorized Access (Should Fail)', false, 'Should have rejected request without token');
    return false;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logTest('Unauthorized Access (Should Fail)', true, 'Correctly rejected unauthorized request');
      return true;
    }
    logTest('Unauthorized Access (Should Fail)', false, error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('LOGIN USER MANAGEMENT API TESTS');
  console.log('='.repeat(60));
  console.log('');

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  const tests = [
    { name: 'Login', fn: testLogin },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Create User', fn: testCreateUser },
    { name: 'Create Duplicate', fn: testCreateDuplicateUser },
    { name: 'Create Without Password', fn: testCreateUserWithoutPassword },
    { name: 'Update User', fn: testUpdateUser },
    { name: 'Update Password', fn: testUpdateUserPassword },
    { name: 'Update Non-Existent', fn: testUpdateNonExistentUser },
    { name: 'Delete User', fn: testDeleteUser },
    { name: 'Delete Non-Existent', fn: testDeleteNonExistentUser },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess }
  ];

  for (const test of tests) {
    results.total++;
    const success = await test.fn();
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  console.log('='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
}

// Run tests
runAllTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
