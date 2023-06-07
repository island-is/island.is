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
    await test.step(
      'See tenant basic information card and interact with it',
      async () => {
        // Arrange
        const openIdConfigurationUrl = await page.locator(
          `input[name="openIdConfigurationUrl"]`,
        )
        const authorizationUrl = await page.locator(
          `input[name="authorizationUrl"]`,
        )
        const tokenUrl = await page.locator(`input[name="tokenUrl"]`)
        const userInfoUrl = await page.locator(`input[name="userInfoUrl"]`)
        const endSessionUrl = await page.locator(`input[name="endSessionUrl"]`)
        const jsonWebSetKeyUrl = await page.locator(
          `input[name="jsonWebSetKeyUrl"]`,
        )

        // Assert - Heading
        await expect(page.getByText('Basic information')).toBeVisible()

        // Assert - Default inputs are visible
        await expect(await page.locator(`input[name="clientId"]`)).toBeVisible()
        await expect(
          await page.locator(`input[name="issuerUrl"]`),
        ).toBeVisible()

        // Assert - Accordion inputs are not visible
        await expect(openIdConfigurationUrl).not.toBeVisible()
        await expect(authorizationUrl).not.toBeVisible()
        await expect(
          await page.locator(`input[name="tokenUrl"]`),
        ).not.toBeVisible()
        await expect(tokenUrl).not.toBeVisible()
        await expect(userInfoUrl).not.toBeVisible()
        await expect(endSessionUrl).not.toBeVisible()
        await expect(jsonWebSetKeyUrl).not.toBeVisible()

        // Act - click on accordion
        await page.getByRole('button', { name: 'Other endpoints' }).click()

        // Assert - Accordion inputs are now visible
        await expect(openIdConfigurationUrl).toBeVisible()
        await expect(authorizationUrl).toBeVisible()
        await expect(await page.locator(`input[name="tokenUrl"]`)).toBeVisible()
        await expect(tokenUrl).toBeVisible()
        await expect(userInfoUrl).toBeVisible()
        await expect(endSessionUrl).toBeVisible()
        await expect(jsonWebSetKeyUrl).toBeVisible()
      },
    )

    /**
     * Content card
     */
    await test.step(
      'See tenant content card and interact with it',
      async () => {
        // Arrange
        const isDisplayNameInput = 'input[name="is_displayName"]'
        const enDisplayNameInput = 'input[name="en_displayName"]'

        // Assert - Icelandic input is visible and english is not
        await expect(await page.locator(isDisplayNameInput)).toBeVisible()
        await expect(await page.locator(enDisplayNameInput)).not.toBeVisible()

        // Act - fill in input
        await page.locator(isDisplayNameInput).fill('Ísland.is')

        // Assert - input has value
        await expect(await page.locator(isDisplayNameInput)).toHaveValue(
          'Ísland.is',
        )

        // Act - switch language
        await page.getByRole('tab', { name: 'English' }).click()

        // Assert - input is not visible
        await expect(await page.locator(isDisplayNameInput)).not.toBeVisible()
        await expect(await page.locator(enDisplayNameInput)).toBeVisible()

        // Assert - heading is visible
        await expect(page.getByText('Content')).toBeVisible()
      },
    )

    /**
     * Content card
     */
    await test.step(
      'See tenant Application URLs card and interact with it',
      async () => {
        // Arrange
        const redirectUris = 'textarea[name="redirectUris"]'
        const postLogoutRedirectUris = 'textarea[name="postLogoutRedirectUris"]'
        const dummyText = 'This is a dummy text'
        const title = 'Application URLs'

        // Assert - heading is visible
        await expect(page.getByText(title)).toBeVisible()

        // Assert - inputs are visible
        await expect(await page.locator(redirectUris)).toBeVisible()
        await expect(await page.locator(postLogoutRedirectUris)).toBeVisible()

        // Assert - save button is disabled
        await expect(page.getByTestId(`button-save-${title}`)).toBeDisabled()

        // Act - Type dummy text value into inputs
        await page.locator(redirectUris).clear()
        await page.locator(postLogoutRedirectUris).clear()
        await page.locator(redirectUris).fill(dummyText)
        await page.locator(postLogoutRedirectUris).fill(dummyText)

        // Assert - inputs have dummy text value
        await expect(await page.locator(redirectUris)).toHaveValue(dummyText)
        await expect(await page.locator(postLogoutRedirectUris)).toHaveValue(
          dummyText,
        )

        // Assert - save button is enabled
        await expect(
          page.getByTestId(`button-save-${title}`),
        ).not.toBeDisabled()
      },
    )
  })

  // TODO remember publish modal
})
