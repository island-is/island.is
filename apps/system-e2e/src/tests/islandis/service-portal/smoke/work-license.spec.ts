import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Licenses', () => {
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

  test('Work license overview', async () => {
    const page = await context.newPage()

    await test.step('Renders the page', async () => {
      // Arrange
      await page.goto('/minarsidur/leyfisbref')

      // Act
      const headline = page.locator('h1')

      // Assert
      await expect(headline).toContainText('Starfsleyfi')
    })

    await test.step('Has a work-license', async () => {
      // Arrange
      await page.goto('/minarsidur/leyfisbref')
      await page.waitForLoadState('networkidle')

      // Act
      const licenseRenewLink = page
        .locator('role=button[name="Senda skjal í undirritun"]')
        .first()

      const licenseName = page.getByText('Leyfisbréf - kennari').first()

      // Assert
      await expect(licenseRenewLink).toBeVisible()
      await expect(licenseName).toBeVisible()
    })
  })
})
