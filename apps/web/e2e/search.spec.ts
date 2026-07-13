import {
  type BrowserContext,
  expect,
  session,
  test,
  urls,
} from '@island.is/testing/e2e'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Search feature', { tag: '@fast' }, () => {
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

  test('should display search results and navigate to result page', async () => {
    const testPhrase = 'umsókn'
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    await page
      .getByRole('textbox', { name: 'Leitaðu á Ísland.is' })
      .fill(testPhrase)
    await page.keyboard.press('Enter')
    const testResults = page.locator('[data-testid="search-result"]')
    await expect(testResults.count()).resolves.toBeGreaterThan(9)
    const searchUrl = page.url()
    await testResults.nth(0).click()
    await page.waitForLoadState('networkidle')
    await expect(page).not.toHaveURL(searchUrl)
  })

  test('should have no search results for long bogus search words', async () => {
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    await page
      .getByRole('textbox', { name: 'Leitaðu á Ísland.is' })
      .fill('abcdefhijklmnopqrstuvwxyz1234567890')
    await page.keyboard.press('Enter')
    await page.waitForLoadState('networkidle')
    const testResults = page.locator('[data-testid="search-result"]')
    await expect(testResults).toHaveCount(0)
  })

  test.skip('should search in English', async () => {
    return
  })
})
