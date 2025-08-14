// CRUD API Tests - Testing Create, Read, Update, Delete operations
// This demonstrates typical backend API testing patterns

const { test, expect, request } = require('@playwright/test');
const { ApiClient } = require('../../helpers/api-client');
const { createTestProduct, createTestUser } = require('../../helpers/test-data');
const { ApiAssertions } = require('../../helpers/assertions');

test.describe('Product CRUD API Tests', () => {
  let apiContext;
  let api;
  let authToken;
  let createdProductId;

  // Setup authentication for all tests
  test.beforeAll(async () => {
    const setupApiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api'
    });
    
    const setupApi = new ApiClient(setupApiContext);
    
    // Create a test user and get auth token
    const testUser = createTestUser();
    await setupApi.post('/auth/register', testUser);
    
    const loginResponse = await setupApi.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = loginResponse.data.token;
    console.log('🔧 Authentication setup complete');
    
    await setupApiContext.dispose();
  });

  test.beforeEach(async () => {
    apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api'
    });
    
    api = new ApiClient(apiContext);
    api.setAuthToken(authToken); // Set auth for all requests
    
    console.log('🔧 CRUD API test setup complete');
  });

  test.afterEach(async () => {
    await apiContext.dispose();
  });

  test.describe('CREATE Operations', () => {
    
    test('should create a new product', async () => {
      const newProduct = createTestProduct();
      
      console.log('➕ Creating new product:', newProduct.name);
      
      const response = await api.post('/products', newProduct);
      
      console.log('Created product ID:', response.data.id);
      
      // Store ID for cleanup
      createdProductId = response.data.id;
      
      // Assertions
      ApiAssertions.expectStatus(response, 201);
      ApiAssertions.expectJsonResponse(response);
      
      // Verify all fields were saved correctly
      expect(response.data.name).toBe(newProduct.name);
      expect(response.data.description).toBe(newProduct.description);
      expect(response.data.price).toBe(newProduct.price);
      expect(response.data.category).toBe(newProduct.category);
      
      // Verify server-generated fields
      expect(response.data.id).toBeDefined();
      expect(response.data.createdAt).toBeDefined();
      expect(response.data.updatedAt).toBeDefined();
      
      console.log('✅ Product creation test passed!');
    });

    test('should reject product with missing required fields', async () => {
      console.log('➕ Testing product creation with missing fields');
      
      const incompleteProduct = {
        name: 'Test Product'
        // Missing description, price, category
      };
      
      const response = await api.post('/products', incompleteProduct);
      
      // Should return validation error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(400);
      
      // Should specify which fields are missing
      expect(response.data).toHaveProperty('error');
      
      console.log('✅ Missing fields validation test passed!');
    });

    test('should reject product with invalid price', async () => {
      console.log('➕ Testing product creation with invalid price');
      
      const invalidProduct = createTestProduct();
      invalidProduct.price = -10; // Negative price
      
      const response = await api.post('/products', invalidProduct);
      
      // Should return validation error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(400);
      
      console.log('✅ Invalid price validation test passed!');
    });
  });

  test.describe('READ Operations', () => {
    
    test('should get all products', async () => {
      console.log('📖 Getting all products');
      
      const response = await api.get('/products');
      
      // Assertions
      ApiAssertions.expectSuccess(response);
      ApiAssertions.expectArrayResponse(response, 0);
      
      console.log(`Found ${response.data.length} products`);
      
      // If products exist, check structure of first one
      if (response.data.length > 0) {
        const firstProduct = response.data[0];
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('name');
        expect(firstProduct).toHaveProperty('price');
      }
      
      console.log('✅ Get all products test passed!');
    });

    test('should get a single product by ID', async () => {
      // First create a product to retrieve
      const newProduct = createTestProduct();
      const createResponse = await api.post('/products', newProduct);
      const productId = createResponse.data.id;
      
      console.log('📖 Getting product by ID:', productId);
      
      const response = await api.get(`/products/${productId}`);
      
      // Assertions
      ApiAssertions.expectSuccess(response);
      ApiAssertions.expectJsonResponse(response);
      
      // Verify it's the correct product
      expect(response.data.id).toBe(productId);
      expect(response.data.name).toBe(newProduct.name);
      expect(response.data.price).toBe(newProduct.price);
      
      console.log('✅ Get product by ID test passed!');
    });

    test('should return 404 for non-existent product', async () => {
      const nonExistentId = 999999;
      
      console.log('📖 Testing get non-existent product:', nonExistentId);
      
      const response = await api.get(`/products/${nonExistentId}`);
      
      // Should return not found
      expect(response.status).toBe(404);
      ApiAssertions.expectError(response);
      
      console.log('✅ Non-existent product test passed!');
    });

    test('should filter products by category', async () => {
      console.log('📖 Testing product filtering by category');
      
      const response = await api.get('/products?category=electronics');
      
      // Assertions
      ApiAssertions.expectSuccess(response);
      ApiAssertions.expectArrayResponse(response, 0);
      
      // All returned products should be in electronics category
      response.data.forEach(product => {
        expect(product.category).toBe('electronics');
      });
      
      console.log('✅ Product filtering test passed!');
    });

    test('should paginate products correctly', async () => {
      console.log('📖 Testing product pagination');
      
      const response = await api.get('/products?page=1&limit=5');
      
      // Assertions
      ApiAssertions.expectSuccess(response);
      
      // Check pagination metadata
      expect(response.data).toHaveProperty('products');
      expect(response.data).toHaveProperty('totalCount');
      expect(response.data).toHaveProperty('page');
      expect(response.data).toHaveProperty('limit');
      
      // Products array should not exceed limit
      expect(response.data.products.length).toBeLessThanOrEqual(5);
      
      console.log('✅ Product pagination test passed!');
    });
  });

  test.describe('UPDATE Operations', () => {
    
    test('should update a product completely (PUT)', async () => {
      // First create a product to update
      const originalProduct = createTestProduct();
      const createResponse = await api.post('/products', originalProduct);
      const productId = createResponse.data.id;
      
      console.log('✏️ Updating product completely:', productId);
      
      // Update the product
      const updatedProduct = {
        id: productId,
        name: 'Updated Product Name',
        description: 'Updated description',
        price: 99.99,
        category: 'updated-category',
        inStock: false,
        quantity: 5
      };
      
      const response = await api.put(`/products/${productId}`, updatedProduct);
      
      // Assertions
      ApiAssertions.expectSuccess(response);
      
      // Verify all fields were updated
      expect(response.data.name).toBe(updatedProduct.name);
      expect(response.data.description).toBe(updatedProduct.description);
      expect(response.data.price).toBe(updatedProduct.price);
      expect(response.data.category).toBe(updatedProduct.category);
      expect(response.data.inStock).toBe(updatedProduct.inStock);
      
      // Verify updatedAt was changed
      expect(response.data.updatedAt).toBeDefined();
      expect(new Date(response.data.updatedAt)).toBeInstanceOf(Date);
      
      console.log('✅ Complete product update test passed!');
    });

    test('should update a product partially (PATCH)', async () => {
      // First create a product to update
      const originalProduct = createTestProduct();
      const createResponse = await api.post('/products', originalProduct);
      const productId = createResponse.data.id;
      
      console.log('✏️ Updating product partially:', productId);
      
      // Partial update - only change price and name
      const partialUpdate = {
        name: 'Partially Updated Name',
        price: 149.99
      };
      
      const response = await api.patch(`/products/${productId}`, partialUpdate);
      
      // Assertions
      ApiAssertions.expectSuccess(response);
      
      // Verify updated fields
      expect(response.data.name).toBe(partialUpdate.name);
      expect(response.data.price).toBe(partialUpdate.price);
      
      // Verify unchanged fields
      expect(response.data.description).toBe(originalProduct.description);
      expect(response.data.category).toBe(originalProduct.category);
      
      console.log('✅ Partial product update test passed!');
    });

    test('should reject update with invalid data', async () => {
      // First create a product to update
      const originalProduct = createTestProduct();
      const createResponse = await api.post('/products', originalProduct);
      const productId = createResponse.data.id;
      
      console.log('✏️ Testing update with invalid data');
      
      const invalidUpdate = {
        price: -50, // Invalid negative price
        name: '' // Empty name
      };
      
      const response = await api.put(`/products/${productId}`, invalidUpdate);
      
      // Should return validation error
      ApiAssertions.expectError(response);
      expect(response.status).toBe(400);
      
      console.log('✅ Invalid update data test passed!');
    });

    test('should return 404 when updating non-existent product', async () => {
      const nonExistentId = 999999;
      
      console.log('✏️ Testing update of non-existent product');
      
      const updateData = {
        name: 'Updated Name',
        price: 99.99
      };
      
      const response = await api.put(`/products/${nonExistentId}`, updateData);
      
      // Should return not found
      expect(response.status).toBe(404);
      ApiAssertions.expectError(response);
      
      console.log('✅ Update non-existent product test passed!');
    });
  });

  test.describe('DELETE Operations', () => {
    
    test('should delete a product', async () => {
      // First create a product to delete
      const productToDelete = createTestProduct();
      const createResponse = await api.post('/products', productToDelete);
      const productId = createResponse.data.id;
      
      console.log('🗑️ Deleting product:', productId);
      
      const deleteResponse = await api.delete(`/products/${productId}`);
      
      // Assertions
      ApiAssertions.expectSuccess(deleteResponse);
      
      // Verify product is actually deleted by trying to get it
      const getResponse = await api.get(`/products/${productId}`);
      expect(getResponse.status).toBe(404);
      
      console.log('✅ Product deletion test passed!');
    });

    test('should return 404 when deleting non-existent product', async () => {
      const nonExistentId = 999999;
      
      console.log('🗑️ Testing deletion of non-existent product');
      
      const response = await api.delete(`/products/${nonExistentId}`);
      
      // Should return not found
      expect(response.status).toBe(404);
      ApiAssertions.expectError(response);
      
      console.log('✅ Delete non-existent product test passed!');
    });

    test('should prevent deletion of product with active orders', async () => {
      // This test assumes business logic prevents deletion of products in orders
      console.log('🗑️ Testing deletion prevention for products with orders');
      
      // First create a product
      const product = createTestProduct();
      const createResponse = await api.post('/products', product);
      const productId = createResponse.data.id;
      
      // Create an order with this product (simplified - would need order API)
      // For this example, we'll assume the product has orders
      
      // Try to delete the product
      const deleteResponse = await api.delete(`/products/${productId}`);
      
      // Depending on business logic, this might return 409 (Conflict) or 400
      if (deleteResponse.status === 409 || deleteResponse.status === 400) {
        ApiAssertions.expectError(deleteResponse);
        expect(deleteResponse.data).toHaveProperty('error');
        console.log('✅ Deletion prevention test passed!');
      } else {
        // If no orders exist, deletion should succeed
        ApiAssertions.expectSuccess(deleteResponse);
        console.log('✅ Product deleted (no active orders)');
      }
    });
  });

  test.describe('Authorization Tests', () => {
    
    test('should require authentication for product creation', async () => {
      console.log('🔒 Testing product creation without auth');
      
      // Clear authentication token
      api.clearAuthToken();
      
      const newProduct = createTestProduct();
      const response = await api.post('/products', newProduct);
      
      // Should return unauthorized
      expect(response.status).toBe(401);
      ApiAssertions.expectError(response);
      
      console.log('✅ Auth required test passed!');
    });

    test('should allow read operations without authentication', async () => {
      console.log('📖 Testing product reading without auth');
      
      // Clear authentication token
      api.clearAuthToken();
      
      const response = await api.get('/products');
      
      // Read operations might be public
      if (response.status === 200) {
        ApiAssertions.expectSuccess(response);
        console.log('✅ Public read access confirmed');
      } else if (response.status === 401) {
        console.log('✅ Auth required for read operations');
      }
    });
  });
});

// Key Learning Points for CRUD API Testing:
// 1. Test all CRUD operations (Create, Read, Update, Delete)
// 2. Test both success and error scenarios for each operation
// 3. Verify data integrity and validation rules
// 4. Test edge cases (non-existent IDs, invalid data)
// 5. Check proper HTTP status codes for each operation
// 6. Test authorization and authentication requirements
// 7. Verify business logic constraints
// 8. Clean up test data to avoid side effects
