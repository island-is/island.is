import { BrowserContext, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  disableI18n,
  disablePreviousApplications,
  disableDelegations,
} from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Endorsements', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl: '/undirskriftalistar',
      authUrl: '/minarsidur',
      phoneNumber: '0102399',
      delegation: '65° Arctic ehf',
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should be able to see overview and endorse a list if there are lists', async () => {
    const page = await context.newPage()

    await page.goto(icelandicAndNoPopupUrl('/undirskriftalistar'))

    await disablePreviousApplications(page)
    await disableDelegations(page)
    await disableI18n(page)

    await page.getByRole('button', { name: 'Skoða lista' }).first().click()
    await page.waitForSelector('button:text("Setja nafn mitt á þennan lista")')
    await page
      .getByRole('button', { name: 'Setja nafn mitt á þennan lista' })
      .click()

    await page.waitForSelector('button:text("Setja nafn mitt á þennan lista")')

    // from here a new tab opens and we need to find out how to tap into that ...
  })
})
