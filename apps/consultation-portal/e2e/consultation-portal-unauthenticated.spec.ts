import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls, session } from '@island.is/testing/e2e'

test.describe('Consultation portal unathenticated', () => {
  let context: BrowserContext
  const authLink = new RegExp(`^${urls.authUrl}`)

  test.use({ baseURL: `${urls.islandisBaseUrl}/samradsgatt` })

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-no-auth.json',
      idsLoginOn: false,
      homeUrl: baseURL,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('nav links on front page should be visible', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await expect(page.getByTestId('all-cases-btn')).toBeVisible()
    await expect(page.getByTestId('subscriptions-btn')).toBeVisible()
    await expect(page.getByTestId('advices-btn')).toBeVisible()
    await expect(page.getByTestId('menu-login-btn')).toBeVisible()

    await page.close()
  })

  test('subscriptions page should show logged out state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('tab-content')).not.toBeVisible()
    await expect(page.getByTestId('action-card')).toBeVisible()
    page
      .getByRole('button', {
        name: 'Skrá mig inn',
      })
      .click()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('my subscriptions page should be empty and redirect user to login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('tab-content')).not.toBeVisible()

    page
      .getByRole('link', {
        name: 'Hægt er að afskrá sig hér',
      })
      .click()
    await page.waitForURL(`**/minaraskriftir`)
    await expect(page.getByTestId('tab-content')).not.toBeVisible()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('advices page should show logged out state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByTestId('advices-btn').click()
    await expect(page.getByTestId('action-card')).toBeVisible()
    page
      .getByRole('button', {
        name: 'Skrá mig inn',
      })
      .click()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('login button should redirect to login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    page.getByTestId('menu-login-btn').click()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('card should show up on frontpage and show case when clicked', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByTestId('front-page-card').first().click()
    await expect(page.getByTestId('short-description')).toBeVisible()

    await page.close()
  })
})
