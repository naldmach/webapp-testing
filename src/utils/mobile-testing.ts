import { Page, BrowserContext } from "@playwright/test";

export class MobileTesting {
  constructor(private page: Page, private context: BrowserContext) {}

  /**
   * Test responsive breakpoints
   */
  async testResponsiveBreakpoints(
    breakpoints: Array<{ name: string; width: number; height: number }>
  ): Promise<void> {
    for (const breakpoint of breakpoints) {
      console.log(
        `Testing breakpoint: ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`
      );

      await this.page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height,
      });

      // Wait for responsive changes to take effect
      await this.page.waitForTimeout(1000);
      await this.page.waitForLoadState("networkidle");

      // Take screenshot for visual verification
      await this.page.screenshot({
        path: `screenshots/responsive-${breakpoint.name.toLowerCase()}.png`,
        fullPage: true,
      });
    }
  }

  /**
   * Test touch gestures
   */
  async testTouchGestures(): Promise<void> {
    // Test tap
    await this.testTap();

    // Test swipe
    await this.testSwipe();

    // Test pinch zoom
    await this.testPinchZoom();

    // Test long press
    await this.testLongPress();
  }

  /**
   * Test tap gesture
   */
  async testTap(selector = "body"): Promise<void> {
    const element = this.page.locator(selector);
    await element.tap();
    await this.page.waitForTimeout(500);
  }

  /**
   * Test swipe gestures
   */
  async testSwipe(
    direction: "left" | "right" | "up" | "down" = "left",
    selector = "body"
  ): Promise<void> {
    const element = this.page.locator(selector);
    const box = await element.boundingBox();

    if (!box) throw new Error("Element not found for swipe gesture");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    let endX = startX;
    let endY = startY;

    const distance = 100;

    switch (direction) {
      case "left":
        endX = startX - distance;
        break;
      case "right":
        endX = startX + distance;
        break;
      case "up":
        endY = startY - distance;
        break;
      case "down":
        endY = startY + distance;
        break;
    }

    await this.page.touchscreen.tap(startX, startY);
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
  }

  /**
   * Test pinch zoom
   */
  async testPinchZoom(zoomIn = true, selector = "body"): Promise<void> {
    const element = this.page.locator(selector);
    const box = await element.boundingBox();

    if (!box) throw new Error("Element not found for pinch zoom");

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    const distance = zoomIn ? 50 : 150;
    const finalDistance = zoomIn ? 150 : 50;

    // Simulate two finger pinch
    await this.page.touchscreen.tap(centerX - distance, centerY);
    await this.page.touchscreen.tap(centerX + distance, centerY);

    // Move fingers to simulate zoom
    await this.page.mouse.move(centerX - distance, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX - finalDistance, centerY);
    await this.page.mouse.up();
  }

  /**
   * Test long press
   */
  async testLongPress(selector: string, duration = 1000): Promise<void> {
    const element = this.page.locator(selector);
    const box = await element.boundingBox();

    if (!box) throw new Error("Element not found for long press");

    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.waitForTimeout(duration);
    await this.page.mouse.up();
  }

  /**
   * Test device orientation
   */
  async testOrientation(): Promise<void> {
    // Test portrait
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(1000);
    await this.page.screenshot({ path: "screenshots/portrait.png" });

    // Test landscape
    await this.page.setViewportSize({ width: 667, height: 375 });
    await this.page.waitForTimeout(1000);
    await this.page.screenshot({ path: "screenshots/landscape.png" });
  }

  /**
   * Test mobile form interactions
   */
  async testMobileFormInteractions(): Promise<void> {
    // Test virtual keyboard appearance
    const input = this.page.locator('input[type="text"]').first();
    if ((await input.count()) > 0) {
      await input.tap();
      await this.page.waitForTimeout(1000); // Wait for keyboard
      await input.fill("Test input");

      // Hide keyboard
      await this.page.keyboard.press("Escape");
    }

    // Test select dropdown on mobile
    const select = this.page.locator("select").first();
    if ((await select.count()) > 0) {
      await select.tap();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Test mobile navigation patterns
   */
  async testMobileNavigation(): Promise<void> {
    // Test hamburger menu if present
    const hamburger = this.page
      .locator('[data-testid="hamburger"], .hamburger, .menu-toggle')
      .first();
    if ((await hamburger.count()) > 0) {
      await hamburger.tap();
      await this.page.waitForTimeout(500);

      // Close menu
      await hamburger.tap();
      await this.page.waitForTimeout(500);
    }

    // Test bottom navigation if present
    const bottomNav = this.page
      .locator('[data-testid="bottom-nav"], .bottom-nav')
      .first();
    if ((await bottomNav.count()) > 0) {
      const navItems = bottomNav.locator("a, button");
      const count = await navItems.count();

      for (let i = 0; i < count; i++) {
        await navItems.nth(i).tap();
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Test mobile performance
   */
  async testMobilePerformance(): Promise<{
    loadTime: number;
    firstContentfulPaint: number;
  }> {
    const startTime = Date.now();

    await this.page.goto(this.page.url(), { waitUntil: "networkidle" });

    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return {
        firstContentfulPaint:
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime || 0,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    return {
      loadTime,
      firstContentfulPaint: performanceMetrics.firstContentfulPaint,
    };
  }

  /**
   * Test accessibility on mobile
   */
  async testMobileAccessibility(): Promise<void> {
    // Test focus management
    await this.page.keyboard.press("Tab");
    const focusedElement = await this.page.locator(":focus");

    if ((await focusedElement.count()) > 0) {
      // Verify focus is visible
      const box = await focusedElement.boundingBox();
      if (box) {
        console.log("Focus is visible at:", box);
      }
    }

    // Test touch target sizes (minimum 44x44 pixels)
    const touchTargets = await this.page
      .locator("button, a, input, select, textarea")
      .all();

    for (const target of touchTargets) {
      const box = await target.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        console.warn(
          "Touch target too small:",
          (await target.getAttribute("class")) || "unknown"
        );
      }
    }
  }
}
