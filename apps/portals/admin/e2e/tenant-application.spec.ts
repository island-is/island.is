import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session } from '@island.is/testing/e2e'

const applicationId = '@island.is/web'
const homeUrl = `${
  urls.islandisBaseUrl
}/stjornbord/innskraningarkerfi/${encodeURIComponent(
  '@island.is',
)}/forrit/${encodeURIComponent(applicationId)}`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal application', () => {
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

  test('can manage application', async () => {
    // Arrange
    const page = await contextGranter.newPage()
    // Act
    await page.goto(homeUrl)

    const buttonSaveTest = async (title: string, disabled = true) => {
      const dataTestId = `button-save-${title}`

      if (disabled) {
        await expect(page.getByTestId(dataTestId)).toBeDisabled()
      } else {
        await expect(page.getByTestId(dataTestId)).not.toBeDisabled()
      }
    }

    /**
     * Header
     */
    await test.step('See application header', async () => {
      await expect(
        page.getByRole('heading', { name: 'Mínar síður Ísland.is' }),
      ).toBeVisible()
      await expect(
        page.getByTestId('select-env').getByText('Development'),
      ).toBeVisible()
      await expect(page.getByText('Single page application')).toBeVisible()
    })

    /**
     * Basic info
     */
    await test.step(
      'See basic information card and interact with it',
      async () => {
        // Arrange
        const title = 'Basic information'
        const [clientId, issuerUrl, ...names] = [
          'clientId',
          'issuerUrl',
          'openIdConfigurationUrl',
          'authorizationUrl',
          'tokenUrl',
          'userInfoUrl',
          'endSessionUrl',
          'jsonWebSetKeyUrl',
        ].map((name) => page.getByRole('textbox', { name }))

        // Assert - Heading
        await expect(page.getByRole('heading', { name: title })).toBeVisible()

        // Assert - Default inputs are visible
        await expect(clientId).toBeVisible()
        await expect(issuerUrl).toBeVisible()

        // Assert - Accordion inputs are not visible
        await Promise.all(names.map((name) => expect(name).not.toBeVisible()))

        // Act - click on accordion
        await page.getByRole('button', { name: 'Other endpoints' }).click()

        // Assert - Accordion inputs are now visible
        await Promise.all(names.map((name) => expect(name).toBeVisible()))
      },
    )

    /**
     * Content card
     */
    await test.step('See content card and interact with it', async () => {
      // Arrange
      const isDisplayNameInput = page.getByRole('textbox', {
        name: 'is_displayName',
      })
      const enDisplayNameInput = page.getByRole('textbox', {
        name: 'en_displayName',
      })
      const title = 'Content'
      const dummyText = 'Ísland.is'

      // Assert - heading is visible
      await expect(page.getByRole('heading', { name: title })).toBeVisible()

      // Assert - Icelandic input is visible and english is not
      await expect(isDisplayNameInput).toBeVisible()
      await expect(enDisplayNameInput).not.toBeVisible()

      // Assert - save button is disabled
      await buttonSaveTest(title)

      // Act - fill in input
      await isDisplayNameInput.fill(dummyText)

      // Assert - input has value
      await expect(isDisplayNameInput).toHaveValue(dummyText)

      // Act - switch language by clicking on tab
      await page.getByRole('tab', { name: 'English' }).click()

      // Assert - inputs visibility are switched
      await expect(isDisplayNameInput).not.toBeVisible()
      await expect(enDisplayNameInput).toBeVisible()

      // Assert - save button is enabled
      await buttonSaveTest(title, false)
    })

    /**
     * Applications URLs card
     */
    await test.step(
      'See application URLs card and interact with it',
      async () => {
        // Arrange
        const redirectUris = page.getByRole('textbox', { name: 'redirectUris' })
        const postLogoutRedirectUris = page.getByRole('textbox', {
          name: 'postLogoutRedirectUris',
        })
        const dummyText = 'This is a dummy text'
        const title = 'Application URLs'

        // Assert - heading is visible
        await expect(page.getByRole('heading', { name: title })).toBeVisible()

        // Assert - inputs are visible
        await expect(redirectUris).toBeVisible()
        await expect(postLogoutRedirectUris).toBeVisible()

        // Assert - save button is disabled
        await buttonSaveTest(title)

        // Act - Type dummy text value into inputs
        await redirectUris.clear()
        await postLogoutRedirectUris.clear()
        await redirectUris.fill(dummyText)
        await postLogoutRedirectUris.fill(dummyText)

        // Assert - inputs have dummy text value
        await expect(redirectUris).toHaveValue(dummyText)
        await expect(postLogoutRedirectUris).toHaveValue(dummyText)

        // Assert - save button is enabled
        await buttonSaveTest(title, false)
      },
    )

    /**
     * Refresh token lifecycle card
     */
    await test.step(
      'See refresh token lifecycle card and interact with it',
      async () => {
        // Arrange
        const absoluteRefreshTokenLifetime = page.getByRole('textbox', {
          name: 'absoluteRefreshTokenLifetime',
        })
        const refreshTokenExpiration = page.getByRole('textbox', {
          name: 'refreshTokenExpiration',
        })
        const slidingRefreshTokenLifetime = page.getByRole('textbox', {
          name: 'slidingRefreshTokenLifetime',
        })
        const title = 'Refresh token lifecycle'
        const dummyNumber = '3200099'

        // Assert - heading is visible
        await expect(page.getByRole('heading', { name: title })).toBeVisible()

        // Assert - save button is disabled
        await buttonSaveTest(title)

        // Assert - inputs are visible
        await expect(absoluteRefreshTokenLifetime).toBeVisible()
        await expect(refreshTokenExpiration).toBeVisible()
        await expect(slidingRefreshTokenLifetime).toBeVisible()

        // Act - Insert number into input
        await absoluteRefreshTokenLifetime.clear()
        await absoluteRefreshTokenLifetime.fill(dummyNumber)
        await slidingRefreshTokenLifetime.clear()
        await slidingRefreshTokenLifetime.fill(dummyNumber)

        // Assert - check if absoluteRefreshTokenLifetime and slidingRefreshTokenLifetime has dummy text value
        await expect(absoluteRefreshTokenLifetime).toHaveValue(dummyNumber)
        await expect(slidingRefreshTokenLifetime).toHaveValue(dummyNumber)

        // Act - Click on checkbox to make slidingRefreshTokenLifetime visible
        await page
          .locator('label')
          .filter({ hasText: 'Inactivity expiration' })
          .click()

        // Assert - check if slidingRefreshTokenLifetime is visible
        await expect(slidingRefreshTokenLifetime).not.toBeVisible()

        // Assert - save button is enabled
        await buttonSaveTest(title, false)
      },
    )

    /**
     * Permissions card
     */
    await test.step('See permissions card and interact with it', async () => {
      const title = 'Permissions'

      // Assert - heading is visible
      await expect(page.getByRole('heading', { name: title })).toBeVisible()

      // Assert - save button is disabled
      await buttonSaveTest(title)

      const initialPermissionCount = await page
        .getByTestId('permission-row')
        .count()

      // Assert - permission list is visible
      expect(initialPermissionCount).toBeGreaterThan(0)

      // Act - Open add permission modal
      await page.getByTestId('add-permissions-button').click()

      // Assert - modal is visible
      await expect(
        page.getByRole('heading', { name: 'Add permissions' }),
      ).toBeVisible()

      // Act - Add permission by clicking on checkbox and then pressing add button
      await page
        .locator('#add-permissions tbody tr td')
        .first()
        .locator('input')
        .click()

      await page.getByRole('button', { name: 'Add', exact: true }).click()
      // Wait for modal to close
      await page
        .getByRole('button', { name: 'Add permissions' })
        .waitFor({ state: 'hidden' })

      // Assert - Check if permission list has increased
      const currentPermissionCount = await page
        .getByTestId('permission-row')
        .count()
      expect(initialPermissionCount).toBeLessThan(currentPermissionCount)

      // Assert - save button is enabled
      await buttonSaveTest(title, false)

      // Act - Remove added permission
      await page
        .getByTestId('permission-row')
        .last()
        .getByRole('button')
        .click()

      // Assert - Check if permission list has decreased
      expect(await page.getByTestId('permission-row').count()).toBe(
        initialPermissionCount,
      )
    })

    /**
     * Delegations card
     */
    await test.step('See delegations card and interact with it', async () => {
      // Arrange
      const title = 'Delegations'
      const checkboxes = [
        'supportsProcuringHolders',
        'supportsLegalGuardians',
        'promptDelegations',
        'supportsPersonalRepresentatives',
        'supportsCustomDelegation',
        'requireApiScopes',
      ].map((name) => page.getByRole('checkbox', { name }))

      // Assert - Heading
      await expect(page.getByRole('heading', { name: title })).toBeVisible()

      // Assert - All inputs are not visible
      await Promise.all(
        checkboxes.map((checkbox) => expect(checkbox).not.toBeVisible()),
      )

      // Act - Click on accordion to make checkboxes visible
      await page.getByRole('button', { name: 'Delegations' }).click()

      // Assert - save button is disabled
      await buttonSaveTest(title)

      // Assert - All inputs are visible
      await Promise.all(
        checkboxes.map((checkbox) => expect(checkbox).toBeVisible()),
      )

      // Act - Click on one checkbox
      await page
        .getByRole('checkbox', { name: 'supportsProcuringHolders' })
        .click()

      // Assert - save button is disabled
      await buttonSaveTest(title, false)
    })

    /**
     * Advanced settings card
     */
    await test.step(
      'See advanced settings card and interact with it',
      async () => {
        // Arrange
        const title = 'Advanced settings'
        const checkboxes = [
          'requirePkce',
          'allowOfflineAccess',
          'requireConsent',
          'supportTokenExchange',
        ].map((name) => page.getByRole('checkbox', { name }))
        const accessTokenLifetime = page.getByRole('textbox', {
          name: 'accessTokenLifetime',
        })
        const customClaims = page.getByRole('textbox', { name: 'customClaims' })
        const dummyNumber = '123'

        // Assert - Heading exists and all inputs are not visible
        await expect(page.getByRole('heading', { name: title })).toBeVisible()
        await Promise.all(
          [...checkboxes, accessTokenLifetime, customClaims].map((checkbox) =>
            expect(checkbox).not.toBeVisible(),
          ),
        )

        // Act - Click on accordion to make all inputs visible
        await page.getByRole('button', { name: 'Advanced settings' }).click()

        await Promise.all(
          [...checkboxes, accessTokenLifetime, customClaims].map((checkbox) =>
            expect(checkbox).toBeVisible(),
          ),
        )

        // Assert - save button is disabled
        await buttonSaveTest(title)

        // Act - Type into input
        await accessTokenLifetime.clear()
        await accessTokenLifetime.fill(dummyNumber)

        // Assert - check if  and  has dummy text value
        await expect(accessTokenLifetime).toHaveValue(dummyNumber)

        // Assert - save button is disabled
        await buttonSaveTest(title, false)
      },
    )

    /**
     * Danger zone
     */
    await test.step(
      'See danger zone card and modal and interact with it',
      async () => {
        // Arrange
        const title = 'Danger zone'
        const modalId = 'rotate-secret-modal'
        const rotateSecretButton = page.getByRole('button', {
          name: 'Rotate',
          exact: true,
        })

        // Assert - Heading exists
        await expect(page.getByText(title)).toBeVisible()

        // Assert - check if rotate secret button is not visible
        await expect(rotateSecretButton).not.toBeVisible()

        // Act - Click accordion button to make rotate secret button visible
        await page.getByRole('button', { name: 'Danger zone' }).click()

        // Assert - check if rotate secret button is not visible
        await expect(rotateSecretButton).toBeVisible()

        // Act - Click rotate secret button
        await rotateSecretButton.click()

        // Assert - check content in modal
        await expect(page.getByTestId(modalId)).toBeVisible()
        await expect(
          page.getByRole('button', { name: 'Generate' }),
        ).toBeVisible()
        await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible()
        await expect(
          page.getByRole('checkbox', { name: 'revokeOldSecrets' }),
        ).toBeVisible()
        await expect(
          page.getByRole('heading', { name: 'Rotate secret' }),
        ).toBeVisible()

        // Act - Click cancel button
        await page.getByRole('button', { name: 'cancel' }).click()

        // Assert - check if modal is not visible
        await expect(page.getByTestId(modalId)).not.toBeVisible()
      },
    )
  })
})
