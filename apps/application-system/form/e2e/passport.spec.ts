import { test as base, Page } from '@playwright/test'
import { expect } from '@island.is/testing/e2e'
import {
  disableI18n,
  disablePreviousApplications,
  session,
  proceed,
} from '@island.is/testing/e2e'

const homeUrl = '/umsoknir/vegabref'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication('vegabref')
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Passport', () => {
  applicationTest(
    'Should be able to start application',
    async ({ applicationPage }) => {
      const page = applicationPage
      page.goto(`${homeUrl}?delegationChecked=true`)

      await page.getByTestId('agree-to-data-providers').check()
      await proceed(page)
      await expect(page.getByText('Gervimaður Færeyjar')).toBeVisible()
    },
  )
})
