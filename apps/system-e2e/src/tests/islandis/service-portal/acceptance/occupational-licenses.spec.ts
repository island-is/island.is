import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'
import { setupXroadMocks } from './setup-xroad.mocks'
const homeUrl = `${urls.islandisBaseUrl}/minarsidur`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Occupational licenses', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
    await setupXroadMocks()
  })

  test('occupational licenses', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display each license type in list', async () => {
      // Arrange
      const licenses = [
        'Kennari test',
        'Bebeb - Starfsleyfi',
        'Verðbréfaréttindi',
      ]

      await page.goto(icelandicAndNoPopupUrl('minarsidur/starfsleyfi'))

      const title = page.getByRole('heading', {
        name: 'Starfsleyfi',
      })
      await expect(title).toBeVisible()

      for await (const license of licenses) {
        const element = page.getByText(license)
        await element.waitFor({ timeout: 30000 })
        await expect(element).toBeVisible()
      }
    })
    await test.step('should display each detail screen', async () => {
      // Arrange
      const licenses = [
        { title: 'Bebeb', ref: 'minarsidur/starfsleyfi/H13' },
        { title: 'Kennari test', ref: 'minarsidur/starfsleyfi/123' },
        { title: 'Verðbréfaréttindi', ref: 'minarsidur/starfsleyfi/D123' },
      ]

      for await (const license of licenses) {
        const ref = `[href*="${license.ref}"]`
        const element = page.locator(ref)
        await element.waitFor()
        await element.click()

        const title = page.getByRole('heading', {
          name: license.title,
        })
        await title.waitFor()
        await expect(title).toBeVisible()

        await page.goBack()
      }
    })
  })
})
