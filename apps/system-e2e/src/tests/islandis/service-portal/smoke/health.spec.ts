import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { messages } from '@island.is/service-portal/assets/messages'
import { m } from '@island.is/service-portal/core/messages'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Health', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('dentists', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/heilsa/yfirlit'))

      const title = page.getByRole('heading', {
        name: 'Gervimaður Færeyjar',
      })
      await expect(title).toBeVisible()
    })

    await test.step('should display detail', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/eignir/vinnuvelar'))

      // Act
      const actionCardButton = page.getByTestId('action-card-cta').first()
      await actionCardButton.click()

      const basicInfoText = page
        .getByText(label(messages.baseInfoWorkMachineTitle))
        .first()
    })
  })
})
