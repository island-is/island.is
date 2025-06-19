import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session, helpers } from '@island.is/testing/e2e'

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
    const { findByTestId } = helpers(page)
    await page.goto('/stjornbord')
    await expect(findByTestId('active-module-name')).toBeVisible()
  })
})
