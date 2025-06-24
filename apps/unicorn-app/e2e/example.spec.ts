import { test } from '@playwright/test'

import { expect } from '@island.is/testing/e2e'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome')
})
