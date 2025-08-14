// Authentication API Tests - Testing login, registration, and auth flows
// This is a realistic example of backend API testing

const { test, expect, request } = require('@playwright/test');
const { ApiClient } = require('../../helpers/api-client');
const { createTestUser, testCredentials } = require('../../helpers/test-data');
const { ApiAssertions, UserAssertions } = require('../../helpers/assertions');

test.describe('Authentication API Tests', () => {
  let apiContext;
  let api;

  test.beforeEach(async () => {
    apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api'
    });
    
    api = new ApiClient(apiContext);
    console.log('🔧 Auth API test setup complete');
  });

  test.afterEach(async () => {
    await apiContext.dispose();
  });

  test.describe('User Registration', () => {
    
    test('should register a new user successfully', async () => {
      // Create test user data
      const newUser = createTestUser();
      
      console.log('👤 Registering new user:', newUser.username);
      
      // Make registration request
      const response = await api.post('/auth/register', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      });
      
      console.log('Registration response:', response.status);
      
      // Assertions
      ApiAssertions.expectStatus(response, 201);
      ApiAssertions.expectJsonResponse(response);
      
      // Check response contains user data
      expect(response.data).toHaveProperty('user');
      expect(response.data).toHaveProperty('token');
      
      // Validate user data
      UserAssertions.expectValidUser(response.data.user);
      UserAssertions.expectPasswordNotExposed(response.data.user);
      
      // Check token exists
      expect(response.data.token).toBeDefined();
      expect(typeof response.data.token).toBe('string');
      expect(response.data.token.length).toBeGreaterThan(10);
      
      console.log('✅ User registration test passed!');
    });

    test('should reject registration with invalid email', async () => {
      const invalidUser = createTestUser();
      invalidUser.email = 'invalid-email'; // Invalid email format
      
      console.log('👤 Testing registration with invalid email');
      
      const response = await api.post('/auth/register', invalidUser);
      
      // Should return validation error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(400);
      
      // Should contain error message about email
      expect(response.data).toHaveProperty('error');
      expect(response.data.error.toLowerCase()).toContain('email');
      
      console.log('✅ Invalid email registration test passed!');
    });

    test('should reject registration with weak password', async () => {
      const weakPasswordUser = createTestUser();
      weakPasswordUser.password = '123'; // Too weak
      
      console.log('👤 Testing registration with weak password');
      
      const response = await api.post('/auth/register', weakPasswordUser);
      
      // Should return validation error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(400);
      
      // Should contain error message about password
      expect(response.data).toHaveProperty('error');
      expect(response.data.error.toLowerCase()).toContain('password');
      
      console.log('✅ Weak password registration test passed!');
    });

    test('should reject duplicate email registration', async () => {
      const user = createTestUser();
      
      console.log('👤 Testing duplicate email registration');
      
      // First registration - should succeed
      const firstResponse = await api.post('/auth/register', user);
      ApiAssertions.expectStatus(firstResponse, 201);
      
      // Second registration with same email - should fail
      const secondResponse = await api.post('/auth/register', user);
      ApiAssertions.expectError(secondResponse);
      expect(secondResponse.status).toBe(409); // Conflict
      
      console.log('✅ Duplicate email registration test passed!');
    });
  });

  test.describe('User Login', () => {
    
    test('should login with valid credentials', async () => {
      // First, register a user
      const testUser = createTestUser();
      const registerResponse = await api.post('/auth/register', testUser);
      ApiAssertions.expectStatus(registerResponse, 201);
      
      console.log('🔐 Logging in with valid credentials');
      
      // Now try to login
      const loginResponse = await api.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
      });
      
      // Assertions
      ApiAssertions.expectSuccess(loginResponse);
      ApiAssertions.expectJsonResponse(loginResponse);
      
      // Check response structure
      expect(loginResponse.data).toHaveProperty('user');
      expect(loginResponse.data).toHaveProperty('token');
      
      // Validate user data
      UserAssertions.expectValidUser(loginResponse.data.user);
      UserAssertions.expectPasswordNotExposed(loginResponse.data.user);
      
      console.log('✅ Valid login test passed!');
    });

    test('should reject login with wrong password', async () => {
      console.log('🔐 Testing login with wrong password');
      
      const response = await api.post('/auth/login', {
        email: testCredentials.valid.username,
        password: 'WrongPassword123!'
      });
      
      // Should return authentication error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(401); // Unauthorized
      
      // Should contain error message
      expect(response.data).toHaveProperty('error');
      
      console.log('✅ Wrong password test passed!');
    });

    test('should reject login with non-existent email', async () => {
      console.log('🔐 Testing login with non-existent email');
      
      const response = await api.post('/auth/login', {
        email: 'nonexistent@example.com',
        password: 'SomePassword123!'
      });
      
      // Should return authentication error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(401); // Unauthorized
      
      console.log('✅ Non-existent email test passed!');
    });

    test('should reject login with malformed request', async () => {
      console.log('🔐 Testing login with malformed request');
      
      const response = await api.post('/auth/login', {
        // Missing required fields
        email: 'test@example.com'
        // password is missing
      });
      
      // Should return validation error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(400); // Bad Request
      
      console.log('✅ Malformed request test passed!');
    });
  });

  test.describe('Protected Routes', () => {
    
    test('should access protected route with valid token', async () => {
      // First, register and login to get a token
      const testUser = createTestUser();
      await api.post('/auth/register', testUser);
      
      const loginResponse = await api.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
      });
      
      const token = loginResponse.data.token;
      
      console.log('🔒 Accessing protected route with valid token');
      
      // Set the token in our API client
      api.setAuthToken(token);
      
      // Try to access a protected route (e.g., user profile)
      const profileResponse = await api.get('/auth/profile');
      
      // Should succeed
      ApiAssertions.expectSuccess(profileResponse);
      expect(profileResponse.data).toHaveProperty('user');
      
      console.log('✅ Protected route access test passed!');
    });

    test('should reject protected route without token', async () => {
      console.log('🔒 Testing protected route without token');
      
      // Clear any existing token
      api.clearAuthToken();
      
      // Try to access protected route
      const response = await api.get('/auth/profile');
      
      // Should return authentication error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(401); // Unauthorized
      
      console.log('✅ No token protection test passed!');
    });

    test('should reject protected route with invalid token', async () => {
      console.log('🔒 Testing protected route with invalid token');
      
      // Set an invalid token
      api.setAuthToken('invalid.token.here');
      
      // Try to access protected route
      const response = await api.get('/auth/profile');
      
      // Should return authentication error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(401); // Unauthorized
      
      console.log('✅ Invalid token protection test passed!');
    });
  });

  test.describe('Logout', () => {
    
    test('should logout successfully', async () => {
      // First, login to get a token
      const testUser = createTestUser();
      await api.post('/auth/register', testUser);
      
      const loginResponse = await api.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
      });
      
      api.setAuthToken(loginResponse.data.token);
      
      console.log('👋 Testing logout');
      
      // Logout
      const logoutResponse = await api.post('/auth/logout');
      
      // Should succeed
      ApiAssertions.expectSuccess(logoutResponse);
      
      // After logout, protected routes should not work
      api.clearAuthToken(); // Simulate token being invalidated
      const profileResponse = await api.get('/auth/profile');
      ApiAssertions.expectError(profileResponse);
      
      console.log('✅ Logout test passed!');
    });
  });
});

// Key Learning Points for Authentication Testing:
// 1. Test both success and failure scenarios
// 2. Validate token generation and usage
// 3. Check that sensitive data (passwords) is not exposed
// 4. Test protected routes with and without authentication
// 5. Verify proper HTTP status codes (200, 201, 400, 401, 409)
// 6. Use realistic test data
// 7. Clean up test data between tests
