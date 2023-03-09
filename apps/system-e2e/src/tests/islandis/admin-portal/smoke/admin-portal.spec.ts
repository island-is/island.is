import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: `/stjornbord`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('should see welcome title', async () => {
    const page = await context.newPage()
    const { findByTestId } = helpers(page)
    await page.goto('/stjornbord')
    await expect(findByTestId('active-module-name')).toBeVisible()
  })

  for (const { testCase } of [
    { testCase: 'Vera sendur beint á Loftbrú þegar umboðshafi' },
    { testCase: 'Eyða umboði fyrir Loftbrú admin' },
    { testCase: 'Fara inn í Aðgangsstýringu með fellivali í haus' },
    {
      testCase: 'Sjá yfirlit með Loftbrú og Aðganggstýringu þegar prókúruhafi',
    },
    { testCase: 'Veita umboð fyrir Loftbrú admin' },
  ]) {
    test.skip(testCase, () => {
      return
    })
  }
})
