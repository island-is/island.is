import { expect, test as base, Page } from '@playwright/test'
import { disableI18n } from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { createApplication } from '../../../../support/application'
import { label } from '../../../../support/i18n'
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
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

const switchUser = async (page: Page, name?: string) => {
  await page.locator('data-testid=user-menu >> visible=true').click()
  await page.locator('role=button[name="Skipta um notanda"]').click()
  if (name) {
    const loc = await page.locator(`role=button[name*="${name}"]`).click()
    console.log(loc)
    await page.waitForURL(new RegExp(homeUrl), {
      waitUntil: 'domcontentloaded',
    })
  }
}

applicationTest.describe('Data protection complaint application', () => {
  applicationTest(
    'Should be able to start the application after changing to procuration user',
    async ({ applicationPage }) => {
      const page = applicationPage

      await applicationTest.step(
        'Proceed with the application to reach the overview state and verify text',
        async () => {
          await switchUser(page, 'Icelandic Offshore ehf')
        },
      )

      await createApplication(page)
      await applicationTest.step(
        'Proceed with the application to reach the draft state',
        async () => {
          await page.getByTestId('agree-to-data-providers').check()
          await page.getByTestId('proceed').click()
          await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
        },
      )
      await expect(
        page.getByRole('region').getByText(label(messages.confirmation)),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: label(messages.successTitle) }),
      ).toBeVisible()
    },
  )
})
