import { BrowserContext, expect, test } from '@playwright/test'
import { ProjectBasePath } from '@island.is/shared/constants'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      homeUrl: ProjectBasePath.AdminPortal,
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
    await page.goto(ProjectBasePath.AdminPortal)
    await expect(findByTestId('active-module-name')).toBeVisible()
  })
})
