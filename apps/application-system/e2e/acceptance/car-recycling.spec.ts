import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { carRecyclingMessages } from '@island.is/application/templates/car-recycling'
import { label } from '../../../../support/i18n'
import { coreMessages } from '@island.is/application/core'

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
            name: label(carRecyclingMessages.pre.externalDataSubSection),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()

        await page
          .getByRole('button', {
            name: label(coreMessages.buttonNext),
          })
          .click()
      })

      await applicationTest.step('Unregister for recycling', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(carRecyclingMessages.cars.sectionTitle),
          }),
        ).toBeVisible()

        await page
          .getByRole('region', {
            name: label(carRecyclingMessages.cars.sectionTitle),
          })
          .getByRole('button', {
            name: label(carRecyclingMessages.cars.recycle),
          })
          .first()
          .click()
        await expect(
          page.getByRole('heading', {
            name: label(carRecyclingMessages.cars.selectedTitle),
          }),
        ).toBeVisible()

        const mileage = page.getByRole('textbox', {
          name: label(carRecyclingMessages.cars.mileage),
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
              hasText: label(carRecyclingMessages.review.confirmSectionTitle),
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(carRecyclingMessages.review.confirmSectionTitle),
          })
          .click()
      })

      await applicationTest.step(
        'Check that conclusion screen header is visible and proceed to view the application',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(carRecyclingMessages.conclusionScreen.title),
            }),
          ).toBeVisible()
        },
      )
    },
  )
})
