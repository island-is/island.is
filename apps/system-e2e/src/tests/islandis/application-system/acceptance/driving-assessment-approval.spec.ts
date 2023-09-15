import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'

const homeUrl = '/umsoknir/akstursmat'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    // await disableObjectKey(applicationPage, 'existingApplication')
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Driving Asessment Approval', () => {
  applicationTest(
    'should pass all, except submit',
    async ({ applicationPage }) => {
      const page = applicationPage
      await page.goto(homeUrl)

      // Data Providers
      await page.getByTestId('agree-to-data-providers').click()
      await page.getByTestId('proceed').click()

      // Student info
      await page.getByLabel('Kennitala nemanda').click()
      await page.getByLabel('Kennitala nemanda').fill('0101307789')
      await page.getByLabel('Netfang').fill('email@domain.test')
      await expect(page.getByText('Gervimaður útlönd')).toBeVisible()
      await page.getByTestId('proceed').click()

      // Confirmation
      await page
        .getByText(
          'Ég staðfesti að akstursmat hefur farið fram í samræmi við ákvæði í reglugerð um ',
        )
        .first()
        .click()
      await page.getByRole('button', { name: 'Staðfesta' }).click()

      // Error message
      await page
        .getByText(
          'Nýtt akstursmat: Einstaklingur á fullnaðarskírteini, ekki er leyfilegt að senda ',
        )
        .dblclick()
    },
  )
})
