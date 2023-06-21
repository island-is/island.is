import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  HERO as hero,
  LOGGED_IN_NAV as nav,
  FILTERS as filters,
  FOOTER as footer,
  LOGGED_IN_STATES as lis,
  PagesInterface,
  LOGIN as login,
  URL,
  URL_LOCALE,
} from './consts'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Consultation portal authenticated', () => {
  let context: BrowserContext
  const authLink = new RegExp(`^${urls.authUrl}`)
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-auth.json',
      idsLoginOn: false,
      homeUrl: URL,
      phoneNumber: login.phoneNumber,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('front page should have expected static content', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    const loggedOut = page.getByRole('button', {
      name: login.buttons.loggedOut,
    })
    const loggedIn = page.getByRole('button', { name: login.buttons.loggedIn })

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

    for (const { label } of nav) {
      await expect(page.getByRole('button', { name: label })).toBeVisible()
    }
    await expect(page.getByText(hero.text)).toBeVisible()
    for (const { label } of hero.links) {
      await expect(page.getByRole('link', { name: label })).toBeVisible()
    }
    for (const text of filters) {
      await expect(page.getByText(text)).toBeVisible()
    }
    await expect(page.getByText(footer.text)).toBeVisible()
    await expect(
      page.getByRole('link', { name: footer.link.label }),
    ).toBeVisible()
  })

  for (const item in lis) {
    const instance = lis[item as keyof PagesInterface]
    test(`${item} should show logged in state`, async () => {
      if (item.toLowerCase() == 'subscriptions') test.skip()
      const page = await context.newPage()
      await page.goto(icelandicAndNoPopupUrl(`${URL}${instance.href}`))
      for (const { text } of instance.breadcrumbs) {
        expect(page.locator('nav', { has: page.getByText(text) }))
      }
      expect(page.locator(`text=${instance.title}`)).toBeTruthy()
      await expect(page.getByText(instance.text)).toBeVisible()
      if (instance.tabs) {
        for (const { text } of instance.tabs) {
          expect(page.locator(`text=${text}`)).toBeTruthy()
        }
      }
    })
  }
})
