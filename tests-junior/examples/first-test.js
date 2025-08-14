// Your First Test - A simple example to get started
// This test shows the basic structure and concepts

const { test, expect } = require('@playwright/test');

// Test suite - groups related tests together
test.describe('My First Tests', () => {
  
  // Basic test structure
  test('should understand basic test structure', async () => {
    // This is a test that always passes
    // It's here to show you the basic structure
    
    console.log('🎉 Welcome to testing!');
    console.log('This is your first test');
    
    // Basic assertion - checking if something is true
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
    
    console.log('✅ All assertions passed!');
  });

  // Test with async operations
  test('should understand async/await', async () => {
    // Most tests are async because they wait for things to happen
    
    // Simulate waiting for something (like an API call)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test passes if we get here without errors
    expect('async test').toBe('async test');
    
    console.log('✅ Async test completed!');
  });

  // Test that demonstrates different types of assertions
  test('should understand different assertions', async () => {
    // Number assertions
    expect(5).toBeGreaterThan(3);
    expect(2).toBeLessThan(10);
    expect(7).toBeGreaterThanOrEqual(7);
    
    // String assertions
    expect('Hello World').toContain('Hello');
    expect('test@example.com').toMatch(/.*@.*\..*/); // Email pattern
    
    // Array assertions
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banana');
    
    // Object assertions
    const user = { name: 'John', age: 30 };
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John');
    
    console.log('✅ All different assertion types work!');
  });

  // Test that shows error handling
  test('should understand error testing', async () => {
    // Sometimes we want to test that errors happen correctly
    
    // Test that a function throws an error
    expect(() => {
      throw new Error('This is expected');
    }).toThrow('This is expected');
    
    // Test that something is undefined or null
    let undefinedValue;
    expect(undefinedValue).toBeUndefined();
    
    let nullValue = null;
    expect(nullValue).toBeNull();
    
    console.log('✅ Error testing works correctly!');
  });
});

// Tips for junior developers:
// 1. Each test should test ONE thing
// 2. Use descriptive test names that explain what you're testing
// 3. Add console.log() statements to understand what's happening
// 4. Start simple and gradually add complexity
// 5. Don't be afraid to run tests frequently while learning
