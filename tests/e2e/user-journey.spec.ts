import { test, expect } from "../../src/base/base-test";

test.describe("Complete User Journey Tests", () => {
  test("user registration and login flow", async ({ page, testHelpers }) => {
    // Navigate to registration page
    await page.goto("/register");
    await testHelpers.waitForPageLoad();

    // Fill registration form
    const uniqueEmail = `test${Date.now()}@example.com`;
    await testHelpers.typeText(page.locator("#username"), "testuser");
    await testHelpers.typeText(page.locator("#email"), uniqueEmail);
    await testHelpers.typeText(page.locator("#password"), "TestPassword123!");
    await testHelpers.typeText(
      page.locator("#confirmPassword"),
      "TestPassword123!"
    );

    // Submit registration
    await testHelpers.safeClick(page.locator('button[type="submit"]'));

    // Wait for success message or redirect
    await expect(page.locator(".success-message")).toBeVisible({
      timeout: 10000,
    });

    // Navigate to login
    await page.goto("/login");

    // Login with new credentials
    await testHelpers.typeText(page.locator("#email"), uniqueEmail);
    await testHelpers.typeText(page.locator("#password"), "TestPassword123!");
    await testHelpers.safeClick(page.locator('button[type="submit"]'));

    // Verify successful login
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test("shopping cart flow", async ({ page, testHelpers }) => {
    // Login first
    await page.goto("/login");
    await testHelpers.typeText(page.locator("#email"), "testuser@example.com");
    await testHelpers.typeText(page.locator("#password"), "TestPassword123!");
    await testHelpers.safeClick(page.locator('button[type="submit"]'));

    // Navigate to products
    await page.goto("/products");
    await testHelpers.waitForPageLoad();

    // Add items to cart
    const addToCartButtons = page.locator('[data-testid="add-to-cart"]');
    const buttonCount = await addToCartButtons.count();

    if (buttonCount > 0) {
      // Add first 3 items to cart
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        await testHelpers.safeClick(addToCartButtons.nth(i));
        await page.waitForTimeout(1000); // Wait for cart update
      }

      // Navigate to cart
      await testHelpers.safeClick(page.locator('[data-testid="cart-link"]'));
      await testHelpers.waitForPageLoad();

      // Verify items in cart
      const cartItems = page.locator('[data-testid="cart-item"]');
      expect(await cartItems.count()).toBeGreaterThan(0);

      // Update quantity
      const quantityInput = cartItems.first().locator('input[type="number"]');
      if ((await quantityInput.count()) > 0) {
        await testHelpers.typeText(quantityInput, "2");
      }

      // Remove an item
      const removeButtons = page.locator('[data-testid="remove-item"]');
      if ((await removeButtons.count()) > 0) {
        await testHelpers.safeClick(removeButtons.first());
      }

      // Proceed to checkout
      await testHelpers.safeClick(
        page.locator('[data-testid="checkout-button"]')
      );

      // Verify checkout page
      await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
    }
  });

  test("search and filter functionality", async ({ page, testHelpers }) => {
    await page.goto("/products");
    await testHelpers.waitForPageLoad();

    // Test search
    const searchInput = page.locator('[data-testid="search-input"]');
    if ((await searchInput.count()) > 0) {
      await testHelpers.typeText(searchInput, "test product");
      await page.keyboard.press("Enter");
      await testHelpers.waitForPageLoad();

      // Verify search results
      const results = page.locator('[data-testid="product-item"]');
      expect(await results.count()).toBeGreaterThan(0);
    }

    // Test filters
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    if ((await categoryFilter.count()) > 0) {
      await testHelpers.safeClick(categoryFilter);

      const filterOption = page
        .locator('[data-testid="filter-option"]')
        .first();
      if ((await filterOption.count()) > 0) {
        await testHelpers.safeClick(filterOption);
        await testHelpers.waitForPageLoad();

        // Verify filtered results
        const filteredResults = page.locator('[data-testid="product-item"]');
        expect(await filteredResults.count()).toBeGreaterThan(0);
      }
    }

    // Test sorting
    const sortDropdown = page.locator('[data-testid="sort-dropdown"]');
    if ((await sortDropdown.count()) > 0) {
      await testHelpers.safeClick(sortDropdown);

      const sortOption = page.locator('[data-value="price-low-high"]');
      if ((await sortOption.count()) > 0) {
        await testHelpers.safeClick(sortOption);
        await testHelpers.waitForPageLoad();
      }
    }
  });

  test("user profile management", async ({ page, testHelpers }) => {
    // Login
    await page.goto("/login");
    await testHelpers.typeText(page.locator("#email"), "testuser@example.com");
    await testHelpers.typeText(page.locator("#password"), "TestPassword123!");
    await testHelpers.safeClick(page.locator('button[type="submit"]'));

    // Navigate to profile
    await testHelpers.safeClick(page.locator('[data-testid="user-menu"]'));
    await testHelpers.safeClick(page.locator('[data-testid="profile-link"]'));

    // Update profile information
    const nameInput = page.locator("#fullName");
    if ((await nameInput.count()) > 0) {
      await testHelpers.typeText(nameInput, "Updated Test User");
    }

    const phoneInput = page.locator("#phone");
    if ((await phoneInput.count()) > 0) {
      await testHelpers.typeText(phoneInput, "+1234567890");
    }

    // Save changes
    await testHelpers.safeClick(page.locator('[data-testid="save-profile"]'));

    // Verify success message
    await expect(page.locator(".success-message")).toBeVisible({
      timeout: 10000,
    });

    // Test password change
    const changePasswordButton = page.locator(
      '[data-testid="change-password"]'
    );
    if ((await changePasswordButton.count()) > 0) {
      await testHelpers.safeClick(changePasswordButton);

      await testHelpers.typeText(
        page.locator("#currentPassword"),
        "TestPassword123!"
      );
      await testHelpers.typeText(
        page.locator("#newPassword"),
        "NewPassword123!"
      );
      await testHelpers.typeText(
        page.locator("#confirmNewPassword"),
        "NewPassword123!"
      );

      await testHelpers.safeClick(
        page.locator('[data-testid="update-password"]')
      );

      // Verify password change success
      await expect(page.locator(".success-message")).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test("error handling and recovery", async ({ page, testHelpers }) => {
    // Test network error handling
    await page.route("**/api/**", (route) => {
      route.abort("failed");
    });

    await page.goto("/products");

    // Verify error message is displayed
    const errorMessage = page.locator(
      '[data-testid="error-message"], .error-message'
    );
    await expect(errorMessage).toBeVisible({ timeout: 10000 });

    // Test retry functionality
    const retryButton = page.locator('[data-testid="retry-button"]');
    if ((await retryButton.count()) > 0) {
      // Remove network interception
      await page.unroute("**/api/**");

      await testHelpers.safeClick(retryButton);
      await testHelpers.waitForPageLoad();

      // Verify content loads after retry
      const products = page.locator('[data-testid="product-item"]');
      await expect(products.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("accessibility navigation", async ({ page, testHelpers }) => {
    await page.goto("/");

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    let focusedElement = await page.locator(":focus");
    expect(await focusedElement.count()).toBeGreaterThan(0);

    // Navigate through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      focusedElement = await page.locator(":focus");

      // Verify focus is visible
      const isVisible = await focusedElement.isVisible();
      expect(isVisible).toBeTruthy();
    }

    // Test skip links
    const skipLink = page.locator('[data-testid="skip-to-content"]');
    if ((await skipLink.count()) > 0) {
      await testHelpers.safeClick(skipLink);

      const mainContent = page.locator('main, [data-testid="main-content"]');
      if ((await mainContent.count()) > 0) {
        const isFocused = await mainContent.evaluate(
          (el) => document.activeElement === el
        );
        expect(isFocused).toBeTruthy();
      }
    }
  });
});
