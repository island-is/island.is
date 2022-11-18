import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('should have clickable navigation bar', async () => {
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto('/minarsidur')
    await expect(findByRole('link', 'Pósthólf')).toBeVisible()
  })
  test('should have user Gervimaður Afríka logged in', async () => {
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto('/minarsidur')
    await expect(findByRole('heading', 'Gervimaður Afríka')).toBeVisible()
  })
  test('should have Pósthólf', async () => {
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto('/minarsidur')
    await findByRole('link', 'Pósthólf').click()
    await expect(page.locator('text=Hér getur þú fundið skjöl')).toBeVisible()
  })
})
