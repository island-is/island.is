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
    const granterPage = await contextGranter.newPage()
    // Act
    await granterPage.goto(homeUrl)

    /**
     * Header
     */
    await test.step('See tenant application header', async () => {
      // Arrange
      const heading = 'Mínar síður Ísland.is'
      const tag = 'Single page application'
      const env = 'Development'

      // Assert
      await expect(
        granterPage.getByRole('heading', { name: heading }),
      ).toBeVisible()
      await expect(
        granterPage.getByTestId('select-env').getByText(env),
      ).toBeVisible()
      await expect(granterPage.getByText(tag)).toBeVisible()
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
      await expect(
        granterPage.getByRole('heading', { name: heading }),
      ).toBeVisible()
      await expect(
        granterPage.getByTestId('select-env').getByText(env),
      ).toBeVisible()
      await expect(granterPage.getByText(tag)).toBeVisible()
    })
  })
})
