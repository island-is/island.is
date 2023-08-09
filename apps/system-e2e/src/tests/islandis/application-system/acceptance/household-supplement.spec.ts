import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { householdSupplementFormMessage } from '@island.is/application/templates/household-supplement'
// import { householdSupplementFormMessage } from '@island.is/application/templates/household-supplement/messages'
import { label } from '../../../../support/i18n'

const homeUrl = '/umsoknir/heimilisuppbot'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      // phoneNumber: '0103019',
      phoneNumber: '0104929', // Gervimaður Bretland
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

applicationTest.describe('Household Supplement', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      // await page.pause()

      // External Data
      await expect(
        page.getByRole('heading', {
          name: label(householdSupplementFormMessage.pre.externalDataSection),
        }),
      ).toBeVisible()
      await page.getByTestId('agree-to-data-providers').click()
      await page
        .getByRole('button', {
          name: label(householdSupplementFormMessage.pre.startApplication),
        })
        .click()

      // Applicant info
      await expect(
        page.getByRole('heading', {
          name: label(householdSupplementFormMessage.info.subSectionTitle),
        }),
      ).toBeVisible()

      const emailBox = page.getByRole('textbox', {
        name: label(householdSupplementFormMessage.info.applicantEmail),
      })
      await emailBox.selectText()
      // TODO: Do we need to create a test email and add it here like in the parental leave application?
      await emailBox.type('mockEmail@island.is')

      const phoneNumber = page.getByRole('textbox', {
        name: label(householdSupplementFormMessage.info.applicantPhonenumber),
      })
      await phoneNumber.selectText()
      await phoneNumber.type('6555555')
      await proceed()

      // Payment information
      await expect(
        page.getByRole('heading', {
          name: label(householdSupplementFormMessage.info.paymentTitle),
        }),
      ).toBeVisible()
      const paymentBank = page.getByRole('textbox', {
        name: label(householdSupplementFormMessage.info.paymentBank),
      })
      await paymentBank.selectText()
      await paymentBank.type('051226054678')
      await proceed()

      // Household supplement
      // TODO: What should i select here?
      await expect(
        page.getByRole('heading', {
          name: label(
            householdSupplementFormMessage.shared.householdSupplement,
          ),
        }),
      ).toBeVisible()

      await page
        .getByRole('region', {
          name: label(
            householdSupplementFormMessage.info.householdSupplementHousing,
          ),
        })
        .getByRole('radio', {
          name: label(
            householdSupplementFormMessage.info.householdSupplementHousingOwner,
          ),
        })
        .click()

      // await page
      // .getByRole('radio', {
      //   name: label(householdSupplementFormMessage.shared.no),
      // })
      // .click()
      await page
        .getByRole('region', {
          name: label(
            householdSupplementFormMessage.info
              .householdSupplementChildrenBetween18And25,
          ),
        })
        .getByRole('radio', {
          name: label(householdSupplementFormMessage.shared.no),
        })
        .click()
      await proceed()

      // Period
      await expect(
        page.getByRole('heading', {
          name: label(householdSupplementFormMessage.info.periodTitle),
        }),
      ).toBeVisible()

      await page.getByTestId('select-period.year').click()
      await page.keyboard.press('Enter')

      await page.getByTestId('select-period.month').click()
      await page.keyboard.press('Enter')
      await proceed()

      // Additional documents
      await expect(
        page.getByRole('heading', {
          name: label(
            householdSupplementFormMessage.fileUpload.additionalFileTitle,
          ),
        }),
      ).toBeVisible()
      await proceed()

      // Comment
      await expect(
        page.getByRole('heading', {
          name: label(householdSupplementFormMessage.comment.commentSection),
        }),
      ).toBeVisible()
      await page
        .getByPlaceholder(
          label(householdSupplementFormMessage.comment.placeholder),
        )
        .fill(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
        )
      await proceed()

      // Submit application
      await expect(
        page
          .locator('form')
          .getByRole('paragraph')
          .filter({
            hasText: label(householdSupplementFormMessage.confirm.title),
          }),
      ).toBeVisible()
      await page
        .getByRole('button', {
          name: label(householdSupplementFormMessage.confirm.title),
        })
        .click()

      // Conclusion screen
      await expect(
        page.getByRole('heading', {
          name: label(householdSupplementFormMessage.conclusionScreen.title),
        }),
      ).toBeVisible()
      await page
        .getByRole('button', {
          name: label(
            householdSupplementFormMessage.conclusionScreen
              .buttonsViewApplication,
          ),
        })
        .click()

      // Review application
      await expect(
        page
          .locator('form')
          .getByRole('paragraph')
          .filter({
            hasText: label(
              householdSupplementFormMessage.confirm.overviewTitle,
            ),
          }),
      ).toBeVisible()
    },
  )
})
