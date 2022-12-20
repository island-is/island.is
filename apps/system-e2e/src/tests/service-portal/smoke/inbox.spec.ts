import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Pósthólf overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-bandarikin.json',
      homeUrl,
      phoneNumber: '0105069',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Can filter inbox items', async () => {
    const page = await context.newPage()
    const { findByTestId } = helpers(page)

    await test.step('Filter by searchbox', async () => {
      // Arrange
      await page.goto('/minarsidur/postholf')

      // Act
      const inputField = findByTestId('e-docs')
      await inputField.click()
      await inputField.type('greiðslukvittun', { delay: 100 })
      await page.keyboard.press('Enter')

      // Assert
      await expect(page.locator('text=skjöl fundust')).toBeVisible()
      await expect(page.locator('text=Hreinsa síu')).toBeVisible()
    })

    await test.step('Filter by filter-button', async () => {
      // Arrange
      await page.goto('/minarsidur/postholf')

      // Act
      await page.locator('role=button[name="Opna síu"]').first().click()
      await page.locator('role=button[name="Stofnun"]').first().click()
      await page.mouse.wheel(0, 50)
      await page.locator('role=checkbox[name="Ísland.is"]').click()

      // Assert
      await expect(page.locator('text=skjöl fundust')).toBeVisible()
      await expect(
        page
          .locator('role=button[name="Ísland.is"]')
          .locator(`[data-testid="icon-close"]`),
      ).toBeVisible()
    })
  })
})

test.describe.skip('Pósthólf', () => {
  for (const { testCase, home } of [
    { testCase: 'Pósthólf skjal opnast', home: '/en' },
    { testCase: 'Pósthólf skilar gögnum', home: '/' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
