import { BrowserContext, test } from '@playwright/test'

import { expect, session, urls } from '@island.is/testing/e2e'

const nullFilter = <T>(e: T | null | undefined): e is T => Boolean(e)

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Front page', () => {
  let context: BrowserContext | undefined
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
    await context?.close()
  })
  test('has expected sections @lang:is', async () => {
    if (!context) throw new Error()
    const page = await context?.newPage()
    await page.goto('/')
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible()
    await expect(page.locator('data-testid=home-banner')).toBeVisible()
    await expect(page.locator('data-testid=home-heading')).toBeVisible()
    await expect(page.locator('data-testid=home-news')).toBeVisible()
  })

  for (const { lang, home } of [
    { lang: 'is', home: '/' },
    { lang: 'en', home: '/en' },
  ]) {
    // eslint-disable-next-line no-loop-func
    test(`should have life event @lang:${lang}`, async () => {
      test.slow()
      if (!context) throw new Error()
      const page = await context.newPage()
      await page.goto(home)
      const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')

      expect(await lifeEventsCards.count()).toBeGreaterThan(3)
      const lifeEventHandles = await lifeEventsCards.elementHandles()
      const lifeEventUrls = (
        await Promise.all(
          lifeEventHandles.map((item) => item.getAttribute('href')),
        )
      ).filter(nullFilter)

      for (const url of lifeEventUrls) {
        const page = await context.newPage()
        const result = await page.goto(url)
        await expect(
          page.getByRole('link', { name: 'island.is logo' }),
        ).toBeVisible()
        expect(result?.status()).toBe(200)
        await page.close()
      }
    })
    // eslint-disable-next-line no-loop-func
    test(`should navigate to featured link @lang:${lang}`, async () => {
      test.slow()
      if (!context) throw new Error()
      const page = await context.newPage()
      await page.goto(home)
      const featuredLinks = page.locator('[data-testid="featured-link"]')
      expect(await featuredLinks.count()).toBeGreaterThan(3)
      const featuredLinksHandles = await featuredLinks.elementHandles()
      const featuresLinksUrls = (
        await Promise.all(
          featuredLinksHandles.map((item) => item.getAttribute('href')),
        )
      ).filter(nullFilter)
      for (const url of featuresLinksUrls) {
        const page = await context.newPage()
        const result = await page.goto(url)
        await expect(
          page.getByRole('link', { name: 'island.is logo' }),
        ).toBeVisible()
        expect(result?.status()).toBe(200)
        await page.close()
      }
    })

    // eslint-disable-next-line no-loop-func
    test(`should have link on life events pages to navigate back to the main page @lang:${lang}`, async () => {
      test.slow()
      if (!context) throw new Error()
      const page = await context.newPage()
      await page.goto(home)
      const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
      const lifeEventHandles = await lifeEventsCards.elementHandles()
      const lifeEventUrls = (
        await Promise.all(
          lifeEventHandles.map((item) => item.getAttribute('href')),
        )
      ).filter(nullFilter)
      for (const url of lifeEventUrls) {
        const page = await context.newPage()
        const result = await page.goto(url)
        expect(result?.url()).not.toBe(home)
        await page.locator('[data-testid="link-back-home"]').click()
        await expect(page.locator('data-testid=home-heading')).toBeVisible()
        await expect(page).toHaveURL(home)
        await page.close()
      }
    })
  }

  test('should change welcome message on language toggle @lang:is', async () => {
    if (!context) throw new Error()
    const page = await context.newPage()
    await page.goto('/')
    const homeHeading = page.locator('h1[data-testid="home-heading"]')
    const icelandicHeading = (await homeHeading.textContent()) ?? ''
    await page.locator('button[data-testid="language-toggler"]:visible').click()
    await expect(homeHeading).not.toHaveText(icelandicHeading)
    await expect(page).toHaveURL('/en')
  })

  test('should toggle mega-menu @lang:is', async () => {
    if (!context) throw new Error()
    const page = await context.newPage()
    await page.goto('/')
    await page
      .locator('[data-testid="frontpage-burger-button"]:nth-child(2)')
      .click()
    expect(
      await page.locator('[data-testid="mega-menu-link"] > a').count(),
    ).toBeGreaterThan(18)
  })

  test('burger menu should open and close', async () => {
    if (!context) throw new Error()
    // Arrange
    const page = await context.newPage()
    page.goto('/')
    await page.getByRole('button', { name: 'Valmynd' }).click()

    // Act
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    await expect(
      page.getByRole('paragraph').filter({ hasText: 'Þjónustuflokkar' }),
    ).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    // Heading is "visible" behind menu
    // await expect(page.getByTestId('home-heading')).not.toBeVisible()
    await page
      .getByRole('dialog', { name: 'Menu' })
      .getByRole('button')
      .getByTestId('icon-close')
      .click()
    await expect(page.getByTestId('home-heading')).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Menu' })).not.toBeVisible()
  })
})
