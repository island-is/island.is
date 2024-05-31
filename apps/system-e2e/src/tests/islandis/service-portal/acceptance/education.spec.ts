import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'
import { setupXroadMocks } from './setup-xroad.mocks'
const homeUrl = `${urls.islandisBaseUrl}/minarsidur`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Education', () => {
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-othekkt.json',
      homeUrl,
      phoneNumber: '0104359',
      idsLoginOn: true,
    })
    await setupXroadMocks()
  })
  test('education overview', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/menntun/grunnskoli/namsmat'),
      )

      const title = page.getByRole('heading', {
        name: 'Námsmat',
      })
      await expect(title).toBeVisible()
    })
  })
})
