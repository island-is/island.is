import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session } from '@island.is/testing/e2e'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur/adgangsstyring/gagnaoflun`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal access control concents', () => {
  let contextGranter: BrowserContext

  test.beforeAll(async ({ browser }) => {
    contextGranter = await session({
      browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
    })
  })

  test.afterAll(async () => {
    await contextGranter.close()
  })

  test('can manage consents ', async () => {
    // Arrange
    const page = await contextGranter.newPage()
    await page.goto(homeUrl)
    const actionCardDataTestId = 'consent-accordion-card'

    await test.step('See consents overview and content', async () => {
      // Arrange - wait for the consent list to load
      await page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/graphql?op=GetConsentList') &&
          resp.status() === 200,
      )

      // Assert - Make sure heading and consent list content is visible
      await expect(
        page.getByRole('heading', { name: 'Gagnaöflun' }),
      ).toBeVisible()
      await expect(page.getByTestId(actionCardDataTestId).first()).toBeVisible()

      await expect(
        page.getByTestId('consent-accordion-display-name').first(),
      ).toBeVisible()
      await expect(
        page.getByTestId('consent-accordion-title').first(),
      ).toBeVisible()
    })

    await test.step('Interact with consents card', async () => {
      // Arrange
      const ariaPressedStr = 'aria-pressed'
      const consentScope = await page.getByTestId('consent-scope').count()

      // Assert - Make sure the consent scopes are more than 0
      expect(consentScope).toBeGreaterThan(0)

      // Act - Click on the first consent action card to expand it
      await page.getByTestId(actionCardDataTestId).first().click()

      const firstToggleSwitch = page
        .getByTestId('consent-scope')
        .first()
        .locator('button')

      // Assert - Make sure the consent scope has toggle switch
      await firstToggleSwitch.isVisible()

      // Arrange - Get the original aria-pressed value
      const orginalAriaPressedValue = await firstToggleSwitch.getAttribute(
        ariaPressedStr,
      )

      // Act - Click on the toggle switch
      await firstToggleSwitch.first().click()

      // Assert - Make sure the toggle switch is toggled
      expect(Boolean(firstToggleSwitch.getAttribute(ariaPressedStr))).not.toBe(
        orginalAriaPressedValue,
      )

      // Act - Click on the toggle switch again to toggle it back
      await firstToggleSwitch.first().click()

      // Arrange - Make sure the toggle switch requests finishes before closing
      await page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/graphql?op=PatchConsent') &&
          resp.status() === 200,
      )
    })
  })
})
