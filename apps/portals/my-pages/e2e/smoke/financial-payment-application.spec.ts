import { test, BrowserContext, expect } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'
import { m } from '@island.is/portals/my-pages/finance/messages'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Fjármál overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Finance payment application', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Application button is visible', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/fjarmal/greidsluaetlanir'),
      )

      // Act
      const applicationButton = page.locator(
        `role=button[name="${label(m.scheduleApplication)}"]`,
      )

      // Assert
      await expect(applicationButton).toBeVisible()
    })

    await test.step('Application opens', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/fjarmal/greidsluaetlanir'),
      )

      // Act
      const applicationButton = page.locator(
        `role=button[name="${label(m.scheduleApplication)}"]`,
      )

      const [delegationPopup] = await Promise.all([
        page.waitForEvent('popup'),
        // Click - Open Link in Popup
        applicationButton.click(),
      ])

      // Choose delegation
      await delegationPopup
        .getByRole('button', { name: 'Gervimaður Færeyjar' })
        .click()
      // Assert
      await expect(
        delegationPopup.getByText('Viltu nota gervigögn?'),
      ).toBeVisible()
      expect(delegationPopup.url()).toContain('umsoknir/greidsluaaetlun')
    })

    //Disabling the following section of the test due to the service not returning data on Dev

    // await test.step('Table contains data', async () => {
    //   // Arrange
    //   await page.goto(icelandicAndNoPopupUrl('/minarsidur/fjarmal/greidsluaetlanir'))
    //
    //   // Assert
    //   await expect(page.locator('role=table')).toContainText(
    //     label(m.createdDate),
    //   )
    //   await expect(page.locator('role=table')).toContainText(
    //     label(m.financeStatusValid),
    //   )
    //
    //   // "Skattar og gjöld" comes from the api - not translateable
    //   await expect(page.locator('role=table')).toContainText('Skattar og gjöld')
    // })
  })
})
