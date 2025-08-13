import { test, expect, devices } from "../../src/base/base-test";

test.describe("Mobile Responsive Tests", () => {
  test("test mobile navigation", async ({ page, mobileTesting }) => {
    await page.goto("/");
    await mobileTesting.testMobileNavigation();
  });

  test("test touch gestures", async ({ page, mobileTesting }) => {
    await page.goto("/");
    await mobileTesting.testTouchGestures();
  });

  test("test responsive breakpoints", async ({ page, mobileTesting }) => {
    await page.goto("/");

    const breakpoints = [
      { name: "Mobile-Small", width: 320, height: 568 },
      { name: "Mobile-Medium", width: 375, height: 667 },
      { name: "Mobile-Large", width: 414, height: 896 },
      { name: "Tablet-Portrait", width: 768, height: 1024 },
      { name: "Tablet-Landscape", width: 1024, height: 768 },
      { name: "Desktop-Small", width: 1366, height: 768 },
      { name: "Desktop-Large", width: 1920, height: 1080 },
    ];

    await mobileTesting.testResponsiveBreakpoints(breakpoints);
  });

  test("test device orientation changes", async ({ page, mobileTesting }) => {
    await page.goto("/");
    await mobileTesting.testOrientation();
  });

  test("test mobile form interactions", async ({ page, mobileTesting }) => {
    await page.goto("/contact");
    await mobileTesting.testMobileFormInteractions();
  });

  test("test mobile performance", async ({ page, mobileTesting }) => {
    await page.goto("/");

    const performanceMetrics = await mobileTesting.testMobilePerformance();

    console.log("Mobile Performance Metrics:", performanceMetrics);

    // Assert performance thresholds
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // 5 seconds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
  });

  test("test mobile accessibility", async ({ page, mobileTesting }) => {
    await page.goto("/");
    await mobileTesting.testMobileAccessibility();
  });
});

// Test specific mobile devices
test.describe("Device-Specific Tests", () => {
  test.use({ ...devices["iPhone 12"] });

  test("iPhone 12 specific tests", async ({ page, testHelpers }) => {
    await page.goto("/");

    // Test safe area handling
    const safeAreaTop = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue(
        "--safe-area-inset-top"
      );
    });

    // Verify safe area is handled
    expect(safeAreaTop).toBeTruthy();

    await testHelpers.takeScreenshot("iphone-12-homepage");
  });
});

test.describe("Tablet Tests", () => {
  test.use({ ...devices["iPad Pro"] });

  test("iPad Pro layout tests", async ({ page, testHelpers }) => {
    await page.goto("/");

    // Test split-screen layout if applicable
    const sidebar = page.locator('[data-testid="sidebar"]');
    if ((await sidebar.count()) > 0) {
      const isVisible = await sidebar.isVisible();
      expect(isVisible).toBeTruthy();
    }

    await testHelpers.takeScreenshot("ipad-pro-homepage");
  });
});

test.describe("Cross-Device Tests", () => {
  const mobileDevices = ["iPhone 12", "Pixel 5", "iPhone 12 Pro Max"];

  for (const deviceName of mobileDevices) {
    test(`test on ${deviceName}`, async ({ browser }) => {
      const device = devices[deviceName];
      const context = await browser.newContext({
        ...device,
      });

      const page = await context.newPage();
      await page.goto("/");

      // Test critical user flows work on this device
      await page.waitForLoadState("networkidle");

      // Test navigation
      const menuButton = page.locator('[data-testid="menu-button"]');
      if ((await menuButton.count()) > 0) {
        await menuButton.tap();
        await page.waitForTimeout(500);
      }

      // Test form interactions
      const searchInput = page.locator('input[type="search"]');
      if ((await searchInput.count()) > 0) {
        await searchInput.tap();
        await searchInput.fill("test search");
      }

      await page.screenshot({
        path: `screenshots/${deviceName
          .toLowerCase()
          .replace(/\s+/g, "-")}-test.png`,
        fullPage: true,
      });

      await context.close();
    });
  }
});
