import { test, expect } from "../../src/base/base-test";

test.describe("Homepage Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("homepage full page screenshot", async ({ page, visualTesting }) => {
    await visualTesting.compareFullPage("homepage", {
      threshold: 0.2,
      animations: "disabled",
    });
  });

  test("header component visual test", async ({ page, visualTesting }) => {
    await visualTesting.compareElement("header", "homepage-header", {
      threshold: 0.1,
    });
  });

  test("navigation menu visual test", async ({ page, visualTesting }) => {
    await visualTesting.compareElement("nav", "homepage-navigation");
  });

  test("footer component visual test", async ({ page, visualTesting }) => {
    await visualTesting.compareElement("footer", "homepage-footer");
  });

  test("responsive design visual tests", async ({ page, visualTesting }) => {
    const breakpoints = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1920, height: 1080 },
    ];

    await visualTesting.compareAcrossViewports(
      "homepage-responsive",
      breakpoints
    );
  });

  test("dark mode visual test", async ({ page, visualTesting }) => {
    // Toggle dark mode if available
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if ((await darkModeToggle.count()) > 0) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      await visualTesting.compareFullPage("homepage-dark-mode", {
        threshold: 0.3,
      });
    }
  });

  test("hover states visual test", async ({
    page,
    testHelpers,
    visualTesting,
  }) => {
    const buttons = page.locator("button, a[href]");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      await testHelpers.hoverElement(button);
      await visualTesting.compareElement(
        `button:nth-child(${i + 1})`,
        `button-hover-${i + 1}`
      );
    }
  });

  test("loading states visual test", async ({ page, visualTesting }) => {
    // Simulate slow network to capture loading states
    await page.route("**/*", (route) => {
      setTimeout(() => route.continue(), 1000);
    });

    await page.reload();

    // Capture loading state
    await page.waitForTimeout(500);
    await visualTesting.compareFullPage("homepage-loading");
  });
});
