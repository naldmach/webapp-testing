import { Page, expect } from '@playwright/test';

export class VisualTesting {
  constructor(private page: Page) {}

  /**
   * Compare full page screenshot
   */
  async compareFullPage(
    testName: string,
    options?: {
      threshold?: number;
      maxDiffPixels?: number;
      animations?: 'disabled' | 'allow';
    }
  ): Promise<void> {
    // Disable animations for consistent screenshots
    if (options?.animations === 'disabled') {
      await this.disableAnimations();
    }

    // Wait for page to be stable
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    await expect(this.page).toHaveScreenshot(`${testName}-full-page.png`, {
      threshold: options?.threshold || 0.2,
      maxDiffPixels: options?.maxDiffPixels || 100,
      fullPage: true,
    });
  }

  /**
   * Compare element screenshot
   */
  async compareElement(
    selector: string,
    testName: string,
    options?: {
      threshold?: number;
      maxDiffPixels?: number;
      mask?: string[];
    }
  ): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });

    // Mask dynamic content if specified
    const maskLocators =
      options?.mask?.map((maskSelector) => this.page.locator(maskSelector)) ||
      [];

    await expect(element).toHaveScreenshot(`${testName}-element.png`, {
      threshold: options?.threshold || 0.2,
      maxDiffPixels: options?.maxDiffPixels || 100,
      mask: maskLocators,
    });
  }

  /**
   * Compare multiple elements
   */
  async compareElements(selectors: string[], testName: string): Promise<void> {
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });

      await expect(element).toHaveScreenshot(
        `${testName}-element-${i + 1}.png`,
        {
          threshold: 0.2,
        }
      );
    }
  }

  /**
   * Disable animations for consistent screenshots
   */
  private async disableAnimations(): Promise<void> {
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-delay: -1ms !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          background-attachment: initial !important;
          scroll-behavior: auto !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
  }

  /**
   * Wait for images to load
   */
  async waitForImages(): Promise<void> {
    await this.page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every((img) => img.complete && img.naturalHeight !== 0);
    });
  }

  /**
   * Hide dynamic content for consistent screenshots
   */
  async hideDynamicContent(selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      await this.page.locator(selector).evaluate((el) => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    }
  }

  /**
   * Compare with custom viewport
   */
  async compareWithViewport(
    testName: string,
    viewport: { width: number; height: number }
  ): Promise<void> {
    await this.page.setViewportSize(viewport);
    await this.page.waitForTimeout(1000); // Allow for responsive changes
    await this.compareFullPage(
      `${testName}-${viewport.width}x${viewport.height}`
    );
  }

  /**
   * Compare across multiple viewports
   */
  async compareAcrossViewports(
    testName: string,
    viewports: Array<{ width: number; height: number }>
  ): Promise<void> {
    for (const viewport of viewports) {
      await this.compareWithViewport(testName, viewport);
    }
  }
}
