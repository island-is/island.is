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

applicationTest.describe('Criminal record application payment test', () => {
  applicationTest(
    'Should be able to proceed through payment',
    async ({ applicationPage }) => {
      const page = applicationPage

      await applicationTest.step(
        'Create and proceed with application',
        async () => {
          await createApplication(page)
          await page.getByTestId('agree-to-data-providers').check()
          await page.getByTestId('proceed').click()
          await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
        },
      )

      await applicationTest.step('Confirm application', async () => {
        await page.getByRole('button', { name: 'Staðfesta' }).click()
        await page.waitForURL('https://uat.arkid.is/quickpay/card')
      })

      await applicationTest.step('Add a card', async () => {
        await page.getByRole('button', { name: 'Bæta við korti' }).click()
        await page.getByPlaceholder('Nafn korthafa').fill('Valitortestfyrirtgr')
        await page.getByPlaceholder('Kortanúmer').fill('2223000010246699')
        await page.getByPlaceholder('Öryggiskóði').fill('123')

        const date = new Date()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = String(date.getFullYear()).slice(-2)
        await page.getByPlaceholder('MM/ÁÁ').fill(`${month}${year}`)
      })

      await applicationTest.step('Complete payment', async () => {
        await page.getByRole('button', { name: 'Greiða' }).click()
        await page.getByRole('button', { name: 'Submit 3D data' }).click()
        await page.getByText('Greiðsla tókst').isVisible()
      })

      await applicationTest.step(
        'Verify payment completion on screen and overview',
        async () => {
          await page
            .getByRole('heading', {
              name: 'Umsókn þín um sakavottorð hefur verið staðfest',
            })
            .isVisible()

          await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
          await page.getByTestId('application-card').first().isVisible()
          expect(await page.getByText('Afgreidd').first().isVisible()).toBe(
            true,
          )
        },
      )
    },
  )
})
