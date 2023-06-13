import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${
  urls.islandisBaseUrl
}/stjornbord/innskraningarkerfi/${encodeURIComponent(
  '@admin.island.is',
)}/rettindi`
test.use({ baseURL: urls.islandisBaseUrl })

const permissionId = '@admin.island.is/delegations'

test.describe('Admin portal tenant permissions', () => {
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

  test('can manage tenant permissions', async () => {
    // Arrange
    const page = await contextGranter.newPage()
    // Act
    await page.goto(homeUrl)

    await test.step('See tenant permissions overview', async () => {
      // Assert
      await expect(
        page.getByRole('heading', { name: 'Permissions' }),
      ).toBeVisible()
    })

    await test.step(
      'Filter tenant permissions list by name or id',
      async () => {
        // Act
        await page
          .getByPlaceholder('Search')
          // filter by id
          .fill(permissionId)

        // Assert
        await expect(
          page.getByRole('heading', { name: 'Aðgangsstýring' }),
        ).toBeVisible()
        await expect(
          page.getByTestId('tenant-permissions-list-item'),
        ).toBeVisible()
        await expect(
          page.getByTestId('tenant-permissions-list-item'),
        ).toHaveCount(1)
      },
    )

    await test.step('To link to tenant permission page', async () => {
      // Act
      await page.getByPlaceholder('Search').fill(permissionId)
      await page.getByRole('button', { name: 'Change' }).click()

      // Assert
      await expect(page).toHaveURL(
        `${homeUrl}/${encodeURIComponent(permissionId)}`,
      )
    })

    await test.step(
      'To link to tenant permission page with env as query param',
      async () => {
        const env = 'Development'

        // Arrange
        await page.goto(homeUrl)

        // Act
        await page.getByPlaceholder('Search').fill(permissionId)
        await page.getByRole('button', { name: 'Development' }).click()

        // Assert
        await expect(page).toHaveURL(
          `${homeUrl}/${encodeURIComponent(permissionId)}?env=${env}`,
        )
      },
    )
  })
})
