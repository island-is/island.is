import { test, BrowserContext, expect } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'
import { m } from '@island.is/portals/my-pages/licenses/messages'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Skírteini', () => {
  let contextFaereyjar: BrowserContext
  let contextAmerika: BrowserContext
  const contexts: BrowserContext[] = []

  test.beforeAll(async ({ browser }) => {
    contextAmerika = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
    contextFaereyjar = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
    contexts.push(contextAmerika, contextFaereyjar)
  })

  test.afterAll(async () => {
    for (const context of contexts) await context.close()
  })

  test('License overview', async () => {
    const page = await contextFaereyjar.newPage()
    await disableI18n(page)

    await test.step('Renders the page', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/skirteini'))

      // Assert
      const headline = page.getByRole('heading', { name: label(m.title) })
      await expect(headline).toBeVisible()
    })
  })

  test('should display passport in overview', async () => {
    const page = await contextFaereyjar.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/skirteini'))
    await page.waitForLoadState('networkidle')

    // Act
    const passportLink = page
      .locator('data-testid=passport-card')
      .getByRole('link', { name: label(m.seeDetails) })
    await passportLink.click()
    const title1 = page.getByText(label(m.passportName))

    // Assert
    await expect(page).toHaveURL(
      /minarsidur\/skirteini\/tjodskra\/vegabref\/.+/,
    )
    await expect(title1).toBeVisible()
  })

  test('should display child passports', async () => {
    const page = await contextAmerika.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/skirteini'))
    await page.waitForLoadState('networkidle')

    // Act
    const tabButton = page.getByRole('tab', {
      name: label(m.licenseTabSecondary),
    })
    await tabButton.click()

    const childPassportLink = page
      .locator(`role=button[name="${label(m.seeDetails)}"]`)
      .last()
    await childPassportLink.click()
    const title1 = page.getByText(label(m.passportName))

    // Assert
    await expect(page).toHaveURL(
      /minarsidur\/skirteini\/tjodskra\/vegabref\/.+/,
    )
    await expect(title1).toBeVisible()
  })
})
