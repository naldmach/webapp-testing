// Custom assertions for junior developers
// Makes test assertions more readable and reusable

const { expect } = require('@playwright/test');

/**
 * API Response Assertions
 * Common assertions for API testing
 */
class ApiAssertions {
  
  /**
   * Assert response has expected status code
   * @param {object} response - API response
   * @param {number} expectedStatus - Expected status code
   */
  static expectStatus(response, expectedStatus) {
    expect(response.status).toBe(expectedStatus);
  }

  /**
   * Assert response is successful (2xx)
   * @param {object} response - API response
   */
  static expectSuccess(response) {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(response.ok).toBe(true);
  }

  /**
   * Assert response is an error (4xx or 5xx)
   * @param {object} response - API response
   */
  static expectError(response) {
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.ok).toBe(false);
  }

  /**
   * Assert response has JSON content type
   * @param {object} response - API response
   */
  static expectJsonResponse(response) {
    const contentType = response.headers['content-type'] || '';
    expect(contentType).toContain('application/json');
  }

  /**
   * Assert response has expected data structure
   * @param {object} response - API response
   * @param {object} expectedStructure - Expected object structure
   */
  static expectDataStructure(response, expectedStructure) {
    expect(response.data).toBeDefined();
    
    Object.keys(expectedStructure).forEach(key => {
      expect(response.data).toHaveProperty(key);
      
      if (expectedStructure[key] !== null) {
        expect(typeof response.data[key]).toBe(expectedStructure[key]);
      }
    });
  }

  /**
   * Assert response contains required fields
   * @param {object} response - API response
   * @param {array} requiredFields - Array of required field names
   */
  static expectRequiredFields(response, requiredFields) {
    expect(response.data).toBeDefined();
    
    requiredFields.forEach(field => {
      expect(response.data).toHaveProperty(field);
      expect(response.data[field]).not.toBeNull();
      expect(response.data[field]).not.toBeUndefined();
    });
  }

  /**
   * Assert response data is an array
   * @param {object} response - API response
   * @param {number} minLength - Minimum array length (optional)
   */
  static expectArrayResponse(response, minLength = 0) {
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThanOrEqual(minLength);
  }

  /**
   * Assert response contains error message
   * @param {object} response - API response
   * @param {string} expectedMessage - Expected error message (optional)
   */
  static expectErrorMessage(response, expectedMessage = null) {
    expect(response.data).toBeDefined();
    expect(response.data).toHaveProperty('error');
    
    if (expectedMessage) {
      expect(response.data.error).toContain(expectedMessage);
    }
  }

  /**
   * Assert response time is acceptable
   * @param {number} responseTime - Response time in milliseconds
   * @param {number} maxTime - Maximum acceptable time (default: 5000ms)
   */
  static expectFastResponse(responseTime, maxTime = 5000) {
    expect(responseTime).toBeLessThan(maxTime);
  }
}

/**
 * User Data Assertions
 * Common assertions for user-related data
 */
class UserAssertions {
  
  /**
   * Assert user object has valid structure
   * @param {object} user - User object
   */
  static expectValidUser(user) {
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('username');
    
    // Email should be valid format
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    // Username should not be empty
    expect(user.username).toBeTruthy();
    expect(user.username.length).toBeGreaterThan(0);
  }

  /**
   * Assert user has expected role
   * @param {object} user - User object
   * @param {string} expectedRole - Expected user role
   */
  static expectUserRole(user, expectedRole) {
    expect(user).toHaveProperty('role');
    expect(user.role).toBe(expectedRole);
  }

  /**
   * Assert user password is not exposed
   * @param {object} user - User object
   */
  static expectPasswordNotExposed(user) {
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('passwordHash');
  }
}

/**
 * Database Assertions
 * Common assertions for database operations
 */
class DatabaseAssertions {
  
  /**
   * Assert record exists in database
   * @param {object} record - Database record
   */
  static expectRecordExists(record) {
    expect(record).toBeDefined();
    expect(record).not.toBeNull();
    expect(record).toHaveProperty('id');
  }

  /**
   * Assert record was created recently
   * @param {object} record - Database record
   * @param {number} maxAgeMinutes - Maximum age in minutes (default: 5)
   */
  static expectRecentlyCreated(record, maxAgeMinutes = 5) {
    expect(record).toHaveProperty('createdAt');
    
    const createdAt = new Date(record.createdAt);
    const now = new Date();
    const diffMinutes = (now - createdAt) / (1000 * 60);
    
    expect(diffMinutes).toBeLessThan(maxAgeMinutes);
  }

  /**
   * Assert record was updated recently
   * @param {object} record - Database record
   * @param {number} maxAgeMinutes - Maximum age in minutes (default: 5)
   */
  static expectRecentlyUpdated(record, maxAgeMinutes = 5) {
    expect(record).toHaveProperty('updatedAt');
    
    const updatedAt = new Date(record.updatedAt);
    const now = new Date();
    const diffMinutes = (now - updatedAt) / (1000 * 60);
    
    expect(diffMinutes).toBeLessThan(maxAgeMinutes);
  }
}

/**
 * Common validation helpers
 */
const ValidationHelpers = {
  
  /**
   * Check if email is valid format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if password meets requirements
   * @param {string} password - Password to validate
   * @returns {boolean}
   */
  isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Check if string is not empty
   * @param {string} str - String to check
   * @returns {boolean}
   */
  isNotEmpty(str) {
    return str && str.trim().length > 0;
  }
};

module.exports = {
  ApiAssertions,
  UserAssertions,
  DatabaseAssertions,
  ValidationHelpers
};
