# Getting Started - Junior Backend Developer Testing Guide

Welcome! This guide will help you learn backend testing step-by-step. Don't worry if you're new to testing - we'll start simple and build up your skills.

## What is Backend Testing?

Backend testing focuses on testing the server-side of applications:

- **API endpoints** (REST APIs, GraphQL)
- **Database operations** (CRUD operations)
- **Business logic** (validation, calculations)
- **Authentication** (login, permissions)
- **Integration** (external services)

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed
- **Basic JavaScript knowledge**
- **Understanding of HTTP methods** (GET, POST, PUT, DELETE)
- **Basic API concepts** (requests, responses, status codes)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Browser (for Playwright)

```bash
npx playwright install
```

### 3. Set Up Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit the `.env` file with your API settings:

```
API_BASE_URL=http://localhost:3000/api
BASE_URL=http://localhost:3000
```

### 4. Run Your First Test

```bash
npm run test:examples
```

## Learning Path

### Week 1: Basic Testing Concepts

1. **Start here**: `tests-junior/examples/first-test.js`

   - Learn test structure
   - Understand assertions
   - Practice with simple tests

2. **Next**: `tests-junior/examples/api-basics.js`
   - Learn API testing fundamentals
   - Understand HTTP requests
   - Practice with real APIs

### Week 2: Authentication Testing

3. **Authentication**: `tests-junior/api/auth-api.test.js`
   - Test user registration
   - Test login/logout
   - Test protected routes
   - Understand tokens and security

### Week 3: CRUD Operations

4. **CRUD Testing**: `tests-junior/api/crud-api.test.js`
   - Test Create operations
   - Test Read operations (GET)
   - Test Update operations (PUT/PATCH)
   - Test Delete operations

### Week 4: Advanced Topics

5. **Integration Testing**: `tests-junior/integration/`
   - Test database connections
   - Test external API calls
   - Test service interactions

## File Structure (Simplified)

```
webapp-testing/
├── tests-junior/           # Your test files
│   ├── examples/           # Learning examples
│   ├── api/               # API tests
│   └── integration/       # Integration tests
│
├── helpers/               # Helper utilities
│   ├── api-client.js      # Simple API client
│   ├── test-data.js       # Test data generators
│   └── assertions.js      # Custom assertions
│
├── docs-junior/           # Documentation
│   ├── getting-started.md # This file
│   ├── api-testing-guide.md
│   └── best-practices.md
│
├── playwright.config-junior.js  # Simple configuration
└── package-junior.json          # Simplified dependencies
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Types

```bash
npm run test:api          # API tests only
npm run test:integration  # Integration tests only
npm run test:examples     # Learning examples
```

### Run Tests with Browser UI (Visual)

```bash
npm run test:ui
```

### Debug Tests

```bash
npm run test:debug
```

### View Test Reports

```bash
npm run report
```

## Understanding Test Output

When you run tests, you'll see output like this:

```
✅ should login with valid credentials (1.2s)
❌ should reject invalid password (0.8s)
⏭️ should handle rate limiting (skipped)
```

- ✅ **Green/Passed**: Test worked correctly
- ❌ **Red/Failed**: Test found an issue
- ⏭️ **Yellow/Skipped**: Test was skipped

## Common Commands

```bash
# Setup project
npm run setup

# Generate a new test file
npm run generate

# Install browsers for Playwright
npm run install:browsers

# Run tests and show results
npm test && npm run report
```

## Your First Test

Let's create a simple test together:

1. **Open**: `tests-junior/examples/first-test.js`
2. **Run it**: `npm run test:examples`
3. **Read the comments** to understand what's happening
4. **Modify it** - change some values and see what happens

## Getting Help

### When Tests Fail

1. **Read the error message** carefully
2. **Check the console logs** for clues
3. **Look at the test report** in your browser
4. **Add `console.log()` statements** to debug

### Common Issues

- **Connection errors**: Check if your API server is running
- **Authentication errors**: Make sure your tokens are valid
- **Timeout errors**: Your API might be slow - increase timeout
- **Assertion errors**: Expected vs actual values don't match

### Resources

- **Playwright Documentation**: https://playwright.dev
- **HTTP Status Codes**: https://httpstatuses.com
- **REST API Guide**: https://restfulapi.net

## Next Steps

1. **Complete Week 1** examples
2. **Read**: `docs-junior/api-testing-guide.md`
3. **Practice**: Write your own simple test
4. **Ask questions** - don't be afraid to experiment!

Remember: **Everyone starts somewhere**. Take your time, practice regularly, and don't hesitate to ask for help when you need it.

Happy testing! 🚀
