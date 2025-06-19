import { expect, test as base, Page } from '@playwright/test'
import { isApplication, disableI18n } from '@island.is/testing/e2e'
import { session } from '@island.is/testing/e2e'
import { createApplication } from '@island.is/testing/e2e'
import { label } from '@island.is/testing/e2e'
import { m as messages } from '@island.is/application/templates/no-debt-certificate'

const homeUrl = '/umsoknir/skuldleysisvottord'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(isApplication(applicationPage)).toBeTruthy()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Data protection complaint application', () => {
  applicationTest(
    'User should be able to submit the application as a company',
    async ({ applicationPage }) => {
      const page = applicationPage

      await applicationTest.step(
        'Select delegation on modal popup',
        async () => {
          await page.getByRole('button', { name: 'Alla leið ehf' }).click()
          await page.waitForURL(new RegExp(homeUrl), {
            waitUntil: 'domcontentloaded',
          })
        },
      )

      await applicationTest.step('Create application', async () => {
        await createApplication(page)
      })

      await applicationTest.step(
        'Proceed with the application and reach the submitted state',
        async () => {
          await page.getByTestId('agree-to-data-providers').check()
          await page.getByTestId('proceed').click()
          await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
        },
      )

      await applicationTest.step(
        'Verify confirmation and success',
        async () => {
          await expect(
            page.getByRole('region').getByText(label(messages.confirmation)),
          ).toBeVisible()
          await expect(
            page.getByRole('heading', { name: label(messages.successTitle) }),
          ).toBeVisible()
        },
      )
    },
  )
})
