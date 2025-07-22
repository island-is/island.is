import { BrowserContext, expect, test } from '@playwright/test'
import { messages as m } from '@island.is/portals/my-pages/documents/messages'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-afrika.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  const servicePortalHome = icelandicAndNoPopupUrl('/minarsidur')
  test('should have clickable navigation bar', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))
    await expect(
      page.getByRole('link', { name: 'Pósthólf' }).first(),
    ).toBeVisible()
  })
  test('should have user Gervimaður Afríka logged in', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))
    await expect(
      page.getByRole('heading', { name: 'Gervimaður Afríka' }),
    ).toBeVisible()
  })
  test('should have Pósthólf', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))
    await page.getByRole('link', { name: 'Pósthólf' }).click()
    await expect(page.getByText(label(m.pickDocument))).toBeVisible()
  })
  test('should change language', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))

    const languageButton = page.getByTestId('language-switcher-button')
    await languageButton.click()
    const greeting = page.getByTestId('greeting')

    await expect(languageButton).toContainText('IS')
    await expect(greeting).toContainText(/(?:day|evening)/)
  })
})
