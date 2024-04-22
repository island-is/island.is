import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Search feature', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'homepage.json',
      homeUrl: `${urls.islandisBaseUrl}/`,
      phoneNumber: '0103019',
      idsLoginOn: false,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('has expected sections', async () => {
    const testPhrase = 'umsókn'
    const page = await context.newPage()
    await page.goto('/')
    await page
      .getByRole('textbox', { name: 'Leitaðu á Ísland.is' })
      .type(testPhrase, { delay: 100 })
    await page.keyboard.press('Enter')
    const testResults = page.locator('[data-testid="search-result"]')
    await expect(testResults).toHaveCountGreaterThan(9)
    const searchUrl = page.url()
    await testResults.nth(0).click()
    await page.waitForLoadState('networkidle')
    await expect(page).not.toHaveURL(searchUrl)
  })

  test('should have no search results for long bogus search words', async () => {
    const page = await context.newPage()
    await page.goto('/')
    await page.type(
      'role=textbox[name="Leitaðu á Ísland.is"]',
      'abcdefhijklmnopqrstuvwxyz1234567890',
    )
    await page.keyboard.press('Enter')
    await page.waitForLoadState('networkidle')
    const testResults = page.locator('[data-testid="search-result"]')
    await expect(testResults).toHaveCount(0)
  })

  test.skip('should search in Enlish', async () => {
    return
  })
})
