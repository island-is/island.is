import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { messages } from '@island.is/service-portal/vehicles/messages'
import { m } from '@island.is/service-portal/core/messages'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Vehicles', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-utlond.json',
      homeUrl,
      phoneNumber: '0107789',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('my vehicles', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data and filter overview', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/okutaeki/min-okutaeki'),
      )

      // Act
      const ownersLicense = page
        .locator(`role=button[name="${label(messages.myCarsFiles)}"]`)
        .first()
      const recycleLicense = page
        .locator(`role=button[name="${label(messages.recycleCar)}"]`)
        .first()
      const hideName = page
        .locator(`role=button[name="${label(messages.vehicleNameSecret)}"]`)
        .first()
      const ownershipLink = page
        .getByRole('button', { name: label(messages.changeOfOwnership) })
        .first()

      const viewLink = page.getByText(label(messages.seeInfo)).first()

      const inputField = page.getByRole('textbox', {
        name: label(m.searchLabel),
      })
      await inputField.click()
      await inputField.type('la', { delay: 200 })

      // Assert
      await expect(ownersLicense).toBeVisible()
      await expect(recycleLicense).toBeVisible()
      await expect(hideName).toBeVisible()
      await expect(viewLink).toBeVisible()
      await expect(ownershipLink).toBeVisible()
      await expect(page.locator(`text=${label(messages.found)}`)).toBeVisible()
      await expect(
        page.locator(`text=${label(messages.clearFilter)}`),
      ).toBeVisible()
    })

    await test.step('should display detail', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/okutaeki/min-okutaeki'),
      )
      await page.waitForLoadState('networkidle')

      // Act
      const viewLink = page.getByText(label(messages.seeInfo)).first()
      await viewLink.click()

      const basicInfoText = page
        .getByText(label(messages.baseInfoTitle))
        .first()
      const reportLink = page
        .locator(`role=button[name="${label(messages.vehicleHistoryReport)}"]`)
        .first()

      // Assert
      await expect(page).toHaveURL(/minarsidur\/okutaeki\/min-okutaeki\/.+/)
      await expect(basicInfoText).toBeVisible()
      await expect(reportLink).toBeVisible()
    })
  })

  test('lookup', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should allow lookup of cars', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/okutaeki/leit'))

      // Act
      const terms = page
        .locator(`role=button[name="${label(messages.acceptTerms)}"]`)
        .first()
      await terms.click()

      const inputField = page.getByRole('textbox', {
        name: label(messages.searchLabel),
      })
      await inputField.click()
      await inputField.type('ísland.is', { delay: 200 })
      const lookBtn = page
        .getByRole('button', { name: label(messages.search) })
        .first()
      await lookBtn.click()
      const basicInfoText = page
        .getByText(label(messages.noVehicleFound))
        .first()

      // Assert
      await expect(basicInfoText).toBeVisible()
    })
  })

  test('history list', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display and filter data', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/okutaeki/okutaekjaferill'),
      )

      // Act
      const tabButton = page.getByRole('tab', {
        name: label(messages.operatorHistory),
      })
      await tabButton.click()

      const table = page.locator('role=table')

      // Assert
      await expect(table).toContainText('Forskráð') // API data

      // Act (filter)
      const inputField = page.getByPlaceholder('Veldu dagsetningu').first()
      await inputField.click()
      await inputField.fill('')
      await inputField.type('01.04.2023', { delay: 200 })

      // Assert
      await expect(table).not.toContainText('Forskráð')
      await expect(table).toContainText('Í lagi') // API data
      await expect(table).toContainText(label(messages.firstReg))
    })
  })
})
