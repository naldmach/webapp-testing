# Web Application Test Framework

Modern testing framework built with Playwright for end-to-end testing of web applications with advanced reporting capabilities.

## 🚀 Key Features

- **Visual Testing**: Automated screenshot comparison and visual regression testing
- **API Testing**: Comprehensive REST API testing with performance metrics
- **Mobile Testing**: Cross-device testing with touch gesture simulation
- **Parallel Execution**: Fast test execution across multiple browsers and devices
- **Advanced Reporting**: HTML reports, Allure integration, custom dashboards, and real-time analytics
- **Performance Testing**: Web Vitals measurement, network throttling, and load testing
- **CI/CD Integration**: GitHub Actions workflows with artifact management
- **Postman Integration**: Newman-based API collection testing
- **Junior Developer Support**: Comprehensive guides and templates for all skill levels

## 🛠 Technologies

- **Playwright** - Modern browser automation
- **TypeScript** - Type-safe test development
- **Node.js** - Runtime environment
- **HTML Reports** - Built-in Playwright reporting
- **GitHub Actions** - CI/CD automation
- **Newman/Postman** - API testing collections

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd webapp-testing
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright browsers**

   ```bash
   npx playwright install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your application URLs and credentials
   ```

## 🏃‍♂️ Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run specific test suites
npm run test:api         # API tests only
npm run test:visual      # Visual tests only
npm run test:mobile      # Mobile tests only
npm run test:performance # Performance tests only
npm run test:examples    # Real-world demo tests

# Debug tests
npm run test:debug
```

### View Reports

```bash
# Open HTML report
npm run report
```

### Run Postman Collections

```bash
# Run Newman/Postman tests
npm run postman
```

## 📁 Project Structure

```
webapp-testing/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline
├── src/
│   ├── base/
│   │   └── base-test.ts            # Base test class
│   ├── config/
│   │   ├── global-setup.ts         # Global test setup
│   │   ├── global-teardown.ts      # Global test cleanup
│   │   └── test-data.ts            # Test data management
│   └── utils/
│       ├── test-helpers.ts         # Common test utilities
│       ├── visual-testing.ts       # Visual testing utilities
│       ├── api-testing.ts          # API testing utilities
│       └── mobile-testing.ts       # Mobile testing utilities
├── tests/
│   ├── api/
│   │   └── auth.spec.ts            # API test examples
│   ├── visual/
│   │   └── homepage.spec.ts        # Visual test examples
│   ├── mobile/
│   │   └── responsive.spec.ts      # Mobile test examples
│   └── e2e/
│       └── user-journey.spec.ts    # End-to-end test examples
├── postman/
│   ├── collection.json             # Postman collection
│   └── environment.json            # Postman environment
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🧪 Test Types

### 1. Visual Testing

Automated screenshot comparison for UI regression testing:

```typescript
import { test } from "../src/base/base-test";

test("homepage visual test", async ({ page, visualTesting }) => {
  await page.goto("/");
  await visualTesting.compareFullPage("homepage");
});
```

**Features:**

- Full page screenshots
- Element-specific comparisons
- Responsive breakpoint testing
- Animation disabling
- Threshold configuration

### 2. API Testing

Comprehensive REST API testing with built-in assertions:

```typescript
test("user authentication", async ({ apiTesting }) => {
  const response = await apiTesting.post(
    "/auth/login",
    {
      username: "test@example.com",
      password: "password123",
    },
    { expectedStatus: 200 }
  );

  expect(response).toHaveProperty("token");
});
```

**Features:**

- HTTP method support (GET, POST, PUT, DELETE)
- Response validation
- Schema validation
- Performance testing
- Batch requests
- Authentication handling

### 3. Mobile Testing

Cross-device testing with touch interactions:

```typescript
test("mobile navigation", async ({ page, mobileTesting }) => {
  await page.goto("/");
  await mobileTesting.testTouchGestures();
  await mobileTesting.testResponsiveBreakpoints([
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
  ]);
});
```

**Features:**

- Device emulation
- Touch gesture simulation
- Orientation testing
- Performance metrics
- Accessibility testing

### 4. End-to-End Testing

Complete user journey testing:

```typescript
test("complete user flow", async ({ page, testHelpers }) => {
  await page.goto("/register");
  await testHelpers.typeText(page.locator("#email"), "user@example.com");
  await testHelpers.safeClick(page.locator('button[type="submit"]'));
  // ... continue with user journey
});
```

## 📊 Reporting

The framework provides multiple reporting options:

### HTML Reports

- Built-in Playwright HTML reports
- Interactive test results
- Screenshots and videos on failure
- Trace viewer integration

### Allure Reports

- Advanced test analytics
- Historical trends
- Test categorization
- Rich attachments

### Custom Reporting

- JSON output for custom dashboards
- JUnit XML for CI integration
- Screenshot galleries
- Performance metrics

## 🔧 Configuration

### Playwright Configuration

Key configuration options in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["html"],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["allure-playwright"],
  ],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
  ],
});
```

### Environment Variables

Configure your testing environment:

```bash
# Application URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api

# Test Configuration
HEADLESS=true
BROWSER=chromium
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Visual Testing
VISUAL_THRESHOLD=0.2
UPDATE_SNAPSHOTS=false
```

## 🚀 CI/CD Integration

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow:

- **Multi-browser testing** (Chrome, Firefox, Safari)
- **Multi-Node.js version support** (18, 20)
- **Parallel test execution**
- **Artifact management** (reports, screenshots)
- **Automatic retries** on failure
- **Slack/Teams notifications**

### Pipeline Structure

```yaml
jobs:
  test: # Cross-browser E2E tests
  api-tests: # API-only tests
  mobile-tests: # Mobile device tests
  visual-tests: # Visual regression tests
  postman-tests: # Newman/Postman tests
  merge-reports: # Combine all reports
  notify: # Send notifications
```

## 🧰 Utilities and Helpers

### TestHelpers

Common utilities for reliable test interactions:

```typescript
// Safe clicking with retry logic
await testHelpers.safeClick(locator);

// Type text with clear
await testHelpers.typeText(locator, "text");

// Wait for stable elements
await testHelpers.waitForElementToBeStable(locator);

// Take timestamped screenshots
await testHelpers.takeScreenshot("test-name");
```

### Test Data Management

Centralized test data with factory methods:

```typescript
import { testData } from "../src/config/test-data";

// Get predefined users
const user = testData.getUser("admin");
const regularUser = testData.getUser("user");

// Create dynamic test data
const newUser = testData.createUser({
  email: testData.generateRandomEmail(),
  password: testData.generateRandomPassword(),
});
```

## 🐛 Debugging

### Local Debugging

```bash
# Run with browser visible
npm run test:headed

# Run with Playwright Inspector
npm run test:debug

# Run specific test file
npx playwright test tests/api/auth.spec.ts --debug
```

### Trace Viewer

View detailed execution traces:

```bash
npx playwright show-trace trace.zip
```

### Screenshots and Videos

Automatic capture on failure:

- Screenshots: `test-results/`
- Videos: `test-results/`
- Traces: `test-results/`

## 📈 Performance Testing

### API Performance

```typescript
const performanceResults = await apiTesting.testPerformance("/api/endpoint", {
  method: "GET",
  maxResponseTime: 1000,
  iterations: 10,
});

console.log("Average response time:", performanceResults.averageTime);
```

### Page Load Performance

```typescript
const metrics = await mobileTesting.testMobilePerformance();
expect(metrics.loadTime).toBeLessThan(3000);
expect(metrics.firstContentfulPaint).toBeLessThan(1500);
```

## 🔒 Security Testing

Basic security checks integrated into the framework:

- **Authentication flow validation**
- **Authorization testing**
- **Input validation**
- **HTTPS enforcement**
- **CSRF protection**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write descriptive test names
- Include JSDoc comments for utilities
- Update README for new features
- Maintain test independence

## 📝 Best Practices

### Test Organization

- Group related tests in describe blocks
- Use meaningful test names
- Keep tests independent
- Clean up test data

### Selectors

- Prefer `data-testid` attributes
- Use semantic selectors when possible
- Avoid brittle CSS selectors
- Create page object models for complex pages

### Assertions

- Use specific assertions
- Include helpful error messages
- Test both positive and negative cases
- Validate data and UI state

### Performance

- Run tests in parallel when possible
- Use page object models
- Minimize unnecessary waits
- Optimize test data setup

## 🆘 Troubleshooting

### Common Issues

**Tests failing in CI but passing locally:**

- Check Node.js versions match
- Verify environment variables
- Review browser versions
- Check network conditions

**Visual tests failing:**

- Update baseline screenshots
- Check threshold settings
- Verify consistent test environment
- Review animation handling

**API tests timing out:**

- Increase timeout values
- Check API endpoint availability
- Verify authentication tokens
- Review network configuration

### Getting Help

1. Check the [Playwright documentation](https://playwright.dev/)
2. Review test logs and traces
3. Use the Playwright Inspector for debugging
4. Check GitHub Issues for known problems

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Amazing browser automation
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform
- [Newman](https://github.com/postmanlabs/newman) - Postman collection runner

---

**Happy Testing! 🎉**
