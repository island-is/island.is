import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { getTextboxByName } from '../../../../utils/pageHelpers'

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
      const clientId = getTextboxByName(page, 'permissionId')

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
      const dummyText = 'permission name'

      // Assert - heading is visible
      await expect(page.getByRole('heading', { name: title })).toBeVisible()

      // Assert - Icelandic input is visible and english is not
      await expect(getTextboxByName(page, 'is_displayName')).toBeVisible()
      await expect(getTextboxByName(page, 'en_displayName')).not.toBeVisible()
      await expect(getTextboxByName(page, 'is_description')).toBeVisible()
      await expect(getTextboxByName(page, 'is_description')).not.toBeVisible()

      // Assert - save button is disabled
      await buttonSaveTest(title)

      // Act - fill in input
      await getTextboxByName(page, 'is_displayName').fill(dummyText)

      // Assert - input has value
      await expect(getTextboxByName(page, 'is_displayName')).toHaveValue(
        dummyText,
      )

      // Act - switch language by clicking on tab
      await page.getByRole('tab', { name: 'English' }).click()

      // Assert - inputs visibility is switched
      await expect(getTextboxByName(page, 'is_displayName')).not.toBeVisible()
      await expect(getTextboxByName(page, 'en_displayName')).toBeVisible()
      await expect(getTextboxByName(page, 'is_description')).not.toBeVisible()
      await expect(getTextboxByName(page, 'is_description')).toBeVisible()

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
        ].map((name) => getTextboxByName(page, name))

        // Assert - Heading
        await expect(page.getByRole('heading', { name: title })).toBeVisible()

        // Assert - All inputs are not visible
        await Promise.all(
          checkboxes.map((checkbox) => expect(checkbox).toBeVisible()),
        )

        // Assert - save button is disabled
        await buttonSaveTest(title)

        // Act - Click on one checkbox
        await getTextboxByName(page, 'isAccessControlled').click()

        // Assert - save button is disabled
        await buttonSaveTest(title, false)
      },
    )
  })
})
