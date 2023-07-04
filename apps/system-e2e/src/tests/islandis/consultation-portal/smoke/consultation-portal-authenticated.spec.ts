import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

test.describe('Consultation portal authenticated', () => {
  let context: BrowserContext
  const authLink = new RegExp(`^${urls.authUrl}`)

  test.use({ baseURL: `${urls.islandisBaseUrl}/samradsgatt` })

  const checkIfLoggedOutOrLoggedIn = async (page: Page) => {
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))
    const loggedOut = page.getByTestId('menu-login-btn')
    const loggedIn = page.getByRole('button', { name: 'Gervimaður Afríka' })
    if (await loggedOut.isVisible()) {
      await loggedOut.click()
      await page.waitForURL(authLink)
      await page.locator('#phoneUserIdentifier').fill('0103019')
      await page.locator('#submitPhoneNumber').isEnabled()
      await page.locator('#submitPhoneNumber').click()
      await page.waitForURL(`**${icelandicAndNoPopupUrl('/samradsgatt')}`)
    } else {
      await loggedIn.isVisible()
    }
  }

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-auth.json',
      idsLoginOn: false,
      phoneNumber: '0103019',
      homeUrl: baseURL,
    })
    const page = await context.newPage()
    await checkIfLoggedOutOrLoggedIn(page)
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('logged in user should be shown instead of login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await expect(
      page.getByRole('button', { name: 'Gervimaður Afríka' }),
    ).toBeVisible()
    await expect(page.getByTestId('menu-login-btn')).not.toBeVisible()

    await page.close()
  })

  test('subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('action-card')).toBeVisible()
    await expect(page.getByTestId('tab-content')).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Skrá mig inn',
      }),
    ).not.toBeVisible()

    await page.close()
  })

  test('my subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt/minaraskriftir'))
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('action-card')).not.toBeVisible()
    await expect(page.getByTestId('tab-content')).toBeVisible()

    await page.close()
  })

  test('advices page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.goto('/umsagnir')
    await expect(page.getByTestId('actionCard')).not.toBeVisible()

    await page.close()
  })

  test('logout button should be visible', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByRole('button', { name: 'Gervimaður Afríka' }).click()
    await expect(page.getByRole('button', { name: 'Útskrá' })).toBeVisible()

    await page.close()
  })
})
