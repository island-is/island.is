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

  test('Can view status data', async () => {
    const page = await context.newPage()

    await test.step('Filter by searchbox', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/stada')

      // Assert
      await expect(
        page.locator('role=button[name="Sundurliðun"]').first(),
      ).toBeVisible()
    })
  })
})

test.describe.skip('Fjármál', () => {
  for (const { testCase, home } of [
    { testCase: 'Fjármál Hreyfingar - Prófa leit', home: '/en' },
    {
      testCase: 'Fjármál Greiðslukvittanir - prófa leit og sjá pdf',
      home: '/',
    },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
