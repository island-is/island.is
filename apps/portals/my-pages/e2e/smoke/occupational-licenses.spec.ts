import { BrowserContext, expect, test } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'
import { m } from '@island.is/portals/my-pages/core/messages'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Occupational licenses overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Has occupational licenses', async () => {
    test.slow()
    const page = await context.newPage()
    await disableI18n(page)

    await test.step(
      'Overview cards are displayed and cards can navigate to detail',
      async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('/minarsidur/starfsleyfi'))

        const hasHealthDirectorateLicense = page
          .locator(`role=button[name="${label(m.view)}"]`)
          .first()

        // Act
        await hasHealthDirectorateLicense.click()
        const healthDirectorateTitle = page.getByText('Sálfræðingur').first()
        const healthDirectorateIsValid = page.getByText('Í gildi')

        const regex =
          /.*minarsidur\/starfsleyfi\/landlaeknir\/Sálfræðingur\/[0-9]+/

        const pageUrl = decodeURI(page.url())
        // Assert
        expect(pageUrl).toMatch(regex)

        // Assert
        await expect(healthDirectorateTitle).toBeVisible()
        await expect(healthDirectorateIsValid).toBeVisible()
      },
    )

    await test.step(
      'Overview cards are displayed and cards can navigate to detail',
      async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('/minarsidur/starfsleyfi'))

        const license = page
          .locator(`role=button[name="${label(m.view)}"]`)
          .last()

        // Act
        await license.click()
        const title = page.getByText('Kennari').first()
        const isValid = page.getByText('Í gildi').first()

        //regex that matches guid
        const regex = /.*minarsidur\/starfsleyfi\/mms\/Kennari\/[0-9]+/
        const pageUrl = decodeURI(page.url())
        // Assert
        expect(pageUrl).toMatch(regex)

        // Assert
        await expect(title).toBeVisible()
        await expect(isValid).toBeVisible()
      },
    )
  })
})
