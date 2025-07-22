import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal - admin delegations', () => {
  let context: BrowserContext

  test.describe('As admin with write access', () => {
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

    test('should see "Add" button', async () => {
      const page = await context.newPage()
      await page.goto('/stjornbord/delegation-admin')
      await expect(page.getByText('Skrá nýtt umboð')).toBeVisible()
    })
  })
})
