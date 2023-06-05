import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const applicationId = '@island.is/web'
const homeUrl = `${
  urls.islandisBaseUrl
}/stjornbord/innskraningarkerfi/${encodeURIComponent(
  '@island.is',
)}/forrit/${encodeURIComponent(applicationId)}`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal tenant application', () => {
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

  test('can manage tenant application', async () => {
    // Arrange
    const page = await contextGranter.newPage()
    // Act
    await page.goto(homeUrl)

    /**
     * Header
     */
    await test.step('See tenant application header', async () => {
      // Arrange
      const heading = 'Mínar síður Ísland.is'
      const tag = 'Single page application'
      const env = 'Development'

      // Assert
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
      await expect(page.getByTestId('select-env').getByText(env)).toBeVisible()
      await expect(page.getByText(tag)).toBeVisible()
    })

    /**
     * Basic info
     */
    await test.step('See tenant application header', async () => {
      // Arrange
      const heading = 'Mínar síður Ísland.is'
      const tag = 'Single page application'
      const env = 'Development'

      // Assert
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
      await expect(page.getByTestId('select-env').getByText(env)).toBeVisible()
      await expect(page.getByText(tag)).toBeVisible()
    })

    /**
     * Basic info interact with inputs
     */
    await test.step('Interact with basic info inputs', async () => {
      const readTextEvaluate = 'navigator.clipboard.readText()'
      // Client ID
      await page.getByRole('button', { name: 'Copy value Client ID' }).click()
      const clientId = await page.evaluate(readTextEvaluate)
      expect(clientId).toBe(applicationId)

      // Client Secret
      const clientSecretInput = await page.getByRole('button', {
        name: 'Copy value Client Secret',
      })

      if (clientSecretInput) {
        await clientSecretInput.click()
        const clientSecret = await page.evaluate(readTextEvaluate)
        expect(clientSecret).toBeDefined()
      }

      // Issuer
      await page.getByRole('button', { name: 'Copy value Issuer' }).click()
      const issuer = await page.evaluate(readTextEvaluate)
      expect(issuer).toBe('https://identity-server.dev01.devland.is')

      // Act
      await page.getByRole('button', { name: 'Other endpoints' }).click()
    })
  })
})
