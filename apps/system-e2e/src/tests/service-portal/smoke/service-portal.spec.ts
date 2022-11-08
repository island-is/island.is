import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'

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
    await page.goto('/minarsidur')
    expect(
      page.locator('a[href^="/minarsidur/"]:has(svg):visible').nth(4),
    ).toBeTruthy()
  })
  test('should have user ${fakeUser.name} logged in', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(
      page.locator('role=heading[name="Gervimaður Afríka"]'),
    ).toBeVisible()
  })
  test('should have Pósthólf', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(page.locator('text=Pósthólf')).toBeVisible()
    await page.locator('aside a[href="/minarsidur/postholf"]').click()
    await expect(page.locator('text=Hér getur þú fundið skjöl')).toBeVisible()
  })
})
