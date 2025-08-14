import { test, expect } from '../../src/base/base-test';

// 🎯 TEMPLATE: Basic Web Page Testing
// Copy this file and modify for your tests

test.describe('Basic Page Tests Template', () => {
  // ✅ Simple page load test
  test('page loads without errors', async ({ page }) => {
    await page.goto('https://example.com'); // Replace with your URL

    // Check that main elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  // ✅ Form interaction test
  test('contact form works', async ({ page }) => {
    await page.goto('https://example.com/contact'); // Replace with your URL

    // Fill out the form
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'This is a test message');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.locator('.success')).toBeVisible();
  });

  // ✅ Navigation test
  test('navigation menu works', async ({ page }) => {
    await page.goto('https://example.com'); // Replace with your URL

    // Click on navigation links
    await page.click('text=About');
    await expect(page).toHaveURL(/.*about/);

    await page.click('text=Services');
    await expect(page).toHaveURL(/.*services/);
  });

  // ✅ Search functionality test
  test('search feature works', async ({ page }) => {
    await page.goto('https://example.com'); // Replace with your URL

    // Use search
    await page.fill('#search', 'test query');
    await page.press('#search', 'Enter');

    // Check results appear
    await expect(page.locator('.search-results')).toBeVisible();
    await expect(page.locator('.result-item')).toHaveCount(1);
  });
});

// 📝 NOTES FOR JUNIOR DEVELOPERS:
//
// 1. Replace 'https://example.com' with your actual website URL
// 2. Update selectors (like '#name', '.success') to match your HTML
// 3. Modify test descriptions to match what you're actually testing
// 4. Run tests with: npx playwright test tests/beginner/template-basic.spec.ts --headed
// 5. View results with: npm run report
//
// 🚨 REMEMBER:
// - Each test should be independent (don't rely on previous tests)
// - Use meaningful descriptions
// - Wait for elements to load before interacting
// - Check both positive and negative scenarios
