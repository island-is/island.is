import { expect, test as base, Page } from '@playwright/test'
import { disableI18n } from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { createApplication } from '../../../../support/application'

const homeUrl = '/umsoknir/sakavottord'

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

applicationTest.describe('Data protection complaint application', () => {
  applicationTest.only(
    'Should be able to proceed through payment',
    async ({ applicationPage }) => {
      await applicationTest.step(
        'Delete an application and check the number of applications after deletion',
        async () => {
          const page = applicationPage
          await createApplication(page)
          await applicationTest.step(
            'Proceed with the application to reach the draft state',
            async () => {
              await page.getByTestId('agree-to-data-providers').check()
              await page.getByTestId('proceed').click()
              await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
            },
          )
          await page.getByRole('button', { name: 'Staðfesta' }).click()
          await page.waitForURL('https://uat.arkid.is/quickpay/card')
          await page.getByRole('button', { name: 'Bæta við korti' }).click()
          await page
            .getByPlaceholder('Nafn korthafa')
            .fill('Valitortestfyrirtgr')
          await page.getByPlaceholder('Kortanúmer').fill('2223000010246699')
          await page.getByPlaceholder('Öryggiskóði').fill('123')

          const date = new Date()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const year = String(date.getFullYear()).slice(-2)
          await page.getByPlaceholder('MM/ÁÁ').fill(`${month}${year}`)
          await page.getByRole('button', { name: 'Greiða' }).click()

          await page.getByRole('button', { name: 'Submit 3D data' }).click()

          await page.getByText('Greiðsla tókst').isVisible()
          await page.getByRole('button', { name: 'Áfram' }).click()
          await page
            .getByRole('heading', {
              name: 'Umsókn þín um sakavottorð hefur verið staðfest',
            })
            .isVisible()

          await page.getByRole('button', { name: 'Áfram' }).click()
          await page.getByTestId('application-card').first().isVisible()
          expect(await page.getByText('Afgreidd').first().isVisible()).toBe(
            true,
          )
        },
      )
    },
  )
})
