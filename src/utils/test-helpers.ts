import { Page, Locator } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for element to be visible and stable
   */
  async waitForElementToBeStable(
    locator: Locator,
    timeout = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Safe click with retry mechanism
   */
  async safeClick(locator: Locator, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.waitForElementToBeStable(locator);
        await locator.click();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Type text with clear first
   */
  async typeText(locator: Locator, text: string): Promise<void> {
    await this.waitForElementToBeStable(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string, fullPage = false): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;

    await this.page.screenshot({
      path: `screenshots/${filename}`,
      fullPage,
    });

    return filename;
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<any> {
    const response = await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        return typeof urlPattern === 'string'
          ? url.includes(urlPattern)
          : urlPattern.test(url);
      },
      { timeout }
    );

    return response.json();
  }

  /**
   * Mock API response
   */
  async mockApiResponse(
    urlPattern: string | RegExp,
    mockData: any,
    status = 200
  ): Promise<void> {
    await this.page.route(urlPattern, (route) => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(mockData),
      });
    });
  }

  /**
   * Check if element exists without throwing
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Allow for smooth scrolling
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get element text with retry
   */
  async getTextContent(locator: Locator, timeout = 10000): Promise<string> {
    await this.waitForElementToBeStable(locator, timeout);
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Hover over element
   */
  async hoverElement(locator: Locator): Promise<void> {
    await this.waitForElementToBeStable(locator);
    await locator.hover();
    await this.page.waitForTimeout(500); // Allow for hover effects
  }
}
