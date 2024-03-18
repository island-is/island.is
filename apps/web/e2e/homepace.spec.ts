import { BrowserContext, expect, test } from '@playwright/test'
import { session } from '@island.is/testing/e2e'

test.describe('Front page', () => {
  let context: BrowserContext
  // test.beforeAll(async ({ browser }) => {
  //   context = await session({
  //     browser: browser,
  //     storageState: 'homepage.json',
  //     homeUrl: '/',
  //     phoneNumber: '0103019',
  //     idsLoginOn: false,
  //   })
  // })
  test.afterAll(async () => {
    await context.close()
  })
  test('has expected sections @lang:is', async ({ page }) => {
    await page.goto('https://island.is')
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible()
    await expect(page.locator('data-testid=home-banner')).toBeVisible()
    await expect(page.locator('data-testid=home-heading')).toBeVisible()
    await expect(page.locator('data-testid=home-news')).toBeVisible()
  })
})
