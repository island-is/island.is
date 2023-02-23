import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe('Restriction case', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      homeUrl: '/api/auth/login?nationalId=2510654469',
      phoneNumber: '0103019',
      idsLoginOn: false,
    })
  })

  test.afterAll(async () => await context.close())

  test('should have a table visible on the screen', async () => {
    const page = await context.newPage()
    await expect(page.locator('role=table')).toBeVisible()
  })
})
