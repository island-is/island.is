import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Restriction case', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      homeUrl: '/krofur',
      phoneNumber: '0103019',
      idsLoginOn: false,
    })
  })

  test.afterAll(async () => await context.close())

  test('should have a table visible on the screen', async () => {
    const page = await context.newPage()
    await page.goto('/api/auth/login?nationalId=0000000009')
    await expect(page.locator('role=table')).toBeVisible()
  })
})
