import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  HERO as hero,
  NOT_LOGGED_IN_NAV as nav,
  FILTERS as filters,
  FOOTER as footer,
  STATES as los,
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

  test('nav links on front page should be visible', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await expect(page.getByTestId(nav.allCases)).toBeVisible()
    await expect(page.getByTestId(nav.subscriptions)).toBeVisible()
    await expect(page.getByTestId(nav.advices)).toBeVisible()
    await expect(page.getByTestId(nav.loginBtn)).toBeVisible()

    await page.close()
  })

  test('hero section should have text and correct links', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await expect(page.getByTestId('heroIntro')).toBeVisible()
    await expect(
      page.getByRole('link', { name: hero.aboutLink.label }),
    ).toBeVisible()

    await page.close()
  })

  test('filters should be visible on front page', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await expect(page.getByTestId('select-policyAreas')).toBeVisible()
    await expect(page.getByTestId('select-institutions')).toBeVisible()
    for (const text of filters) {
      await expect(page.getByText(text)).toBeVisible()
    }

    await page.close()
  })

  test('footer should render expected content', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await expect(
      page.getByRole('link', { name: footer.linkLabel }),
    ).toBeVisible()

    await page.close()
  })

  test('subscriptions page should show logged out state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId(nav.subscriptions).click()
    await expect(page.getByTestId('subscriptions_title')).toBeVisible()
    await expect(page.getByTestId('subscriptions_text')).toBeVisible()
    await expect(page.getByRole('tab')).toHaveCount(0)
    await page.waitForLoadState()
    await expect(page.getByTestId('actionCard')).toBeVisible()
    await expect(page.getByText(los.subscriptions.CTA.title)).toBeVisible()
    const loginLink = page.getByRole('button', {
      name: los.subscriptions.CTA.button.label,
    })
    await expect(loginLink).toBeVisible()
    loginLink.click()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('my subscriptions page should be empty and redirect user to login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId(nav.subscriptions).click()
    await expect(page.getByRole('tab')).toHaveCount(0)
    const unsubscribeLink = page.getByText(
      los.subscriptions.unsubscribeLink.text,
    )
    await expect(unsubscribeLink).toBeVisible()
    await unsubscribeLink.click()
    await page.waitForURL(`**${los.subscriptions.unsubscribeLink.href}`)
    await page.waitForURL(authLink)

    await page.close()
  })

  test('advices page should show logged out state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    await page.getByTestId(nav.advices).click()
    await page.waitForLoadState()
    await expect(page.getByTestId('actionCard')).toBeVisible()
    expect(page.getByText(los.advices.CTA.title)).toBeTruthy()
    const loginLink = page.getByRole('button', {
      name: los.advices.CTA.button.label,
    })
    await expect(loginLink).toBeVisible()
    loginLink.click()
    await page.waitForURL(authLink)

    await page.close()
  })

  test('about page should render', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    const aboutLink = page.getByText(hero.aboutLink.label)
    expect(aboutLink).toBeVisible()
    aboutLink.click()
    await page.waitForURL(`**${hero.aboutLink.href}`)
    await expect(page.getByTestId('aboutTitle')).toBeVisible()
    await expect(page.getByTestId('aboutContent')).toBeVisible()
    await expect(page.getByTestId('aboutTOC')).toBeVisible()

    await page.close()
  })

  test('login button should redirect to login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(URL))

    const loginBtn = page.getByTestId(nav.loginBtn)
    await expect(loginBtn).toBeVisible()
    loginBtn.click()
    await page.waitForURL(authLink)

    await page.close()
  })
})
