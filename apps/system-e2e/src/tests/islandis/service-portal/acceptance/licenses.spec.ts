import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'
import { setupXroadMocks } from './setup-xroad.mocks'
const homeUrl = `${urls.islandisBaseUrl}/minarsidur`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Licenses', () => {
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

  test('licenses', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

      const title = page.getByRole('heading', {
        name: 'Skírteinin þín',
      })
      await expect(title).toBeVisible()
    })

    await test.step('should list each license type in list', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

      const licenses = [
        'Ökuréttindi',
        'Skotvopnaleyfi',
        'ADR réttindi',
        'Vinnuvélaréttindi',
        'Örorkuskírteini',
        'Almennt veiðikort',
        'P-kort',
        'Evrópska sjúkratryggingakortið',
        'Vegabréf',
      ]

      await page.getByText('Skotvopnaleyfi').waitFor({ timeout: 100000 })

      for (const license of licenses) {
        await expect(page.getByText(license)).toBeVisible()
      }
    })
  })
})
