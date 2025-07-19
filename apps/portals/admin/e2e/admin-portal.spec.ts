import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session } from '@island.is/testing/e2e'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      homeUrl: `/stjornbord`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('should see welcome title', async () => {
    const page = await context.newPage()
    await page.goto('/stjornbord')
    await expect(page.getByTestId('active-module-name')).toBeVisible()
  })
})
