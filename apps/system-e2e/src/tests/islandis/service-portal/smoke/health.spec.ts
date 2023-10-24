import { test, BrowserContext, expect } from '@playwright/test'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { urls } from '../../../../support/urls'
import { messages } from '@island.is/service-portal/health'
import { disableI18n } from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Health pages', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-evropa.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0102719',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Overview page', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Checking for name and see more', async () => {
      await page.goto('/minarsidur/heilsa')

      const name = page.getByRole('heading', {
        name: 'Gervimaður Evrópa',
      })

      const seeMoreText = 'Sjá nánar'
      const seePaymentsButton = page.getByRole('link', {
        name: seeMoreText,
      })

      // Assert
      await expect(name).toBeVisible()

      seePaymentsButton.click()

      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('#overview')
    })
  })

  test('Medicine Payment page', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Should have medical step and invoices ', async () => {
      // Arrange
      await page.goto('/minarsidur/heilsa/lyf')

      // Act
      const medicalStep = page.getByText('Þrepastaða').first()

      const invoices = page.getByTestId('invoices')

      // Assert

      await expect(medicalStep).toBeVisible()
      await expect(invoices).toBeVisible()
    })
  })

  test('Medicine Calculator page', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step(
      'Should have drug filter and calculate button',
      async () => {
        // Arrange
        await page.goto('/minarsidur/heilsa/lyf#reiknivel')

        // Act
        const filter = page.getByPlaceholder('Leita að lyf')

        await filter.click()
        await filter.type('Parat', { delay: 1000 })

        const drugsPortion = page.getByText('500 mg', { exact: false }).first()
        const drugButton = page
          .getByRole('button', {
            name: 'Velja',
          })
          .nth(2)

        const calculateButton = page.getByTestId('calculate-button').first()
        // Assert

        await drugButton.focus()
        await drugButton.click()
        await expect(drugsPortion).toBeVisible()
        await expect(calculateButton).toBeEnabled()
      },
    )
  })

  test('Medicine Certificate page', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    await test.step('Should have three medical certificates', async () => {
      // Arrange
      await page.goto('/minarsidur/heilsa/lyf#skirteini')
      await page.waitForLoadState('networkidle')

      // Act
      const certificate = page.getByText('Metýlfenídat').first()

      const buttons = await page
        .getByRole('button', {
          name: 'Skoða',
        })
        .all()

      expect(buttons.length).toEqual(3)

      await expect(certificate).toBeVisible()
    })
  })
})
