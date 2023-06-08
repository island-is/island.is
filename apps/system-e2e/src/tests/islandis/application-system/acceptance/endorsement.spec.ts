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
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should be able to go through create application process', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/umsoknir/undirskriftalisti'))

    await disablePreviousApplications(page)
    await disableDelegations(page)
    await disableI18n(page)

    // 1 Start the application by clicking the button
    let submitButton = await page.waitForSelector('button:text("Halda áfram")')
    await submitButton.click()

    // 2 check the checkbox and click next
    const checkbox = await page.waitForSelector('input[type="checkbox"]')
    await checkbox.check()
    submitButton = await page.waitForSelector('button:text("Halda áfram")')
    await submitButton.click()

    // 3 fill in the form and click next
    await page
      .getByLabel('Heiti undirskriftalista')
      .fill('System E2E Playwright Test listi title')
    await page
      .getByLabel('Um undirskriftalista')
      .fill('System E2E Playwright Test listi description')
    const currentDate = new Date(Date.now()).toLocaleDateString('de-DE') // today dd.mm.yyyy
    await page.getByLabel('Tímabil lista').first().fill(currentDate) // fill first datepicker
    await page.getByLabel('Heiti undirskriftalista').click() // closes datepicker
    const tomorrowDate = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toLocaleDateString('de-DE') // tomorrow dd.mm.yyyy
    await page.getByLabel('Tímabil lista').last().fill(tomorrowDate) // fill second datepicker
    await page.getByLabel('Heiti undirskriftalista').click() // closes datepicker
    submitButton = await page.waitForSelector('button:text("Halda áfram")')
    await submitButton.click()

    // 4 confirm the form and click next
    submitButton = await page.waitForSelector('button:text("Stofna lista")')
    await submitButton.click()

    // 5 see success message
    // await page.waitForSelector(
    //   'div:has-text("Undirskriftalista hefur verið skilað til Ísland.is")',
    // )
    // Assert
    await expect(
      page.locator('div:has-text("Undirskriftalista hefur verið skilað til Ísland.is")'),
    ).toBeVisible()
  })

  // test('should be able to find an sign a petition/endorsementList', async () => {
  //   const page = await context.newPage()
  //   await page.goto(icelandicAndNoPopupUrl('/undirskriftalistar'))

  //   await disablePreviousApplications(page)
  //   await disableDelegations(page)
  //   await disableI18n(page)

  //   // Find a list made by some other user
  //   await page.getByText('Skoða lista').last().click()

  //   const button = await page.waitForSelector(
  //     'button:text("Setja nafn mitt á þennan lista")',
  //   )
  //   await button.click()

  //   // Get all popups when they open
  //   page.on('popup', async (popup) => {
  //     await popup.waitForLoadState()
  //     console.log(await popup.title())
  //   })

  //   // Undirskriftalista hefur verið skilað til Ísland.is

  //   // await button.click();

  //   // !!!!!!!!! currently loads a new page with // wrong in url

  //   // // NOT WHAT WE WANT
  //   // await page.waitForSelector('div:has-text("Umsókn fannst ekki")');
  // })
})
