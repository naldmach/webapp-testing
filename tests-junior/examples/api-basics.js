// API Testing Basics - Learn how to test APIs step by step
// This shows fundamental API testing concepts

const { test, expect, request } = require('@playwright/test');
const { ApiClient } = require('../../helpers/api-client');
const { ApiAssertions } = require('../../helpers/assertions');

test.describe('API Testing Basics', () => {
  let apiContext;
  let api;

  // Setup - runs before each test
  test.beforeEach(async () => {
    // Create API context for making requests
    apiContext = await request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com' // Free test API
    });
    
    // Create our helper API client
    api = new ApiClient(apiContext, 'https://jsonplaceholder.typicode.com');
    
    console.log('🔧 API client setup complete');
  });

  // Cleanup - runs after each test
  test.afterEach(async () => {
    await apiContext.dispose();
    console.log('🧹 API client cleaned up');
  });

  // Basic GET request test
  test('should make a simple GET request', async () => {
    console.log('📡 Making GET request to /posts/1');
    
    // Make a GET request
    const response = await api.get('/posts/1');
    
    // Log the response for learning
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // Basic assertions
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(1);
    
    console.log('✅ GET request test passed!');
  });

  // Test GET request for multiple items
  test('should get list of items', async () => {
    console.log('📡 Making GET request to /posts');
    
    const response = await api.get('/posts');
    
    console.log('Number of posts received:', response.data.length);
    
    // Assert we got an array
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    
    // Check first item has expected structure
    const firstPost = response.data[0];
    expect(firstPost).toHaveProperty('id');
    expect(firstPost).toHaveProperty('title');
    expect(firstPost).toHaveProperty('body');
    
    console.log('✅ List request test passed!');
  });

  // Basic POST request test
  test('should make a POST request', async () => {
    console.log('📡 Making POST request to /posts');
    
    const newPost = {
      title: 'My Test Post',
      body: 'This is a test post created by automated testing',
      userId: 1
    };
    
    const response = await api.post('/posts', newPost);
    
    console.log('Created post:', response.data);
    
    // Assertions
    expect(response.status).toBe(201); // Created status
    expect(response.data.title).toBe(newPost.title);
    expect(response.data.body).toBe(newPost.body);
    expect(response.data.userId).toBe(newPost.userId);
    expect(response.data.id).toBeDefined(); // Should have an ID
    
    console.log('✅ POST request test passed!');
  });

  // Basic PUT request test
  test('should make a PUT request', async () => {
    console.log('📡 Making PUT request to /posts/1');
    
    const updatedPost = {
      id: 1,
      title: 'Updated Test Post',
      body: 'This post has been updated',
      userId: 1
    };
    
    const response = await api.put('/posts/1', updatedPost);
    
    console.log('Updated post:', response.data);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.title).toBe(updatedPost.title);
    expect(response.data.body).toBe(updatedPost.body);
    expect(response.data.id).toBe(1);
    
    console.log('✅ PUT request test passed!');
  });

  // Basic DELETE request test
  test('should make a DELETE request', async () => {
    console.log('📡 Making DELETE request to /posts/1');
    
    const response = await api.delete('/posts/1');
    
    console.log('Delete response:', response.status);
    
    // Assertions
    expect(response.status).toBe(200);
    
    console.log('✅ DELETE request test passed!');
  });

  // Using our custom assertions
  test('should use custom API assertions', async () => {
    console.log('📡 Testing with custom assertions');
    
    const response = await api.get('/posts/1');
    
    // Use our custom assertion helpers
    ApiAssertions.expectSuccess(response);
    ApiAssertions.expectJsonResponse(response);
    ApiAssertions.expectRequiredFields(response, ['id', 'title', 'body', 'userId']);
    
    console.log('✅ Custom assertions test passed!');
  });

  // Error handling test
  test('should handle API errors gracefully', async () => {
    console.log('📡 Testing error handling with invalid endpoint');
    
    const response = await api.get('/posts/999999'); // Non-existent post
    
    console.log('Error response status:', response.status);
    
    // This API returns 404 for non-existent resources
    expect(response.status).toBe(404);
    expect(response.ok).toBe(false);
    
    console.log('✅ Error handling test passed!');
  });

  // Response time test
  test('should respond quickly', async () => {
    console.log('📡 Testing response time');
    
    const startTime = Date.now();
    const response = await api.get('/posts/1');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    console.log(`Response time: ${responseTime}ms`);
    
    // Assert response was fast (under 5 seconds)
    expect(responseTime).toBeLessThan(5000);
    expect(response.status).toBe(200);
    
    console.log('✅ Response time test passed!');
  });
});

// Key Learning Points:
// 1. API tests make HTTP requests (GET, POST, PUT, DELETE)
// 2. Always check the response status code
// 3. Validate the response data structure
// 4. Test both success and error scenarios
// 5. Consider response times in your tests
// 6. Use setup/cleanup to prepare test environment
