import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

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

  test('can manage tenant applications', async () => {
    // Arrange
    const granterPage = await contextGranter.newPage()
    // Act
    await granterPage.goto(homeUrl)

    await test.step('See tenant applications overview', async () => {
      // Arrange
      await granterPage.getByRole('heading', { name: 'Applications' }).waitFor()

      // Assert
      await expect(
        granterPage.getByRole('heading', { name: 'Applications' }),
      ).toBeVisible()
    })

    await test.step(
      'Filter tenant applications list by name or id',
      async () => {
        // Act
        await granterPage
          .getByPlaceholder('Search')
          // filter by id
          .fill('Mínar síður')

        // Assert
        await expect(
          granterPage.getByRole('heading', { name: 'Mínar síður Ísland.is' }),
        ).toBeVisible()
        await expect(
          granterPage.getByTestId('tenant-applications-list-item'),
        ).toBeVisible()
        await expect(
          granterPage.getByTestId('tenant-applications-list-item'),
        ).toHaveCount(1)
      },
    )

    await test.step('To link to tenant application page', async () => {
      const applicationId = '@island.is/web'
      // Act
      await granterPage
        .getByPlaceholder('Search')
        // filter by id
        .fill(applicationId)
      await granterPage.getByRole('button', { name: 'Change' }).click()

      // Assert
      await expect(granterPage).toHaveURL(
        `${homeUrl}/${encodeURIComponent(applicationId)}`,
      )
    })

    await test.step(
      'To link to tenant application page with env as query param',
      async () => {
        const applicationId = '@island.is/web'
        const env = 'Development'

        // Arrange
        await granterPage.goto(homeUrl)

        // Act
        await granterPage
          .getByPlaceholder('Search')
          // filter by id
          .fill(applicationId)
        await granterPage.getByRole('button', { name: 'Development' }).click()

        // Assert
        await expect(granterPage).toHaveURL(
          `${homeUrl}/${encodeURIComponent(applicationId)}?env=${env}`,
        )
      },
    )
  })
})
