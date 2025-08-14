// @ts-check
const { defineConfig } = require("@playwright/test");

// Load environment variables
require("dotenv").config();

/**
 * Simple Playwright configuration for junior backend developers
 * Focus: API testing, basic integration testing
 */
module.exports = defineConfig({
  // Test directory
  testDir: "./tests",

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Retry failed tests (helpful for flaky network requests)
  retries: 1,

  // Timeout for each test (30 seconds)
  timeout: 30000,

  // Global test timeout
  globalTimeout: 10 * 60 * 1000, // 10 minutes

  // Reporters - keep it simple
  reporter: [
    ["html"], // HTML report for viewing results
    ["list"], // Console output
  ],

  // Global test settings
  use: {
    // Base URL for API testing
    baseURL: process.env.API_BASE_URL || "http://localhost:3000",

    // Collect trace on first retry for debugging
    trace: "on-first-retry",

    // Take screenshot on failure
    screenshot: "only-on-failure",

    // API request timeout
    actionTimeout: 10000,

    // Extra HTTP headers (for API keys, etc.)
    extraHTTPHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },

  // Test projects - simplified for backend focus
  projects: [
    {
      name: "api-tests",
      testDir: "./tests/api",
      use: {
        baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
      },
    },
    {
      name: "integration-tests",
      testDir: "./tests/integration",
      use: {
        baseURL: process.env.BASE_URL || "http://localhost:3000",
      },
    },
  ],

  // Web server configuration (if testing local server)
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run start", // Adjust to your server start command
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 30 * 1000,
      },
});
