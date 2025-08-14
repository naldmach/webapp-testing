# Backend Testing Framework - Junior Developer Edition

A simplified testing framework designed specifically for **junior backend developers** who are learning API testing, database testing, and integration testing.

## 🎯 **Perfect for Junior Developers**

This framework is specifically designed for developers who are:

- New to testing
- Learning backend development
- Want to focus on API testing
- Need simple, clear examples
- Prefer step-by-step learning

## 🚀 **What You'll Learn**

### Week 1: Testing Basics

- How to write your first test
- Understanding assertions
- API testing fundamentals
- HTTP methods (GET, POST, PUT, DELETE)

### Week 2: Authentication

- User registration testing
- Login/logout flows
- Protected route testing
- Token-based authentication

### Week 3: CRUD Operations

- Create operations (POST)
- Read operations (GET)
- Update operations (PUT/PATCH)
- Delete operations (DELETE)
- Data validation testing

### Week 4: Integration Testing

- Database testing
- External API testing
- Service-to-service communication
- Error handling

## 📦 **Quick Start**

### 1. Prerequisites

- Node.js 18+
- Basic JavaScript knowledge
- Understanding of APIs

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd webapp-testing

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment file
cp .env.example .env
```

### 3. Run Your First Test

```bash
npm run test:examples
```

### 4. View Results

```bash
npm run report
```

## 🏗️ **Simple Structure**

```
webapp-testing/
├── tests-junior/           # 📁 Your test files (start here!)
│   ├── examples/           # 🎓 Learning examples
│   │   ├── first-test.js   # Your very first test
│   │   └── api-basics.js   # API testing basics
│   ├── api/               # 🔌 API tests
│   │   ├── auth-api.test.js
│   │   └── crud-api.test.js
│   └── integration/       # 🔗 Integration tests
│
├── helpers/               # 🛠️ Simple helper tools
│   ├── api-client.js      # Easy API requests
│   ├── test-data.js       # Generate test data
│   └── assertions.js      # Custom test checks
│
├── docs-junior/           # 📚 Learning materials
│   ├── getting-started.md
│   ├── api-testing-guide.md
│   └── best-practices.md
│
├── playwright.config-junior.js  # ⚙️ Simple configuration
└── package-junior.json          # 📋 Basic dependencies
```

## 🎮 **Commands**

### Running Tests

```bash
npm test                    # Run all tests
npm run test:api           # API tests only
npm run test:integration   # Integration tests only
npm run test:examples      # Learning examples

npm run test:headed        # See tests run in browser
npm run test:debug         # Debug mode
npm run test:ui            # Visual test runner
```

### Utilities

```bash
npm run setup              # Project setup
npm run generate           # Create new test file
npm run report             # View test results
```

## 📖 **Learning Path**

### 🥇 **Beginner Level**

1. **Start**: `tests-junior/examples/first-test.js`

   - Basic test structure
   - Simple assertions
   - Understanding test output

2. **Next**: `tests-junior/examples/api-basics.js`
   - HTTP requests
   - API responses
   - Status codes

### 🥈 **Intermediate Level**

3. **Authentication**: `tests-junior/api/auth-api.test.js`

   - User registration
   - Login/logout
   - Protected routes
   - Token handling

4. **CRUD Operations**: `tests-junior/api/crud-api.test.js`
   - Create, Read, Update, Delete
   - Data validation
   - Error handling

### 🥉 **Advanced Level**

5. **Integration**: `tests-junior/integration/`
   - Database testing
   - External services
   - Complex workflows

## 🛠️ **Helper Tools**

### API Client (`helpers/api-client.js`)

```javascript
const api = new ApiClient(request);

// Simple requests
const response = await api.get("/users");
const response = await api.post("/users", userData);

// With authentication
api.setAuthToken("your-token");
const response = await api.get("/profile");
```

### Test Data (`helpers/test-data.js`)

```javascript
const { createTestUser, createTestProduct } = require("./helpers/test-data");

const user = createTestUser(); // Generates fake user
const product = createTestProduct(); // Generates fake product
```

### Custom Assertions (`helpers/assertions.js`)

```javascript
const { ApiAssertions } = require("./helpers/assertions");

ApiAssertions.expectSuccess(response);
ApiAssertions.expectError(response);
ApiAssertions.expectRequiredFields(response, ["id", "name"]);
```

## 📊 **Test Reports**

After running tests, you'll get:

- **Console output** with results
- **HTML report** (open with `npm run report`)
- **Screenshots** on failures
- **Detailed error information**

## 🆘 **Common Issues & Solutions**

### ❌ **Connection Errors**

```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution**: Make sure your API server is running

### ❌ **Authentication Errors**

```
Error: 401 Unauthorized
```

**Solution**: Check your token or login credentials

### ❌ **Timeout Errors**

```
Error: Test timeout of 30000ms exceeded
```

**Solution**: Your API is slow - increase timeout in config

### ❌ **Assertion Errors**

```
Expected: 200, Received: 404
```

**Solution**: Check the API endpoint and data

## 🎓 **Learning Resources**

### Internal Documentation

- `docs-junior/getting-started.md` - Start here
- `docs-junior/api-testing-guide.md` - Deep dive into APIs
- `docs-junior/best-practices.md` - Testing best practices

### External Resources

- [HTTP Status Codes](https://httpstatuses.com)
- [REST API Tutorial](https://restfulapi.net)
- [Playwright Documentation](https://playwright.dev)

## 🤝 **Getting Help**

### When You're Stuck

1. **Read the error message** carefully
2. **Check the console logs** for clues
3. **Look at example tests** for patterns
4. **Add debug logs** to understand what's happening
5. **Ask for help** - everyone learns by asking questions!

### Debugging Tips

```javascript
// Add logs to understand what's happening
console.log("Request data:", requestData);
console.log("Response:", response);

// Check response structure
console.log("Response keys:", Object.keys(response.data));

// Verify test data
console.log("Test user:", testUser);
```

## 🎯 **Focus Areas**

This framework focuses on **backend testing** essentials:

✅ **What's Included:**

- API endpoint testing
- Authentication flows
- CRUD operations
- Data validation
- Error handling
- Integration testing
- Simple configuration
- Clear examples
- Step-by-step learning

❌ **What's Excluded:**

- Complex TypeScript patterns
- Visual/UI testing
- Mobile testing
- Performance testing
- Advanced reporting
- Complex configurations

## 🚀 **Next Steps**

1. **Complete the examples** in `tests-junior/examples/`
2. **Write your first API test** using the templates
3. **Practice with different HTTP methods**
4. **Learn authentication testing**
5. **Master CRUD operations**
6. **Explore integration testing**

Remember: **Start simple, practice regularly, ask questions!**

Happy testing! 🎉
