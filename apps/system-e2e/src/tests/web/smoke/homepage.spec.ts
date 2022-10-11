import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Front page', () => {
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
    const page = await context.newPage()
    await page.goto('/')
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible()
    await expect(page.locator('data-testid=home-banner')).toBeVisible()
    await expect(page.locator('data-testid=home-heading')).toBeVisible()
    await expect(page.locator('data-testid=home-news')).toBeVisible()
  })

  for (const home of ['/', '/en']) {
    test(`should have life events at ${home}`, async () => {
      const page = await context.newPage()
      await page.goto(home)
      const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')

      await expect(lifeEventsCards).toHaveCountGreaterThan(3)
      const lifeEventHandles = await lifeEventsCards.elementHandles()
      const lifeEventUrls = await Promise.all(
        lifeEventHandles.map((item) => item.getAttribute('href')),
      )
      await Promise.all(
        lifeEventUrls.map(async (url) => {
          const page = await context.newPage()
          const result = await page.goto(url!)
          expect(result!.status()).toBe(200)
          await page.close()
        }),
      )
    })
    test(`should navigate to featured link at ${home}`, async () => {
      const page = await context.newPage()
      await page.goto(home)
      const featuredLinks = page.locator('[data-testid="featured-link"]')
      await expect(featuredLinks).toHaveCountGreaterThan(3)
      const featuredLinksHandles = await featuredLinks.elementHandles()
      const featuresLinksUrls = await Promise.all(
        featuredLinksHandles.map((item) => item.getAttribute('href')),
      )
      await Promise.all(
        featuresLinksUrls.map(async (url) => {
          const page = await context.newPage()
          const result = await page.goto(url!, { timeout: 10000 })
          expect(result!.status()).toBe(200)
          await page.close()
        }),
      )
    })

    test(`should have link on life events pages to navigate back to the main page at ${home}`, async ({
      baseURL,
    }) => {
      const page = await context.newPage()
      await page.goto(home)
      const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
      const lifeEventHandles = await lifeEventsCards.elementHandles()
      const lifeEventUrls = await Promise.all(
        lifeEventHandles.map((item) => item.getAttribute('href')),
      )
      await Promise.all(
        lifeEventUrls.map(async (url) => {
          const page = await context.newPage()
          const result = await page.goto(url!)
          expect(result?.url()).not.toBe(home)
          await page.locator('[data-testid="link-back-home"]').click()
          await page.waitForLoadState('networkidle')
          await expect(page).toHaveURL(home)
          await page.close()
        }),
      )
    })
  }

  test('should change welcome message on language toggle', async () => {
    const page = await context.newPage()
    await page.goto('/')
    const homeHeading = page.locator('h1[data-testid="home-heading"]')
    const icelandicHeading = await homeHeading.textContent()
    await page.locator('button[data-testid="language-toggler"]:visible').click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/en')
    await expect(homeHeading).not.toHaveText(icelandicHeading!)
  })

  test('should toggle mega-menu', async () => {
    const page = await context.newPage()
    await page.goto('/')
    await page
      .locator('[data-testid="frontpage-burger-button"]:nth-child(2)')
      .click()
    await expect(
      page.locator('[data-testid="mega-menu-link"] > a'),
    ).toHaveCountGreaterThan(18)
  })
})
