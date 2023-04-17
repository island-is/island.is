import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Vehicles', () => {
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

    await test.step('should display data and filter overview', async () => {
      // Arrange
      await page.goto('/minarsidur/okutaeki/min-okutaeki')

      // Act
      const ownersLicense = page
        .locator('role=button[name="Eignastöðuvottorð"]')
        .first()
      const recycleLicense = page
        .locator('role=button[name="Skilavottorð"]')
        .first()
      const hideName = page
        .locator('role=button[name="Nafnleynd í ökutækjaskrá"]')
        .first()
      const viewLink = page.getByText('Skoða nánar').first()

      const inputField = page.locator('input[name="okutaeki-leit"]')
      await inputField.click()
      await inputField.type('la', { delay: 200 })

      // Assert
      await expect(ownersLicense).toBeVisible()
      await expect(recycleLicense).toBeVisible()
      await expect(hideName).toBeVisible()
      await expect(viewLink).toBeVisible()
      await expect(page.locator('text=ökutæki fundust')).toBeVisible()
      await expect(page.locator('text=Hreinsa síu')).toBeVisible()
    })

    await test.step('should display detail', async () => {
      // Arrange
      await page.goto('/minarsidur/okutaeki/min-okutaeki')
      await page.waitForLoadState('networkidle')

      // Act
      const viewLink = page.getByText('Skoða nánar').first()
      await viewLink.click()

      const basicInfoText = page.getByText('Grunnupplýsingar ökutækis').first()
      const reportLink = page
        .locator('role=button[name="Ferilskýrsla"]')
        .first()
      const ownershipLink = page
        .locator('role=button[name="Tilkynna eigendaskipti"]')
        .first()

      // Assert
      await expect(page).toHaveURL(/minarsidur\/okutaeki\/min-okutaeki\/.+/)
      await expect(basicInfoText).toBeVisible()
      await expect(reportLink).toBeVisible()
      await expect(ownershipLink).toBeVisible()
    })
  })

  test('lookup', async () => {
    const page = await context.newPage()

    await test.step('should allow lookup of cars', async () => {
      // Arrange
      await page.goto('/minarsidur/okutaeki/leit')

      // Act
      const terms = page
        .locator('role=button[name="Samþykkja skilmála"]')
        .first()
      await terms.click()

      const inputField = page.locator(
        'input[name="uppfletting-okutaekjaskra-leit"]',
      )
      await inputField.click()
      await inputField.type('ísland.is', { delay: 200 })
      const lookBtn = page.getByText(/Leita/).first()
      await lookBtn.click()
      const basicInfoText = page.getByText('Ekkert ökutæki fannst').first()

      // Assert
      await expect(basicInfoText).toBeVisible()
    })
  })

  test('history list', async () => {
    const page = await context.newPage()

    await test.step('should display and filter data', async () => {
      // Arrange
      await page.goto('/minarsidur/okutaeki/okutaekjaferill')

      // Act
      const tabButton = page.getByRole('tab', {
        name: 'Umráðaferill',
      })
      await tabButton.click()

      const table = page.locator('role=table')

      // Assert
      await expect(table).toContainText('Forskráð')

      // Act (filter)
      const inputField = page.getByPlaceholder('Veldu dagsetningu').first()
      await inputField.click()
      await inputField.fill('')
      await inputField.type('01.04.2023', { delay: 200 })

      // Assert
      await expect(table).not.toContainText('Forskráð')
      await expect(table).toContainText('Í lagi')
      await expect(table).toContainText('Fyrsta skráning')
    })
  })
})

test.describe.skip('Ökutæki', () => {
  for (const { testCase } of [
    { testCase: 'Ökutæki ferilskýrsla + eignastöðuvottorð', home: '/en' },
    { testCase: 'Ökutækjaferill', home: '/en' },
    { testCase: 'Ökunám', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
