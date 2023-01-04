import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-afrika.json',
      homeUrl: `/stjornbord`,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('should see welcome title', async () => {
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto('/stjornbord')
    await expect(findByRole('heading', 'Stjórnborð Ísland.is')).toBeVisible()
  })
})
