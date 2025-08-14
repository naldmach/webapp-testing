import { test, expect } from "../../src/base/base-test";

// 🌐 Real-world demo tests using public websites
// These tests demonstrate the framework working with actual applications

test.describe("Real World Examples", () => {
  test("GitHub homepage visual test", async ({ page, visualTesting }) => {
    await page.goto("https://github.com");

    // Wait for page to fully load - use more reliable selector
    await page.waitForSelector("main", { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Test visual regression
    await visualTesting.compareFullPage("github-homepage", {
      threshold: 0.3, // Higher threshold for dynamic content
      animations: "disabled",
    });
  });

  test("Wikipedia search functionality", async ({ page, testHelpers }) => {
    await page.goto("https://en.wikipedia.org");

    // Search functionality - use more reliable selectors
    await testHelpers.typeText(
      page.locator("input[name='search']"),
      "Playwright testing"
    );
    await page.keyboard.press("Enter");

    // Verify results
    await expect(page.locator("h1")).toContainText("Playwright", { timeout: 10000 });
    await testHelpers.takeScreenshot("wikipedia-search-results");
  });

  test("JSONPlaceholder API testing", async ({ apiTesting }) => {
    // Test a real public API
    const response = await apiTesting.get(
      "https://jsonplaceholder.typicode.com/posts/1",
      {
        expectedStatus: 200,
      }
    );

    // Validate response structure
    await apiTesting.validateSchema(response, {
      userId: "number",
      id: "number",
      title: "string",
      body: "string",
    });

    // Performance test
    const perfResults = await apiTesting.testPerformance(
      "https://jsonplaceholder.typicode.com/posts",
      {
        method: "GET",
        maxResponseTime: 2000,
        iterations: 3,
      }
    );

    console.log("API Performance:", perfResults);
  });

  test("Responsive design test on real site", async ({
    page,
    mobileTesting,
  }) => {
    await page.goto("https://playwright.dev");

    const breakpoints = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1920, height: 1080 },
    ];

    await mobileTesting.testResponsiveBreakpoints(breakpoints);
  });
});

