import { test, BrowserContext, expect } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  disableI18n,
} from '@island.is/testing/e2e'
import { setupXroadMocks } from './setup-xroad.mocks'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Social Insurance', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('payment plan', async () => {
    const page = await context.newPage()

    await disableI18n(page)
    await setupXroadMocks()

    await test.step('should display data when switching years', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('minarsidur/framfaersla/greidsluaetlun'),
      )

      const title = page.getByRole('heading', {
        name: 'Greiðsluáætlun',
      })
      await expect(title).toBeVisible()

      await expect(
        page.getByText('Skattskyldar greiðslutegundir'),
      ).toBeVisible()
    })
  })
})
