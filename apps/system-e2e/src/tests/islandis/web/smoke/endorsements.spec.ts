import { BrowserContext, expect, test } from '@playwright/test'
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
      phoneNumber: '0102399',
      delegation: '65° Arctic ehf',
      authTriggerUrl: '/minarsidur',
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test.skip('should be able to see overview and endorse a list if there are lists', async () => {
    const page = await context.newPage()

    await page.goto(icelandicAndNoPopupUrl('/undirskriftalistar'))

    await disablePreviousApplications(page)
    await disableDelegations(page)
    await disableI18n(page)

    // Act
    await page.getByRole('button', { name: 'Skoða lista' }).first().click()
    const popupPromise = page.waitForEvent('popup')
    await page
      .getByRole('button', { name: 'Setja nafn mitt á þennan lista' })
      .click()

    // Assert
    const popupPage = await popupPromise
    await popupPage.getByRole('button', { name: 'Afrita hlekk' }).click()
    await expect(popupPage.getByText('Staða: Lokið')).toBeVisible()
  })
})
