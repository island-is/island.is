import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'

const homeUrl = '/umsoknir/skilavottord'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Car recycling', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Agree to data providers', async () => {
        await expect(
          page.getByRole('heading', {
            name: 'Gagnaöflun'
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()

        await page
          .getByRole('button', {
            name: 'Halda áfram',
          })
          .click()
      })

      await applicationTest.step('Unregister for recycling', async () => {
        await expect(
          page.getByRole('heading', {
            name: 'Afskrá til endurvinnslu',
          }),
        ).toBeVisible()

        await page
          .getByRole('region', {
            name: 'Afskrá til endurvinnslu',
          })
          .getByRole('button', {
            name: 'Endurvinna',
          })
          .first()
          .click()
        await expect(
          page.getByRole('heading', {
            name: 'Ökutæki valin til endurvinnslu',
          }),
        ).toBeVisible()

        const mileage = page.getByRole('textbox', {
          name: 'Kílómetrastaða',
        })

        await mileage.selectText()
        await mileage.type('12345')

        await proceed()
      })

      await applicationTest.step('Submit application', async () => {
        await expect(
          page
            .locator('form')
            .getByRole('paragraph')
            .filter({
              hasText: 'Afskrá til endurvinnslu',
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: 'Afskrá til endurvinnslu',
          })
          .click()
      })

      await applicationTest.step(
        'Check that conclusion screen header is visible and proceed to view the application',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: 'Umsókn móttekin',
            }),
          ).toBeVisible()
        },
      )
    },
  )
})
