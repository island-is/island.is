import {
  type BrowserContext,
  createPageAndNavigate,
  expect,
  session,
  test,
  urls,
} from '@island.is/testing/e2e'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Front page', { tag: '@fast' }, () => {
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

  test('has expected sections @lang:is', async () => {
    const page = await createPageAndNavigate(context, '/')
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible()
    await expect(page.locator('data-testid=home-banner')).toBeVisible()
    await expect(page.locator('data-testid=home-heading')).toBeVisible()
    await expect(page.locator('data-testid=home-news')).toBeVisible()
  })

  test(`should have life event @lang:is`, async () => {
    test.slow()
    const page = await createPageAndNavigate(context, '/')
    const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
    await expect(lifeEventsCards.count()).resolves.toBeGreaterThan(3)
    const lifeEventHandles = await lifeEventsCards.elementHandles()
    const lifeEventUrls = await Promise.all(
      lifeEventHandles.map((item) => item.getAttribute('href')),
    )
    const lifeEventPage = await context.newPage()
    for (const url of lifeEventUrls) {
      if (url) {
        const result = await lifeEventPage.goto(url ?? '')
        await expect(
          lifeEventPage.getByRole('link', { name: 'island.is logo' }),
        ).toBeVisible()
        expect(result?.status()).toBe(200)
      }
    }
    await lifeEventPage.close()
  })

  test(`should have life event @lang:en`, async () => {
    test.slow()
    const page = await createPageAndNavigate(context, '/en')
    const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
    await expect(lifeEventsCards.count()).resolves.toBeGreaterThan(3)
    const lifeEventHandles = await lifeEventsCards.elementHandles()
    const lifeEventUrls = await Promise.all(
      lifeEventHandles.map((item) => item.getAttribute('href')),
    )
    const lifeEventPage = await context.newPage()
    for (const url of lifeEventUrls) {
      if (url) {
        const result = await lifeEventPage.goto(url ?? '')
        await expect(
          lifeEventPage.getByRole('link', { name: 'island.is logo' }),
        ).toBeVisible()
        expect(result?.status()).toBe(200)
      }
    }
    await lifeEventPage.close()
  })

  test(`should navigate to featured link @lang:is`, async () => {
    test.slow()
    const page = await createPageAndNavigate(context, '/')
    const featuredLinks = page.locator('[data-testid="featured-link"]')
    await expect(featuredLinks.count()).resolves.toBeGreaterThan(3)
    const featuredLinksHandles = await featuredLinks.elementHandles()
    const featuresLinksUrls = await Promise.all(
      featuredLinksHandles.map((item) => item.getAttribute('href')),
    )
    const featuredPage = await context.newPage()
    for (const url of featuresLinksUrls) {
      if (url) {
        const result = await featuredPage.goto(url)
        await expect(
          featuredPage.getByRole('link', { name: 'island.is logo' }),
        ).toBeVisible()
        if (result) {
          expect(result.status()).toBe(200)
        }
      }
    }
    await featuredPage.close()
  })

  test(`should navigate to featured link @lang:en`, async () => {
    test.slow()
    const page = await createPageAndNavigate(context, '/en')
    const featuredLinks = page.locator('[data-testid="featured-link"]')
    await expect(featuredLinks.count()).resolves.toBeGreaterThan(3)
    const featuredLinksHandles = await featuredLinks.elementHandles()
    const featuresLinksUrls = await Promise.all(
      featuredLinksHandles.map((item) => item.getAttribute('href')),
    )
    const featuredPage = await context.newPage()
    for (const url of featuresLinksUrls) {
      if (url) {
        const result = await featuredPage.goto(url)
        await expect(
          featuredPage.getByRole('link', { name: 'island.is logo' }),
        ).toBeVisible()
        if (result) {
          expect(result.status()).toBe(200)
        }
      }
    }
    await featuredPage.close()
  })

  test(`should have link on life events pages to navigate back to the main page @lang:is`, async () => {
    test.slow()
    const page = await createPageAndNavigate(context, '/')
    const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
    const lifeEventHandles = await lifeEventsCards.elementHandles()
    const lifeEventUrls = await Promise.all(
      lifeEventHandles.map((item) => item.getAttribute('href')),
    )
    const lifeEventPage = await context.newPage()
    for (const url of lifeEventUrls) {
      if (url) {
        await lifeEventPage.goto(url)
        await lifeEventPage.locator('[data-testid="link-back-home"]').click()
        await expect(
          lifeEventPage.locator('data-testid=home-heading'),
        ).toBeVisible()
        await expect(lifeEventPage).toHaveURL('/')
      }
    }
    await lifeEventPage.close()
  })

  test(`should have link on life events pages to navigate back to the main page @lang:en`, async () => {
    test.slow()
    const page = await createPageAndNavigate(context, '/en')
    const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
    const lifeEventHandles = await lifeEventsCards.elementHandles()
    const lifeEventUrls = await Promise.all(
      lifeEventHandles.map((item) => item.getAttribute('href')),
    )
    const lifeEventPage = await context.newPage()
    for (const url of lifeEventUrls) {
      if (url) {
        await lifeEventPage.goto(url)
        await lifeEventPage.locator('[data-testid="link-back-home"]').click()
        await lifeEventPage.locator('[data-testid="link-back-home"]').click()
        await expect(
          lifeEventPage.locator('data-testid=home-heading'),
        ).toBeVisible()
        await expect(lifeEventPage).toHaveURL('/en')
      }
    }
    await lifeEventPage.close()
  })

  test('should change welcome message on language toggle @lang:is', async () => {
    const page = await createPageAndNavigate(context, '/')
    const homeHeading = page.locator('h1[data-testid="home-heading"]')
    const icelandicHeading = await homeHeading.textContent()
    await page.locator('button[data-testid="language-toggler"]:visible').click()
    if (icelandicHeading) {
      await expect(homeHeading).not.toHaveText(icelandicHeading)
    }
    await expect(page).toHaveURL('/en')
  })

  test('should toggle mega-menu @lang:is', async () => {
    const page = await createPageAndNavigate(context, '/')
    await page
      .locator('[data-testid="frontpage-burger-button"]:nth-child(2)')
      .click()
    await expect(
      page.locator('[data-testid="mega-menu-link"] > a').count(),
    ).resolves.toBeGreaterThan(18)
  })

  test('burger menu should open and close', async () => {
    const page = await createPageAndNavigate(context, '/')
    await page.getByRole('button', { name: 'Valmynd' }).click()

    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    await expect(page.getByText('Þjónustuflokkar')).toBeVisible()
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
