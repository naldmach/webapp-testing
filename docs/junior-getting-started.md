# 🚀 Junior Developer Quick Start Guide

## Overview

This guide helps junior developers get started with writing tests using our established framework.

## Prerequisites

- Basic JavaScript/TypeScript knowledge
- Understanding of web applications (HTML, CSS, basic interactions)
- Git basics

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd webapp-testing
npm install
npx playwright install
```

### 2. Your First Test

Create a simple test in `tests/beginner/my-first-test.spec.ts`:

```typescript
import { test, expect } from "../src/base/base-test";

test.describe("My First Tests", () => {
  test("page loads successfully", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("https://example.com");
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/.*about/);
  });
});
```

### 3. Run Your Test

```bash
npx playwright test tests/beginner/my-first-test.spec.ts --headed
```

## Simple Patterns to Follow

### ✅ Basic Page Interactions

```typescript
// Click elements
await page.click("button");
await page.click("text=Submit");

// Fill forms
await page.fill("#email", "test@example.com");
await page.fill("#password", "password123");

// Check text content
await expect(page.locator("h1")).toHaveText("Welcome");
await expect(page.locator(".error")).toContainText("Invalid");
```

### ✅ Common Assertions

```typescript
// Visibility checks
await expect(page.locator("#header")).toBeVisible();
await expect(page.locator("#loading")).toBeHidden();

// URL checks
await expect(page).toHaveURL("https://example.com/dashboard");
await expect(page).toHaveTitle("Dashboard");

// Count elements
await expect(page.locator(".item")).toHaveCount(5);
```

### ✅ Waiting for Elements

```typescript
// Wait for element to appear
await page.waitForSelector(".success-message");

// Wait for navigation
await page.waitForURL("**/dashboard");

// Wait for network requests
await page.waitForLoadState("networkidle");
```

## What NOT to Modify (Yet)

- `playwright.config.ts` - Complex configuration
- `src/utils/` - Advanced utility functions
- `src/config/` - Framework setup files
- `.github/workflows/` - CI/CD pipelines

## Getting Help

1. **Read existing tests** in `tests/` folders for examples
2. **Use the debugger**: `npm run test:debug`
3. **Check the reports**: `npm run report`
4. **Ask senior developers** about framework internals

## Common Mistakes to Avoid

❌ Don't modify core framework files without understanding
❌ Don't skip waiting for elements to load
❌ Don't write tests that depend on other tests
❌ Don't hardcode sensitive data in tests

✅ Do write independent, focused tests
✅ Do use meaningful test descriptions
✅ Do clean up test data when needed
✅ Do follow existing naming conventions

## Next Steps

Once comfortable with basics:

1. Learn about our test helpers in `src/utils/`
2. Understand visual testing concepts
3. Explore API testing patterns
4. Study mobile testing approaches

Remember: Focus on writing good tests first, framework complexity comes later!
