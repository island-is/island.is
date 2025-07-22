import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  disableI18n,
  disablePreviousApplications,
  disableDelegations,
} from '../../../../support/disablers'
import format from 'date-fns/format'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Endorsements', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      storageState: 'service-portal-amerika.json',
      homeUrl: `${urls.islandisBaseUrl}/umsoknir/undirskriftalisti`,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should be able to create application', async () => {
    const today = new Date()
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    const title = 'System E2E Playwright Test listi title'
    const description = 'System E2E Playwright Test listi description'
    const page = await context.newPage()

    await page.goto(icelandicAndNoPopupUrl('/umsoknir/undirskriftalisti'))

    await disablePreviousApplications(page)
    await disableDelegations(page)
    await disableI18n(page)

    // 1 start the application process
    await page.click('button:text("Halda áfram")')

    // 2 check the checkbox and click next
    await page.check('input[type="checkbox"]')
    await page.click('button:text("Halda áfram")')

    // 3 fill in the form and click next

    await page.getByLabel('Heiti lista').fill(title)
    await page
      .getByPlaceholder(
        'Texti sem birtist með undirskriftalista. Ekki er hægt að breyta texta eftir að undirskriftalisti hefur verið birtur.',
      )
      .fill(description)
    await page
      .getByLabel('Tímabil lista')
      .first()
      .fill(format(today, 'dd.MM.yyyy'))
    await page.keyboard.press('Enter')
    await page
      .getByLabel('Tímabil lista')
      .last()
      .fill(format(tomorrow, 'dd.MM.yyyy'))
    await page.keyboard.press('Enter')
    await page.click('button:text("Halda áfram")')

    // 4 confirm the form and click next
    await page.click('button:text("Stofna lista")')

    // 5 see some kind of success confirmation
    await expect(page.locator('button:text("Afrita hlekk")')).toBeVisible()
  })
})
