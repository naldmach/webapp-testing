// Test data generators for junior developers
// Provides common test data patterns and generators

/**
 * Generate fake user data for testing
 * @returns {object} User object
 */
function createTestUser() {
  const randomId = Math.floor(Math.random() * 10000);
  
  return {
    id: randomId,
    username: `testuser${randomId}`,
    email: `testuser${randomId}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    password: 'TestPassword123!',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate admin user data
 * @returns {object} Admin user object
 */
function createAdminUser() {
  const user = createTestUser();
  user.role = 'admin';
  user.username = `admin${user.id}`;
  user.email = `admin${user.id}@example.com`;
  return user;
}

/**
 * Generate test product data
 * @returns {object} Product object
 */
function createTestProduct() {
  const randomId = Math.floor(Math.random() * 1000);
  
  return {
    id: randomId,
    name: `Test Product ${randomId}`,
    description: `This is a test product description for product ${randomId}`,
    price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
    category: 'electronics',
    inStock: true,
    quantity: Math.floor(Math.random() * 100) + 1,
    sku: `TEST-${randomId}`,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate test order data
 * @param {object} user - User object
 * @param {array} products - Array of products
 * @returns {object} Order object
 */
function createTestOrder(user, products = []) {
  const randomId = Math.floor(Math.random() * 10000);
  
  if (products.length === 0) {
    products = [createTestProduct()];
  }
  
  const total = products.reduce((sum, product) => sum + product.price, 0);
  
  return {
    id: randomId,
    userId: user.id,
    products: products,
    total: parseFloat(total.toFixed(2)),
    status: 'pending',
    shippingAddress: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate invalid user data for error testing
 * @returns {object} Invalid user object
 */
function createInvalidUser() {
  return {
    username: '', // Invalid: empty username
    email: 'invalid-email', // Invalid: malformed email
    password: '123', // Invalid: too short password
    firstName: null, // Invalid: null firstName
    role: 'invalid-role' // Invalid: non-existent role
  };
}

/**
 * Generate test credentials for different scenarios
 */
const testCredentials = {
  valid: {
    username: 'testuser@example.com',
    password: 'ValidPassword123!'
  },
  invalid: {
    username: 'nonexistent@example.com',
    password: 'WrongPassword'
  },
  malformed: {
    username: 'not-an-email',
    password: ''
  }
};

/**
 * Common test data sets
 */
const testDataSets = {
  // Valid test cases
  validUsers: Array.from({ length: 3 }, () => createTestUser()),
  validProducts: Array.from({ length: 5 }, () => createTestProduct()),
  
  // Invalid test cases
  invalidEmails: [
    'invalid-email',
    '@example.com',
    'user@',
    'user..user@example.com',
    ''
  ],
  
  invalidPasswords: [
    '',           // Empty
    '123',        // Too short
    'password',   // No numbers/special chars
    '12345678'    // Only numbers
  ],
  
  // Edge cases
  edgeCases: {
    longString: 'a'.repeat(1000),
    specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    unicode: '测试用户名',
    sql: "'; DROP TABLE users; --"
  }
};

/**
 * Generate random string of specified length
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function randomNumber(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  createTestUser,
  createAdminUser,
  createTestProduct,
  createTestOrder,
  createInvalidUser,
  testCredentials,
  testDataSets,
  randomString,
  randomNumber
};
