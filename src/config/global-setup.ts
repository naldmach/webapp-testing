import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Setup environment variables
  process.env.TEST_START_TIME = new Date().toISOString();

  // Create necessary directories
  const fs = require('fs');
  const path = require('path');

  const dirs = [
    'test-results',
    'playwright-report',
    'allure-results',
    'screenshots/baseline',
    'screenshots/actual',
    'screenshots/diff',
  ];

  dirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Setup test data
  await setupTestData();

  console.log('✅ Global setup completed');
}

async function setupTestData() {
  // Initialize any test data, database connections, etc.
  console.log('📊 Setting up test data...');

  // Example: Create test users, seed data, etc.
  // This would typically involve API calls or database setup
}

export default globalSetup;
