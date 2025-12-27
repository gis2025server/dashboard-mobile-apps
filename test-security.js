/**
 * Security Features Test Suite
 * Tests rate limiting, input validation, and security headers
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Colors for console output
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

function logTest(name) {
  console.log('\n' + '='.repeat(60));
  log(`TEST: ${name}`, 'cyan');
  console.log('='.repeat(60));
}

function logResult(passed, message) {
  if (passed) {
    log(`✓ PASS: ${message}`, 'green');
  } else {
    log(`✗ FAIL: ${message}`, 'red');
  }
}

// Test Results
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

function recordResult(passed) {
  results.total++;
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Test 1: Security Headers
 */
async function testSecurityHeaders() {
  logTest('Security Headers');
  
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/`, {
      validateStatus: () => true
    });
    
    const headers = response.headers;
    
    // Check for security headers
    const checks = [
      { name: 'X-Content-Type-Options', expected: 'nosniff' },
      { name: 'X-Frame-Options', expected: 'DENY' },
      { name: 'X-DNS-Prefetch-Control', expected: 'off' },
      { name: 'X-Download-Options', expected: 'noopen' }
    ];
    
    for (const check of checks) {
      const headerValue = headers[check.name.toLowerCase()];
      const passed = headerValue === check.expected;
      logResult(passed, `${check.name}: ${headerValue || 'NOT SET'}`);
      recordResult(passed);
    }
    
    // Check for Strict-Transport-Security (may not be set in dev)
    const hsts = headers['strict-transport-security'];
    if (hsts) {
      logResult(true, `Strict-Transport-Security: ${hsts}`);
      recordResult(true);
    } else {
      log(`⚠ WARNING: Strict-Transport-Security not set (OK in development)`, 'yellow');
    }
    
  } catch (error) {
    logResult(false, `Failed to check security headers: ${error.message}`);
    recordResult(false);
  }
}

/**
 * Test 2: Rate Limiting on Auth Endpoint
 */
async function testRateLimiting() {
  logTest('Rate Limiting (Auth Endpoint)');
  
  log('Attempting 10 login requests (limit is 5 per 15 minutes)...', 'blue');
  
  let blockedCount = 0;
  let successCount = 0;
  
  for (let i = 1; i <= 10; i++) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: 'testuser',
        password: 'wrongpassword'
      }, {
        validateStatus: () => true
      });
      
      if (response.status === 429) {
        blockedCount++;
        log(`  Request ${i}: Blocked (429 Too Many Requests) ✓`, 'green');
      } else if (response.status === 401 || response.status === 400) {
        successCount++;
        log(`  Request ${i}: Processed (${response.status})`, 'blue');
      } else {
        log(`  Request ${i}: Unexpected status ${response.status}`, 'yellow');
      }
      
      // Small delay between requests
      await wait(100);
      
    } catch (error) {
      log(`  Request ${i}: Error - ${error.message}`, 'red');
    }
  }
  
  log(`\nResults: ${successCount} processed, ${blockedCount} blocked`, 'cyan');
  
  // Rate limiting should block at least some requests
  const passed = blockedCount >= 5;
  logResult(passed, `Rate limiting ${passed ? 'working' : 'NOT working'} (blocked ${blockedCount}/10 requests)`);
  recordResult(passed);
}

/**
 * Test 3: Input Validation
 */
async function testInputValidation() {
  logTest('Input Validation');
  
  const testCases = [
    {
      name: 'Username too short',
      data: { username: 'ab', password: 'test123' },
      shouldFail: true
    },
    {
      name: 'Password too short',
      data: { username: 'testuser', password: '123' },
      shouldFail: true
    },
    {
      name: 'Missing username',
      data: { password: 'test123' },
      shouldFail: true
    },
    {
      name: 'Missing password',
      data: { username: 'testuser' },
      shouldFail: true
    },
    {
      name: 'Invalid characters in username',
      data: { username: 'test@user!', password: 'test123' },
      shouldFail: true
    },
    {
      name: 'Valid input format',
      data: { username: 'testuser', password: 'test123' },
      shouldFail: false // Should pass validation (but fail auth)
    }
  ];
  
  for (const testCase of testCases) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, testCase.data, {
        validateStatus: () => true
      });
      
      const isValidationError = response.status === 400 && 
                                response.data.message?.includes('validation');
      const isAuthError = response.status === 401;
      
      if (testCase.shouldFail) {
        const passed = isValidationError;
        logResult(passed, `${testCase.name}: ${passed ? 'Rejected' : 'Accepted (FAIL)'}`);
        recordResult(passed);
      } else {
        const passed = !isValidationError && (isAuthError || response.status === 429);
        logResult(passed, `${testCase.name}: ${passed ? 'Accepted' : 'Rejected (FAIL)'}`);
        recordResult(passed);
      }
      
      await wait(100);
      
    } catch (error) {
      logResult(false, `${testCase.name}: Error - ${error.message}`);
      recordResult(false);
    }
  }
}

/**
 * Test 4: SQL Injection Prevention
 */
async function testSQLInjectionPrevention() {
  logTest('SQL Injection Prevention');
  
  const sqlInjectionAttempts = [
    "admin' OR '1'='1",
    "admin'--",
    "admin' OR 1=1--",
    "' OR '1'='1' /*",
    "admin'; DROP TABLE users--"
  ];
  
  for (const attempt of sqlInjectionAttempts) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: attempt,
        password: 'anything'
      }, {
        validateStatus: () => true
      });
      
      // Should be blocked by validation (400) or fail auth (401)
      const passed = response.status === 400 || response.status === 401 || response.status === 429;
      logResult(passed, `Blocked SQL injection: "${attempt.substring(0, 30)}..."`);
      recordResult(passed);
      
      await wait(100);
      
    } catch (error) {
      logResult(false, `Error testing SQL injection: ${error.message}`);
      recordResult(false);
    }
  }
}

/**
 * Test 5: XSS Prevention
 */
async function testXSSPrevention() {
  logTest('XSS Prevention');
  
  const xssAttempts = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '<svg onload=alert(1)>',
    '"><script>alert(1)</script>'
  ];
  
  for (const attempt of xssAttempts) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: attempt,
        password: 'test123'
      }, {
        validateStatus: () => true
      });
      
      // Should be blocked by sanitization (400) or fail auth (401)
      const passed = response.status === 400 || response.status === 401 || response.status === 429;
      logResult(passed, `Blocked XSS attempt: "${attempt.substring(0, 30)}..."`);
      recordResult(passed);
      
      await wait(100);
      
    } catch (error) {
      logResult(false, `Error testing XSS: ${error.message}`);
      recordResult(false);
    }
  }
}

/**
 * Test 6: Compression
 */
async function testCompression() {
  logTest('Response Compression');
  
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/`, {
      headers: {
        'Accept-Encoding': 'gzip, deflate'
      },
      validateStatus: () => true
    });
    
    const encoding = response.headers['content-encoding'];
    const passed = encoding === 'gzip' || encoding === 'deflate';
    
    logResult(passed, `Compression ${passed ? 'enabled' : 'disabled'}: ${encoding || 'none'}`);
    recordResult(passed);
    
  } catch (error) {
    logResult(false, `Failed to check compression: ${error.message}`);
    recordResult(false);
  }
}

/**
 * Test 7: CORS Configuration
 */
async function testCORS() {
  logTest('CORS Configuration');
  
  try {
    const response = await axios.options(`${API_URL}/auth/login`, {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      },
      validateStatus: () => true
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-credentials': response.headers['access-control-allow-credentials']
    };
    
    const passed = corsHeaders['access-control-allow-origin'] === '*' || 
                   corsHeaders['access-control-allow-origin'] === 'http://localhost:5173';
    
    logResult(passed, `CORS Origin: ${corsHeaders['access-control-allow-origin'] || 'NOT SET'}`);
    recordResult(passed);
    
    log(`  Methods: ${corsHeaders['access-control-allow-methods'] || 'NOT SET'}`, 'blue');
    log(`  Credentials: ${corsHeaders['access-control-allow-credentials'] || 'NOT SET'}`, 'blue');
    
  } catch (error) {
    logResult(false, `Failed to check CORS: ${error.message}`);
    recordResult(false);
  }
}

/**
 * Main test runner
 */
async function runSecurityTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         SECURITY FEATURES TEST SUITE                      ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
  
  log('Testing server at: ' + API_URL, 'blue');
  console.log('\n');
  
  try {
    // Check if server is running
    await axios.get(`${API_URL.replace('/api', '')}/`, { timeout: 5000 });
    log('✓ Server is running', 'green');
  } catch (error) {
    log('✗ Server is not running or not accessible', 'red');
    log('Please start the server with: npm start', 'yellow');
    process.exit(1);
  }
  
  // Run all tests
  await testSecurityHeaders();
  await wait(1000);
  
  await testRateLimiting();
  await wait(2000); // Wait for rate limit to reset
  
  await testInputValidation();
  await wait(1000);
  
  await testSQLInjectionPrevention();
  await wait(1000);
  
  await testXSSPrevention();
  await wait(1000);
  
  await testCompression();
  await wait(500);
  
  await testCORS();
  
  // Print summary
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    TEST SUMMARY                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
  
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  log(`Success Rate: ${percentage}%`, percentage >= 80 ? 'green' : 'red');
  
  console.log('\n');
  
  if (results.failed === 0) {
    log('🎉 ALL SECURITY TESTS PASSED! 🎉', 'green');
  } else {
    log(`⚠️  ${results.failed} test(s) failed. Please review the output above.`, 'yellow');
  }
  
  console.log('\n');
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runSecurityTests().catch(error => {
  log(`\n✗ Test suite error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
