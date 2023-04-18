import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Fjármál overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-bretland.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0104929',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Finance status', async () => {
    const page = await context.newPage()

    await test.step('Filter returns any data', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/stada')

      // Assert
      await expect(
        page.locator('role=button[name="Sundurliðun"]').first(),
      ).toBeVisible()
    })
  })

  test('Finance transactions', async () => {
    const page = await context.newPage()

    await test.step('Data is returned', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/faerslur')

      // Assert
      await expect(
        page.locator('role=button[name="Sundurliðun"]').first(),
      ).toBeVisible()
    })

    await test.step('Data is filtered', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/faerslur')

      // Act
      const inputField = page.locator('input[name="finance-transaction-input"]')
      await inputField.click()
      await inputField.type('Sakavottorð', { delay: 100 })

      // Assert
      await expect(page.locator('role=table')).toContainText('Sakavottorð')
      await expect(page.locator('role=table')).not.toContainText('Vegabréf')
    })
  })

  test('Finance bills', async () => {
    const page = await context.newPage()

    await test.step('Data is filtered', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/greidslusedlar-og-greidslukvittanir')

      // Act
      const inputField = page.locator('input[name="finance-document-input"]')
      await inputField.click()
      await inputField.type('27.01.2023', { delay: 100 })

      // Assert
      await expect(page.locator('role=table')).toContainText('27.01.2023')
      await expect(page.locator('role=table')).not.toContainText('11.04.2023')
    })
  })

  test('Finance Launagreidendakröfur', async () => {
    const page = await context.newPage()

    await test.step('Can filter table and find a claim', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/laungreidendakrofur')

      // Act
      const filterButton = page.locator('role=button[name="Opna síu"]').first()
      await filterButton.click()

      const inputField = page.getByPlaceholder('Veldu dagsetningu').first()
      await inputField.click()
      await inputField.fill('')
      await inputField.type('15.10.2021', { delay: 200 })

      // Assert
      await expect(page.locator('role=table')).toContainText('15.10.2021')
      await expect(page.locator('role=table')).toContainText(
        'Launagreiðandakröfur',
      )
      await expect(page.locator('role=table')).not.toContainText('11.04.2023')
    })
  })
})

test.describe.skip('Fjármál', () => {
  for (const { testCase } of [
    { testCase: 'Fjármál Greiðslukvittanir - sjá pdf' },
    { testCase: 'Fjármál Útsvar sveitafélaga - birtist ???' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
