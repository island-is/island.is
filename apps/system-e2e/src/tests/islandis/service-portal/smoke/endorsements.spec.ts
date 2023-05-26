import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Endorsements', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Go to endorsement lists ', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Check Service Portal UI', async () => {
      // Navigate to the specified page
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/min-gogn/listar'))

      // Check for ui things
      await page.waitForSelector('button:text("Stofna nýjan lista")')
      await expect(
        page.locator('button:text("Stofna nýjan lista")'),
      ).toBeVisible()

      await page.waitForSelector('button:text("Virkir listar")')
      await expect(page.locator('button:text("Virkir listar")')).toBeVisible()

      await page.waitForSelector('button:text("Liðnir listar")')
      await expect(page.locator('button:text("Liðnir listar")')).toBeVisible()
    })
  })
})
