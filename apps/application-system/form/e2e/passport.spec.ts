import { expect, test as base, Page } from '@playwright/test'
import { isApplication } from '@island.is/testing/e2e'
import {
  disableI18n,
  disablePreviousApplications,
} from '@island.is/testing/e2e'
import { session } from '@island.is/testing/e2e'

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
    await expect(isApplication(applicationPage, 'vegabref')).toBeTruthy()
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
      await page.getByTestId('proceed').click()
      await expect(page.getByText('Gervimaður Færeyjar')).toBeVisible()
    },
  )
})
