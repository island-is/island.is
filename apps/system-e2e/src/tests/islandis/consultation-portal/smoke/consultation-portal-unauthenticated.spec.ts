import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  HERO as hero,
  NOT_LOGGED_IN_NAV as nav,
  FILTERS as filters,
  FOOTER as footer,
  LOGGED_OUT_STATES as los,
  LOGIN_BUTTONS as lb,
  PagesInterface,
  URL,
} from './consts'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Consultation portal unathenticated', () => {
  let context: BrowserContext
  const authLink = new RegExp(`^${urls.authUrl}`)
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-no-auth.json',
      idsLoginOn: false,
      homeUrl: URL,
      phoneNumber: 'not appplicable',
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('front page should have expected static content', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))
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

  for (const item in los) {
    const instance = los[item as keyof PagesInterface]
    test(`${item} should show logged out state`, async () => {
      if (item.toLowerCase() == 'subscriptions') test.skip()
      const page = await context.newPage()
      await page.goto(URL)
      await page.getByRole('button', { name: instance.label }).click()
      await page.waitForURL(`**${instance.href}`)
      for (const { text } of instance.breadcrumbs) {
        expect(page.locator('nav', { has: page.getByText(text) }))
      }
      expect(page.locator(`text=${instance.title}`)).toBeTruthy()
      await expect(page.getByText(instance.text)).toBeVisible()
      await page.waitForLoadState()
      if (instance.CTA) {
        expect(page.locator(`text=${instance.CTA.title}`)).toBeTruthy()
        await expect(page.getByText(instance.CTA.text)).toBeVisible()
        await expect(
          page.getByRole('button', { name: instance.CTA.button.label }),
        ).toBeVisible()
      }
    })
  }

  test('minaraskriftir should redirect to island.is login', async () => {
    const page = await context.newPage()
    await page.goto(`${URL}/minaraskriftir`)
    await page.waitForURL(authLink)
  })

  for (const item in lb) {
    const instance = lb[item as keyof typeof lb]
    test(`login button on ${item} should redirect to island.is login`, async () => {
      const page = await context.newPage()
      await page.goto(icelandicAndNoPopupUrl(`${URL}${instance.location}`))
      await page.getByRole('button', { name: instance.label }).click()
      await page.waitForURL(authLink)
    })
  }
})
