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
    for (let i = 0; i < 5; i++) {
      const page = await context.newPage()
      const cookies = await context.cookies()

      if (cookies.length > 0) {
        page.goto('/krofur')
        await expect(page.getByRole('table')).toHaveCount(2)
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  })
})
