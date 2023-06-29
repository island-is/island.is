import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  LOGGED_IN_NAV as nav,
  STATES as lis,
  LOGIN as login,
  URL,
  URL_LOCALE,
  POST_LOGOUT_URL,
} from './consts'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Consultation portal authenticated', () => {
  let context: BrowserContext
  const authLink = new RegExp(`^${urls.authUrl}`)
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState:
        'consultation-auth.json',
      idsLoginOn: false,
      homeUrl: URL,
      phoneNumber: login.phoneNumber,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  const checkIfLoggedOutOrLoggedIn = async (page: Page) => {
    const loggedOut = page.getByTestId(nav.loginBtn)
    const loggedIn = page.getByRole('button', { name: nav.loggedInUser })

    if (await loggedOut.isVisible()) {
      await loggedOut.click()
      await page.waitForURL(authLink)
      await page
        .locator(login.locators.phoneUserIdentifier)
        .fill(login.phoneNumber)
      await page.locator(login.locators.submitPhoneUser).isEnabled()
      await page.locator(login.locators.submitPhoneUser).click()
      await page.waitForURL(`**${URL_LOCALE}`)
    } else {
      await loggedIn.isVisible()
    }
  }

  test('nav links should be visible', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))
    await checkIfLoggedOutOrLoggedIn(page)

    await expect(page.getByTestId(nav.allCases)).toBeVisible()
    await expect(page.getByTestId(nav.subscriptions)).toBeVisible()
    await expect(page.getByTestId(nav.advices)).toBeVisible()
    await expect(page.getByText(nav.loggedInUser)).toBeVisible()

    await page.close()
  })

  test('subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))
    await checkIfLoggedOutOrLoggedIn(page)

    await page.getByTestId(nav.subscriptions).click()
    await expect(page.getByTestId('subscriptions_title')).toBeVisible()
    await expect(page.getByTestId('subscriptions_text')).toBeVisible()
    await expect(page.getByRole('tab')).toHaveCount(3)
    await page.waitForLoadState()
    await expect(page.getByTestId('actionCard')).toBeVisible()
    await expect(page.getByText(lis.subscriptions.CTA.title)).toHaveCount(0)
    await expect(page.getByText(lis.subscriptions.CTA.text)).toHaveCount(0)

    await page.close()
  })

  test('my subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))
    await checkIfLoggedOutOrLoggedIn(page)

    await page.goto(`${URL}${lis.subscriptions.unsubscribeLink.href}`)
    await expect(page.getByTestId('subscriptions_title')).toBeVisible()
    await expect(page.getByTestId('subscriptions_text')).toBeVisible()
    await expect(page.getByRole('tab')).toHaveCount(3)
    await expect(page.getByTestId('actionCard')).toHaveCount(0)

    await page.close()
  })

  test('advices page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))
    await checkIfLoggedOutOrLoggedIn(page)

    await page.getByTestId(nav.advices).click()
    expect(page.getByText(lis.advices.intro.title)).toBeTruthy()
    await expect(page.getByText(lis.advices.intro.text)).toBeVisible()
    await expect(page.getByTestId('actionCard')).toHaveCount(0)
    await expect(page.getByText(lis.advices.CTA.text)).toHaveCount(0)

    await page.close()
  })

  test('logout button should logout', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))
    await checkIfLoggedOutOrLoggedIn(page)

    const loggedIn = page.getByRole('button', { name: nav.loggedInUser })
    await expect(loggedIn).toBeVisible()
    loggedIn.click()
    const logOut = page.getByRole('button', { name: login.logOutBtn })
    await expect(logOut).toBeVisible()
    logOut.click()
    await page.waitForURL(POST_LOGOUT_URL)

    await page.close()
  })
})
