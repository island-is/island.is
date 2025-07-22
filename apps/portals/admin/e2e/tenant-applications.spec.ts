import { BrowserContext, expect, test } from '@playwright/test'

import { urls, session } from '@island.is/testing/e2e'

const homeUrl = `${
  urls.islandisBaseUrl
}/stjornbord/innskraningarkerfi/${encodeURIComponent('@island.is')}/forrit`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal tenant applications', () => {
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

  test('can manage applications', async () => {
    // Arrange
    const page = await contextGranter.newPage()
    // Act
    await page.goto(homeUrl)

    await test.step('See applications overview', async () => {
      // Assert
      await expect(
        page.getByRole('heading', { name: 'Applications' }),
      ).toBeVisible()
    })

    await test.step('Filter applications list by name or id', async () => {
      // Act
      await page
        .getByPlaceholder('Search')
        // filter by id
        .fill('Mínar síður')

      // Assert
      await expect(
        page.getByRole('heading', { name: 'Mínar síður Ísland.is' }),
      ).toBeVisible()
      await expect(
        page.getByTestId('tenant-applications-list-item'),
      ).toBeVisible()
      await expect(
        page.getByTestId('tenant-applications-list-item'),
      ).toHaveCount(1)
    })

    await test.step('To link to application page', async () => {
      const applicationId = '@island.is/web'
      // Act
      await page.getByPlaceholder('Search').fill(applicationId)
      await page.getByRole('button', { name: 'Change' }).click()

      // Assert
      await expect(page).toHaveURL(
        `${homeUrl}/${encodeURIComponent(applicationId)}`,
      )
    })

    await test.step(
      'To link to application page with env as query param',
      async () => {
        const applicationId = '@island.is/web'
        const env = 'Development'

        // Arrange
        await page.goto(homeUrl)

        // Act
        await page.getByPlaceholder('Search').fill(applicationId)
        await page.getByRole('button', { name: 'Development' }).click()

        // Assert
        await expect(page).toHaveURL(
          `${homeUrl}/${encodeURIComponent(applicationId)}?env=${env}`,
        )
      },
    )
  })
})
