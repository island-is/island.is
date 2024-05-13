import { test, expect } from '@playwright/test'

// Very simple dummy test to verify that tests in `e2e/` also pass,
// also used for a _minimal_ tests to verify that Playwright works at all
test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect h1 to contain a substring.
  await expect(page.locator('div').first()).not.toBeEmpty()
})
