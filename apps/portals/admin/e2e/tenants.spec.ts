import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session } from '@island.is/testing/e2e'

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
    const page = await contextGranter.newPage()
    // Act
    await page.goto(homeUrl)

    await test.step('See tenants overview', async () => {
      await expect(
        page.getByRole('heading', { name: 'Innskráningarkerfi' }),
      ).toBeVisible()
    })

    await test.step('Filter tenants list by name or id', async () => {
      // Arrange
      await page
        .getByPlaceholder('Search')
        // filter by id
        .fill('@island.is')

      // Assert
      await expect(
        page.getByRole('link', {
          name: 'Mínar síður Ísland.is @island.is',
        }),
      ).toBeVisible()

      await expect(page.getByTestId('tenant-list-item')).toBeVisible()
      await expect(page.getByTestId('tenant-list-item')).toHaveCount(1)
    })

    //
    await test.step('To link to tenant applications page', async () => {
      // Arrange
      await page
        .getByPlaceholder('Search')
        // filter by id
        .fill('@island.is')

      // Act
      await page.getByTestId('tenant-list-item').click()

      // Assert
      await expect(page).toHaveURL(
        `${homeUrl}/${encodeURIComponent('@island.is')}/forrit`,
      )
    })
  })
})
