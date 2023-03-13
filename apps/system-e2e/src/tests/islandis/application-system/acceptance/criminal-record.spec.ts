import { BrowserContext, test as base, Page, expect } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  mockQGL,
  disablePreviousApplications,
  disableI18n,
} from '../../../../support/disablers'

const homeUrl = '/umsoknir/sakavottord'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    // await disableObjectKey(applicationPage, 'existingApplication')
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    // await disableDelegations(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Passport', () => {
  applicationTest('Successful application', async ({ applicationPage }) => {
    const page = applicationPage
    await disablePreviousApplications(page)

    // Dataproviders
    await page.getByTestId('agree-to-data-providers').check()
    await page.getByTestId('proceed').click()

    // Payment overview
    await page.getByRole('button', { name: 'Staðfesta' }).click()

    // Payment screen
    await page.getByText('Mastercard').click()
    await page.getByRole('button', { name: 'Greiða' }).click()

    // Error screen
    await page.getByRole('button', { name: 'Áfram' }).click()
    await page.getByRole('button', { name: 'Hætta við' }).click()

    // Return screen
    await mockQGL(
      page,
      'status',
      { fulfilled: true },
      { responseKey: 'applicationPaymentStatus', patchResponse: true },
    )
    await page
      .getByRole('region', { name: 'Staðfesting' })
      .getByRole('paragraph')
      .dblclick()
    await expect(page.getByText('Staðfesting').first()).toBeVisible()
    await expect(page.getByText('Lokið').first()).toBeVisible()
  })
})
