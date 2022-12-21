import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

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
  for (const { testCase, home } of [
    { testCase: 'Skírteini fá upp QR kóða vinnuvéla', home: '/en' },
    { testCase: 'Skírteini fá upp QR kóða skotvopnaleyfi', home: '/' },
    { testCase: 'Skírteini fá upp QR kóða ADR', home: '/en' },
    { testCase: 'Skírteini fá upp QR kóða ökuskírteinis', home: '/' },
    { testCase: 'Skírteini sjá Skotvopna detail + byssueign', home: '/en' },
    { testCase: 'Skírteini sjá Vinnuvéla detail', home: '/en' },
    { testCase: 'Skírteini sjá ADR detail', home: '/' },
    { testCase: 'Skírteini sjá Vinnuvéla skírteini', home: '/en' },
    { testCase: 'Skírteini sjá Skotvopna skírteini', home: '/en' },
    { testCase: 'Skírteini sjá ADR skírteini', home: '/' },
    { testCase: 'Skírteini sjá ökuskírteini', home: '/en' },
    { testCase: 'Skírteini sjá ökuskírteini detail', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
