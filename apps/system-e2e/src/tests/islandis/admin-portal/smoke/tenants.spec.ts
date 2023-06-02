import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/stjornbord/innskraningarkerfi`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal tenants', () => {
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

  test('can manage tenants', async () => {
    // Arrange
    const granterPage = await contextGranter.newPage()
    // Act
    await granterPage.goto(homeUrl)

    await test.step('See tenants overview', async () => {
      // Assert
      await granterPage
        .getByRole('heading', { name: 'Innskráningarkerfi' })
        .waitFor()
      await expect(
        granterPage.getByRole('heading', { name: 'Innskráningarkerfi' }),
      ).toBeVisible()
    })

    await test.step('Filter tenants list by name or id', async () => {
      // Arrange
      await granterPage
        .getByPlaceholder('Search')
        // filter by id
        .fill('@island.is')

      // Assert
      await expect(
        granterPage.getByRole('link', {
          name: 'Mínar síður Ísland.is @island.is',
        }),
      ).toBeVisible()

      await expect(granterPage.getByTestId('tenant-list-item')).toBeVisible()
      await expect(granterPage.getByTestId('tenant-list-item')).toHaveCount(1)
    })

    //
    await test.step('To link to tenant applications page', async () => {
      // Arrange
      await granterPage
        .getByPlaceholder('Search')
        // filter by id
        .fill('@island.is')

      // Act
      await granterPage.getByTestId('tenant-list-item').click()

      // Assert
      await expect(granterPage).toHaveURL(
        `${homeUrl}/${encodeURIComponent('@island.is')}/forrit`,
      )
    })
  })
})
