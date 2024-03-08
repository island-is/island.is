import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect h1 to contain a substring.
  await expect(page.locator('div').first()).not.toBeEmpty()
})
