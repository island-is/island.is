import { BrowserContext, expect, test } from '@playwright/test'
import { messages as m } from '@island.is/portals/my-pages/documents/messages'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { helpers } from '../../../../support/locator-helpers'
import { disableI18n } from '../../../../support/disablers'

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
    const { findByRole } = helpers(page)
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))
    await expect(findByRole('link', 'Pósthólf').first()).toBeVisible()
  })
  test('should have user Gervimaður Afríka logged in', async () => {
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))
    await expect(findByRole('heading', 'Gervimaður Afríka')).toBeVisible()
  })
  test('should have Pósthólf', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    const { findByRole } = helpers(page)
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))
    await findByRole('link', 'Pósthólf').click()
    await expect(page.getByText(label(m.pickDocument))).toBeVisible()
  })
  test('should change language', async () => {
    const page = await context.newPage()
    const { findByTestId } = helpers(page)
    await page.goto(icelandicAndNoPopupUrl(servicePortalHome))

    const languageButton = findByTestId('language-switcher-button')
    await languageButton.click()
    const greeting = findByTestId('greeting')

    await expect(languageButton).toContainText('IS')
    await expect(greeting).toContainText(/(?:day|evening)/)
  })
})
