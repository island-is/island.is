import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  HERO as hero,
  LOGGED_IN_NAV as nav,
  FILTERS as filters,
  FOOTER as footer,
  LOGGED_IN_STATES as lis,
  PagesInterface,
} from './consts'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Consultation portal authenticated', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      idsLoginOn: {
        nextAuth: { nextAuthRoot: `${urls.islandisBaseUrl}/samradsgatt` },
      },
      homeUrl: '/samradsgatt',
      phoneNumber: '0102129',
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('front page should have expected static content', async () => {
    const page = await context.newPage()
    await page.goto('/samradsgatt')
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
      const page = await context.newPage()
      await page.goto(`/samradsgatt${instance.href}`)
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
