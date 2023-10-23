import { test, BrowserContext, expect } from '@playwright/test'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { urls } from '../../../../support/urls'
import { m } from '@island.is/service-portal/core'
import { messages } from '@island.is/service-portal/health'
import { disableI18n } from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Heilsa', () => {
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

  test('Health Overview', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Should have health insurance', async () => {
      // Arrange
      await page.goto('/minarsidur/heilsa')

      // Act
      const healthInsurance = page
        .getByText(label(messages.hasHealthInsurance))
        .first()
      await expect(healthInsurance).toBeVisible()

      const seePaymentsButton = page.getByText(label(messages.seeMore)).first()

      seePaymentsButton.click()

      // Assert
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('#overview')
    })
  })

  test('Health Payments Overview', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Should have credit and debit ', async () => {
      // Arrange
      await page.goto('/minarsidur/heilsa/greidslur#overview')

      // Act
      const debit = page.getByText(label(messages.debit)).first()

      const credit = page.getByText(label(messages.credit)).first()

      // Assert

      await expect(debit).toBeVisible()
      await expect(credit).toBeVisible()
    })
  })

  test('Health Payments Participation', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step(
      'Should have maximum monthly payment and payment target ',
      async () => {
        // Arrange
        await page.goto('/minarsidur/heilsa/greidslur')

        // Act
        const maximumPayment = page
          .getByText(label(messages.maximumMonthlyPayment))
          .first()

        const paymentTarget = page
          .getByText(label(messages.paymentTarget))
          .first()

        // Assert

        await expect(maximumPayment).toBeVisible()
        await expect(paymentTarget).toBeVisible()
      },
    )
  })

  test('Health Medicine Payments', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Should have medical step and invoices ', async () => {
      // Arrange
      await page.goto('/minarsidur/heilsa/lyf')

      // Act
      const medicalStep = page.getByText(label(messages.medicineStep)).first()

      const invoices = page.getByTestId('invoices')

      // Assert

      await expect(medicalStep).toBeVisible()
      await expect(invoices).toBeVisible()
    })
  })

  test('Health Medicine Calculator', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step(
      'Should have drug filter and calculate button',
      async () => {
        // Arrange
        await page.goto('/minarsidur/heilsa/lyf#reiknivel')

        // Act
        const filter = page.getByRole('textbox', {
          name: label(messages.medicineFindDrug),
        })

        await filter.click()
        await filter.type('Paratabs', { delay: 1000 })

        const drugsPortion = page.getByText('500 mg', { exact: false }).first()

        const calculateButton = page.getByTestId('calculate-button').first()
        // Assert

        await expect(drugsPortion).toBeVisible()
        await expect(calculateButton).not.toBeDisabled()
      },
    )
  })

  test('Health Medicine Calculator', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Should have three medical certificates', async () => {
      // Arrange
      await page.goto('/minarsidur/heilsa/lyf#skirteini')

      // Act
      const certificates = page.getByText(
        label(messages.medicineIsValidCertificate),
      )

      // Assert
      expect(certificates).toHaveLength(3)
    })
  })
})
