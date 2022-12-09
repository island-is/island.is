import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
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

  test('can sign in as company', async () => {
    // Arrange
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto('/minarsidur')

    // Act
    await page.locator('data-testid=user-menu >> visible=true').click()
    await page.locator('role=button[name="Skipta um notanda"]').click()
    const firstCompany = page.locator('role=button[name*="Prókúra"]').first()
    await expect(firstCompany).toBeVisible()
    const companyName = await firstCompany
      .locator('.identity-card--name')
      .textContent()
    expect(companyName).toBeTruthy()
    await firstCompany.click()
    await page.waitForURL(new RegExp(homeUrl), {
      waitUntil: 'domcontentloaded',
    })

    // Assert
    await expect(findByRole('heading', companyName ?? '')).toBeVisible()
  })
})
