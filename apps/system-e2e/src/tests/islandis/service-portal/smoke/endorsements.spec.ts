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

  test('should be able to access and see UI elements in minar-sidur for endorsements', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    // Navigate to the specified page
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/min-gogn/listar'))

    // Check for ui things
    await expect(page.locator('button:text("Stofna nýjan lista")')).toBeVisible()

    // await page.waitForSelector('button:text("Virkir listar")')
    await expect(page.locator('button:text("Virkir listar")')).toBeVisible()

    // await page.waitForSelector('button:text("Liðnir listar")')
    await expect(page.locator('button:text("Liðnir listar")')).toBeVisible()
  })

  test('should be able to see lists, access a list and see button to sign an endorsement list', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    // Navigate to the specified page
    await page.goto(icelandicAndNoPopupUrl('/undirskriftalistar'))

    // Find a list made by some other user
    await page.getByText('Skoða lista').last().click()


    await expect(page.locator('button:text("Setja nafn mitt á þennan lista")')).toBeVisible()


    })

})
