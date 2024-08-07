import { expect, test } from '@island.is/testing/e2e'

test.describe('Front page', () => {
  test('has expected sections @lang:is', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible()
    await expect(page.locator('data-testid=home-banner')).toBeVisible()
    await expect(page.locator('data-testid=home-heading')).toBeVisible()
    await expect(page.locator('data-testid=home-news')).toBeVisible()
  })
})
