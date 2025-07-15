import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/urls'
import { judicialSystemSession } from '../../../support/session'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe('Case list test', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await judicialSystemSession({
      browser,
    })
  })

  test.afterAll(async () => await context.close())

  test('should have a table visible on the screen', async () => {
    const page = await context.newPage()
    await page.goto('/malalistar')
    await expect(page).toHaveURL('/malalistar')
    await page.getByRole('button', { name: 'Nýtt mál' }).isVisible()
  })
})
