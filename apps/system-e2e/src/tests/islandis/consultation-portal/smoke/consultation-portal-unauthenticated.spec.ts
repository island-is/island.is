import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Consultation portal unathenticated', () => {
  let context: BrowserContext
  const URL = '/samradsgatt'
  const authLink = new RegExp(`^${urls.authUrl}`)
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-no-auth.json',
      idsLoginOn: false,
      homeUrl: URL,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('nav links on front page should be visible', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await expect(page.getByTestId('all-cases-btn')).toBeVisible()
    await expect(page.getByTestId('subscriptions-btn')).toBeVisible()
    await expect(page.getByTestId('advices-btn')).toBeVisible()
    await expect(page.getByTestId('menu-login-btn')).toBeVisible()

    await page.close()
  })

  test('subscriptions page should show logged out state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('tab-content')).toHaveCount(0)
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
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('tab-content')).toHaveCount(0)

    page
      .getByRole('link', {
        name: 'Hægt er að afskrá sig hér',
      })
      .click()
    await page.waitForURL(`**/minaraskriftir`)
    await expect(page.getByTestId('tab-content')).toHaveCount(0)
    await page.waitForURL(authLink)

    await page.close()
  })

  test('advices page should show logged out state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

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
    await page.goto(icelandicAndNoPopupUrl(URL))

    page.getByTestId('menu-login-btn').click()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('card should show up on frontpage and show case when clicked', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId('front-page-card').first().click()
    await expect(page.getByTestId('short-description')).toBeVisible()

    await page.close()
  })
})
