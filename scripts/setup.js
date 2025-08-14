#!/usr/bin/env node

// Setup script for junior developers
// This script helps set up the testing environment

const fs = require("fs");
const path = require("path");

console.log(
  "🚀 Setting up Backend Testing Framework for Junior Developers...\n"
);

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

if (majorVersion < 18) {
  console.log("❌ Node.js 18+ is required. You have:", nodeVersion);
  console.log("Please update Node.js: https://nodejs.org\n");
  process.exit(1);
}

console.log("✅ Node.js version check passed:", nodeVersion);

// Create .env file if it doesn't exist
const envPath = path.join(process.cwd(), ".env");
const envExamplePath = path.join(process.cwd(), ".env.example");

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("✅ Created .env file from .env.example");
  } else {
    // Create basic .env file
    const defaultEnv = `# Backend Testing Environment Variables
API_BASE_URL=http://localhost:3000/api
BASE_URL=http://localhost:3000

# Test Database (if needed)
TEST_DB_URL=mongodb://localhost:27017/test_db

# Authentication (if needed)
JWT_SECRET=your-test-jwt-secret
API_KEY=your-test-api-key
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log("✅ Created default .env file");
  }
} else {
  console.log("✅ .env file already exists");
}

// Create test directories if they don't exist
const testDirs = [
  "tests-junior",
  "tests-junior/examples",
  "tests-junior/api",
  "tests-junior/integration",
  "helpers",
  "docs-junior",
];

testDirs.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Check if simplified config files exist
const configs = ["playwright.config-junior.js", "package-junior.json"];

configs.forEach((config) => {
  const configPath = path.join(process.cwd(), config);
  if (fs.existsSync(configPath)) {
    console.log(`✅ Found ${config}`);
  } else {
    console.log(`⚠️  ${config} not found - you may need to create it`);
  }
});

// Success message
console.log("\n🎉 Setup complete! Here's what you can do next:\n");
console.log("1. Install dependencies:");
console.log("   npm install\n");
console.log("2. Install Playwright browsers:");
console.log("   npx playwright install\n");
console.log("3. Run your first test:");
console.log("   npm run test:examples\n");
console.log("4. Read the getting started guide:");
console.log("   docs-junior/getting-started.md\n");
console.log("5. View test results:");
console.log("   npm run report\n");

console.log("🎓 Learning path:");
console.log("   • Start with: tests-junior/examples/first-test.js");
console.log("   • Then try: tests-junior/examples/api-basics.js");
console.log("   • Next: tests-junior/api/auth-api.test.js");
console.log("   • Finally: tests-junior/api/crud-api.test.js\n");

console.log("Happy testing! 🚀");
