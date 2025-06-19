import { test, BrowserContext, expect } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'
import {
  vehicleMessage,
  messages,
} from '@island.is/portals/my-pages/assets/messages'

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
    test.slow()
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data and filter overview', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/eignir/okutaeki/min-okutaeki'),
      )

      // Act
      const ownersLicense = page
        .locator(`role=button[name="${label(vehicleMessage.myCarsFiles)}"]`)
        .first()
      const recycleLicense = page
        .locator(`role=button[name="${label(vehicleMessage.recycleCar)}"]`)
        .first()
      const hideName = page
        .locator(
          `role=button[name="${label(vehicleMessage.vehicleNameSecret)}"]`,
        )
        .first()
      const ownershipLink = page
        .getByRole('button', { name: label(vehicleMessage.changeOfOwnership) })
        .first()

      const viewLink = page.getByText(label(messages.seeInfo)).first()

      // Assert
      await expect(ownersLicense).toBeVisible()
      await expect(recycleLicense).toBeVisible()
      await expect(hideName).toBeVisible()
      await expect(viewLink).toBeVisible()
      await expect(ownershipLink).toBeVisible()
    })

    await test.step('should display detail', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/eignir/okutaeki/min-okutaeki'),
      )
      await page.waitForLoadState('networkidle')

      // Act
      const viewLink = page.getByText(label(messages.seeInfo)).first()
      await viewLink.click()

      const basicInfoText = page
        .getByText(label(vehicleMessage.baseInfoTitle))
        .first()
      const reportLink = page
        .locator(
          `role=button[name="${label(vehicleMessage.vehicleHistoryReport)}"]`,
        )
        .first()

      // Assert
      await expect(page).toHaveURL(
        /minarsidur\/eignir\/okutaeki\/min-okutaeki\/.+/,
      )
      await expect(basicInfoText).toBeVisible()
      await expect(reportLink).toBeVisible()
    })
  })

  test('lookup', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should allow lookup of cars', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/eignir/okutaeki/leit'),
      )

      // Act
      const terms = page
        .locator(`role=button[name="${label(vehicleMessage.acceptTerms)}"]`)
        .first()
      await terms.click()

      const inputField = page.getByRole('textbox', {
        name: label(vehicleMessage.searchLabel),
      })
      await inputField.click()
      await inputField.fill('ísland.is')
      const lookBtn = page
        .getByRole('button', { name: label(vehicleMessage.search) })
        .first()
      await lookBtn.click()
      const basicInfoText = page
        .getByText(label(vehicleMessage.noVehicleFound))
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
        icelandicAndNoPopupUrl('/minarsidur/eignir/okutaeki/okutaekjaferill'),
      )

      // Act
      const tabButton = page.getByRole('tab', {
        name: label(vehicleMessage.operatorHistory),
      })
      await tabButton.click()

      const table = page.locator('role=table')

      // Assert
      await expect(table).toContainText('Forskráð') // API data

      // Act (filter)
      const inputField = page.getByPlaceholder('Veldu dagsetningu').first()
      await inputField.click()
      await inputField.fill('')
      await inputField.fill('01.04.2023')

      // Assert
      await expect(table).not.toContainText('Forskráð')
      await expect(table).toContainText('Í lagi') // API data
      await expect(table).toContainText(label(vehicleMessage.firstReg))
    })
  })
})
