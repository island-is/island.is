import { expect, test as base, Page } from '@playwright/test'
import {
  createMockPdf,
  deleteMockPdf,
  sleep,
} from '../../../../../src/support/utils'
import {
  disableI18n,
  disablePreviousApplications,
  disableObjectKey,
  disableDelegations,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'

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
