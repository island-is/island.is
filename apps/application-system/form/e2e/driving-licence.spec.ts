import { test as base, Page } from '@playwright/test'
import { env } from '@island.is/testing/e2e'
import { disableI18n, disablePreviousApplications, disableObjectKey, isApplication, session, proceed } from '@island.is/testing/e2e'

const homeUrl = '/umsoknir/okuskirteini'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0107789',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disableObjectKey(applicationPage, 'existingApplication')
    //TODO: allow multiple mocked keys
    //await disableObjectKey(applicationPage, 'currentLicence')
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    expect(await isApplication(applicationPage, 'okuskirteini')).toBeTruthy()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Driving Instructor Registrations', () => {
  applicationTest.beforeEach(async ({ applicationPage }) => {
    const page = applicationPage
    // Handle fake-data from RLS
    if (env === 'local' || env === 'dev') {
      await page.getByLabel('Já').check()
      await page
        .getByRole('region', { name: 'Núverandi ökuréttindi umsækjanda' })
        .getByLabel('Engin')
        .check()
      await page
        .getByRole('region', { name: 'Gervimynd eða enga mynd?' })
        .locator('label')
        .first()
        .click()
      await proceed(page)
    }
  })

  applicationTest('should be able to apply', async ({ applicationPage }) => {
    const page = applicationPage
    // Data providers
    await page.getByTestId('agree-to-data-providers').click()
    await proceed(page)

    // Driving licence type selection
    await page.getByLabel('Almenn ökuréttindi').check()
    await proceed(page)

    // Requirements overview
    await page.getByRole('button', { name: 'Halda áfram' }).click()

    // Applicant info
    await page.getByPlaceholder('Netfang').fill('email@domain.com')
    await page.getByPlaceholder('Símanúmer').fill('7654321')
    await page.getByLabel('Ökukennari').click()
    await page.getByLabel('Ökukennari').press('Tab')
    await proceed(page)

    // Driving licence in other country
    await page.getByLabel('Nei').check()
    await proceed(page)

    // Delivery address
    await page.getByLabel('Afhending').click()
    await page.getByLabel('Afhending').press('Tab')
    await proceed(page)

    // Health declaration
    await page.getByText('Heilbrigðisyfirlýsing').click()
    for (const _ of Array(10)) {
      await page.locator('body').press('ArrowRight')
      await page.locator('body').press('Tab')
    }
    await proceed(page)

    // Overview
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    // TODO handle payment when working
  })
})
