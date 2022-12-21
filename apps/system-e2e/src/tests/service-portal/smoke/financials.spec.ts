import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Fjármál overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-finance.json',
      homeUrl,
      phoneNumber: '0105069',
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
      await inputField.type('21.09.2022', { delay: 100 })

      // Assert
      await expect(page.locator('role=table')).toContainText('21.09.2022')
      await expect(page.locator('role=table')).not.toContainText('15.12.2022')
    })
  })
})

test.describe.skip('Fjármál', () => {
  for (const { testCase, home } of [
    {
      testCase: 'Fjármál Greiðslukvittanir - sjá pdf',
      home: '/',
    },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
