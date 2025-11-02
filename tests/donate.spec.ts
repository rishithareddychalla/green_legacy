import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

test.describe('Donate Section', () => {
  const randomString = randomBytes(8).toString('hex');
  const email = `testuser_${randomString}@example.com`;
  const password = 'password123';

  test('should redirect to auth page when user is not logged in', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a:has-text("Donate")').click();
    await expect(page).toHaveURL('/auth');
  });

  test('should redirect to dashboard page when user is logged in', async ({ page }) => {
    // Sign up a new user
    await page.goto('/auth');
    await page.getByRole('tab', { name: 'Sign Up' }).click();
    await page.locator('#signup-email').fill(email);
    await page.locator('#signup-password').fill(password);
    await page.locator('#confirm-password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // After signup, we should be on the dashboard
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');

    // Now, test the "Donate" button from the home page
    await page.goto('/');
    await page.locator('nav a:has-text("Donate")').click();

    // Check if the user is redirected to the dashboard page
    await expect(page).toHaveURL('/dashboard');
  });
});
