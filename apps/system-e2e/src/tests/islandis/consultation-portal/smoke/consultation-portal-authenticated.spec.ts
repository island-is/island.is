import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Consultation portal authenticated', () => {
  let context: BrowserContext
  const URL = '/samradsgatt'
  const authLink = new RegExp(`^${urls.authUrl}`)

  const checkIfLoggedOutOrLoggedIn = async (page: Page) => {
    await page.goto(icelandicAndNoPopupUrl(URL))
    await page.getByTestId('menu-login-btn').click()
    const loggedOut = page.getByTestId('menu-login-btn')
    const loggedIn = page.getByRole('button', { name: 'Gervimaður Afríka' })

    if (await loggedOut.isVisible()) {
      await loggedOut.click()
      await page.waitForURL(authLink)
      await page.locator('#phoneUserIdentifier').fill('0103019')
      await page.locator('#submitPhoneNumber').isEnabled()
      await page.locator('#submitPhoneNumber').click()
      await page.waitForURL(`**${icelandicAndNoPopupUrl(URL)}`)
    } else {
      await loggedIn.isVisible()
    }
  }

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-auth.json',
      idsLoginOn: false,
      homeUrl: URL,
      phoneNumber: '0103019',
    })
    const page = await context.newPage()
    await checkIfLoggedOutOrLoggedIn(page)
    await page.waitForURL(icelandicAndNoPopupUrl(URL))
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('logged in user should be show up instead of login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await expect(
      page.getByRole('button', { name: 'Gervimaður Afríka' }),
    ).toBeVisible()
    await expect(page.getByTestId('menu-login-btn')).toHaveCount(0)

    await page.close()
  })

  test('subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('action-card')).toBeVisible()
    await expect(page.getByTestId('tab-content')).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Skrá mig inn',
      }),
    ).toHaveCount(0)
    await page.close()
  })

  test('my subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.goto(`${URL}/minaraskriftir`)
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('action-card')).toHaveCount(0)
    await expect(page.getByTestId('tab-content')).toBeVisible()

    await page.close()
  })

  test('advices page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.goto(`${URL}/umsagnir`)
    await expect(page.getByTestId('actionCard')).toHaveCount(0)

    await page.close()
  })

  test('logout button should logout', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByRole('button', { name: 'Gervimaður Afríka' }).click()
    await page.getByRole('button', { name: 'Útskrá' }).click()
    await page.waitForURL('https://island.is')

    await page.close()
  })
})
