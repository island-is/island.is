import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../support/urls'
import { judicialSystemSession } from '../../../support/session'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe('Restriction case', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await judicialSystemSession({
      browser,
    })
  })

  test.afterAll(async () => await context.close())

  test('should have a table visible on the screen', async () => {
    const isLoggedIn = (await context.cookies()).length > 0

    if (isLoggedIn) {
      const page = await context.newPage()
      page.goto('/krofur')
      await expect(page.getByRole('table')).toHaveCount(2)
    }
  })
})
