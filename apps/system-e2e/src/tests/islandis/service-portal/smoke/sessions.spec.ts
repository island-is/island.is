import { test, expect, BrowserContext } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
const sessionHistoryUrl = '/minarsidur/adgangsstyring/notkun'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal, in session history', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('can view list of sessions', async () => {
    // Arrange
    const page = await context.newPage()

    // Act
    const sessionsRows = page.locator('table > tbody > tr')
    await page.goto(sessionHistoryUrl, {
      waitUntil: 'networkidle',
    })

    // Assert
    await expect(sessionsRows).toHaveCountGreaterThan(0)
  })

  test('can filter list of session by national id', async () => {
    // Arrange
    const page = await context.newPage()
    await page.goto(sessionHistoryUrl, {
      waitUntil: 'networkidle',
    })

    // Act
    // eslint-disable-next-line local-rules/disallow-kennitalas
    await page.locator('#filterInput').fill('5005101370')
    const sessionsRows = page.locator('table > tbody > tr')

    // Assert
    await expect(sessionsRows).toHaveCountGreaterThan(0)
  })

  test('can view list of sessions as company', async () => {
    // Arrange
    const page = await context.newPage()
    await page.goto(homeUrl, {
      waitUntil: 'domcontentloaded',
    })
    await page.locator('data-testid=user-menu >> visible=true').click()
    await page.locator('role=button[name="Skipta um notanda"]').click()
    await page.locator('role=button[name*="ARTIC ehf."]').click()
    await page.waitForURL(new RegExp(homeUrl), {
      waitUntil: 'domcontentloaded',
    })

    // Act
    await page.goto(sessionHistoryUrl, {
      waitUntil: 'networkidle',
    })
    const sessionsRows = page.locator('table > tbody > tr')

    // Assert
    await expect(sessionsRows).toHaveCountGreaterThan(0)
  })
})
