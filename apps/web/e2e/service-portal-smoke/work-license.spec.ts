import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from 'testing/e2e/urls'
import { session } from 'testing/e2e/session'
import { label } from 'testing/e2e/i18n'
import { m } from '@island.is/portals/my-pages/core/messages'
import { disableI18n } from 'testing/e2e/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Work licenses', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-finnland.json',
      homeUrl,
      phoneNumber: '0102209',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Work license overview has a work-license', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Renders the page', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/starfsleyfi'))
      await page.waitForLoadState('networkidle')

      // Act
      const headline = page.getByRole('heading', {
        name: label(m.educationLicense),
      })
      const licenseRenewLink = page
        .locator(`[data-testid="action-card-cta"]`)
        .getByRole('button')
        .first()

      // "Leyfisbréf - Kennari" comes from the api - not translateable
      const licenseName = page.getByText('Kennari').first()

      // Assert
      await expect(headline).toBeVisible()
      await expect(licenseRenewLink).toBeVisible()
      await expect(licenseName).toBeVisible()
    })
  })
})
