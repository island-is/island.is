import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Licenses', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-licenses.json',
      homeUrl,
      phoneNumber: '0105069',
      idsLoginOn: true,
    })
  })

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-licenses.json',
      homeUrl,
      phoneNumber: '0105069',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('License overview', async () => {
    const page = await context.newPage()

    await test.step('Renders the page', async () => {
      // Arrange
      await page.goto('/minarsidur/skirteini')

      // Assert
      const headline = page.locator('h1')
      await expect(headline).toContainText('Skírteinin þín')
    })
  })
})

test.describe.skip('Skírteini', () => {
  for (const { testCase } of [
    { testCase: 'Skírteini fá upp QR kóða ADR' },
    { testCase: 'Skírteini fá upp QR kóða skotvopnaleyfi' },
    { testCase: 'Skírteini fá upp QR kóða vinnuvéla' },
    { testCase: 'Skírteini fá upp QR kóða ökuskírteinis' },
    { testCase: 'Skírteini sjá ADR detail' },
    { testCase: 'Skírteini sjá ADR skírteini' },
    { testCase: 'Skírteini sjá Skotvopna detail + byssueign' },
    { testCase: 'Skírteini sjá Skotvopna skírteini' },
    { testCase: 'Skírteini sjá Vegabréf barna detail' },
    { testCase: 'Skírteini sjá Vegabréf barna' },
    { testCase: 'Skírteini sjá Vegabréf mitt detail' },
    { testCase: 'Skírteini sjá Vegabréf' },
    { testCase: 'Skírteini sjá Vinnuvéla detail' },
    { testCase: 'Skírteini sjá Vinnuvéla skírteini' },
    { testCase: 'Skírteini sjá Ökuskírteini detail' },
    { testCase: 'Skírteini sjá Ökuskírteini' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
