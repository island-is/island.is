import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session } from '@island.is/testing/e2e'

const permissionId = '@admin.island.is/delegations'
const homeUrl = `${
  urls.islandisBaseUrl
}/stjornbord/innskraningarkerfi/${encodeURIComponent(
  '@admin.island.is',
)}/rettindi/${encodeURIComponent(permissionId)}`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal permission', () => {
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

  test('can manage permission', async () => {
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
    await test.step('See header', async () => {
      await expect(
        page.getByRole('heading', { name: 'Aðgangsstýring' }),
      ).toBeVisible()
      await expect(
        page.getByTestId('select-env').getByText('Development'),
      ).toBeVisible()
    })

    /**
     * Basic info
     */
    await test.step('See basic information card', async () => {
      // Arrange
      const title = 'Basic information'
      const clientId = page.getByRole('textbox', { name: 'permissionId' })

      // Assert - Heading
      await expect(page.getByRole('heading', { name: title })).toBeVisible()

      // Assert - Default inputs are visible
      await expect(clientId).toBeVisible()
      await expect(clientId).toHaveValue(permissionId)
    })

    /**
     * Content card
     */
    await test.step('See content card and interact with it', async () => {
      // Arrange
      const title = 'Content'
      const isDisplayNameInput = page.getByRole('textbox', {
        name: 'is_displayName',
      })
      const enDisplayNameInput = page.getByRole('textbox', {
        name: 'en_displayName',
      })
      const isDescriptionInput = page.getByRole('textbox', {
        name: 'is_description',
      })
      const enDescriptionInput = page.getByRole('textbox', {
        name: 'en_description',
      })
      const dummyText = 'permission name'

      // Assert - heading is visible
      await expect(page.getByRole('heading', { name: title })).toBeVisible()

      // Assert - Icelandic input is visible and english is not
      await expect(isDisplayNameInput).toBeVisible()
      await expect(enDisplayNameInput).not.toBeVisible()
      await expect(isDescriptionInput).toBeVisible()
      await expect(enDescriptionInput).not.toBeVisible()

      // Assert - save button is disabled
      await buttonSaveTest(title)

      // Act - fill in input
      await isDisplayNameInput.fill(dummyText)

      // Assert - input has value
      await expect(isDisplayNameInput).toHaveValue(dummyText)

      // Act - switch language by clicking on tab
      await page.getByRole('tab', { name: 'English' }).click()

      // Assert - inputs visibility is switched
      await expect(isDisplayNameInput).not.toBeVisible()
      await expect(enDisplayNameInput).toBeVisible()
      await expect(isDescriptionInput).not.toBeVisible()
      await expect(enDescriptionInput).toBeVisible()

      // Assert - save button is enabled
      await buttonSaveTest(title, false)
    })

    /**
     * Delegations card
     */
    await test.step(
      'See access control card and interact with it',
      async () => {
        // Arrange
        const title = 'Access control'
        const checkboxes = [
          'isAccessControlled',
          'grantToAuthenticatedUser',
          'grantToProcuringHolders',
          'grantToLegalGuardians',
          'allowExplicitDelegationGrant',
          'grantToPersonalRepresentatives',
        ].map((name) => page.getByRole('checkbox', { name }))

        // Assert - Heading
        await expect(page.getByRole('heading', { name: title })).toBeVisible()

        // Assert - All inputs are not visible
        await Promise.all(
          checkboxes.map((checkbox) => expect(checkbox).toBeVisible()),
        )

        // Assert - save button is disabled
        await buttonSaveTest(title)

        // Act - Click on one checkbox
        await page.getByRole('checkbox', { name: 'isAccessControlled' }).click()

        // Assert - save button is disabled
        await buttonSaveTest(title, false)
      },
    )
  })
})
