import {
  test as base,
  Page,
  BrowserContext,
  APIRequestContext,
} from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";
import { VisualTesting } from "../utils/visual-testing";
import { ApiTesting } from "../utils/api-testing";
import { MobileTesting } from "../utils/mobile-testing";

// Extend the base test with custom fixtures
export const test = base.extend<{
  testHelpers: TestHelpers;
  visualTesting: VisualTesting;
  apiTesting: ApiTesting;
  mobileTesting: MobileTesting;
}>({
  testHelpers: async ({ page }, use) => {
    const testHelpers = new TestHelpers(page);
    await use(testHelpers);
  },

  visualTesting: async ({ page }, use) => {
    const visualTesting = new VisualTesting(page);
    await use(visualTesting);
  },

  apiTesting: async ({ request }, use) => {
    const apiTesting = new ApiTesting(request);
    await use(apiTesting);
  },

  mobileTesting: async ({ page, context }, use) => {
    const mobileTesting = new MobileTesting(page, context);
    await use(mobileTesting);
  },
});

export { expect } from "@playwright/test";

// Base test class for common functionality
export class BaseTest {
  constructor(
    protected page: Page,
    protected context: BrowserContext,
    protected request?: APIRequestContext
  ) {}

  /**
   * Navigate to a page with common setup
   */
  async navigateTo(
    url: string,
    options?: {
      waitForSelector?: string;
      timeout?: number;
    }
  ): Promise<void> {
    await this.page.goto(url);

    if (options?.waitForSelector) {
      await this.page.waitForSelector(options.waitForSelector, {
        timeout: options.timeout || 30000,
      });
    }

    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Common authentication setup
   */
  async authenticate(credentials: {
    username: string;
    password: string;
  }): Promise<void> {
    // This would typically involve API calls or form filling
    // Implementation depends on your authentication system
    console.log(`Authenticating user: ${credentials.username}`);
  }

  /**
   * Clean up after test
   */
  async cleanup(): Promise<void> {
    // Clear cookies and local storage
    await this.context.clearCookies();
    await this.page.evaluate(() => {
      if (typeof localStorage !== "undefined") localStorage.clear();
      if (typeof sessionStorage !== "undefined") sessionStorage.clear();
    });
  }

  /**
   * Wait for element with retry logic
   */
  async waitForElement(selector: string, timeout = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get element safely with error handling
   */
  async getElement(selector: string) {
    try {
      return await this.page.locator(selector);
    } catch (error) {
      throw new Error(`Element not found: ${selector}`);
    }
  }

  /**
   * Take screenshot with test context
   */
  async takeScreenshot(name: string, fullPage = false): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.page.screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage,
    });
  }
}
