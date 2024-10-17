import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { householdSupplementFormMessage } from '@island.is/application/templates/social-insurance-administration/household-supplement'
import { test as base, expect, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../../support/disablers'
import { label } from '../../../../../support/i18n'
import { helpers } from '../../../../../support/locator-helpers'
import { session } from '../../../../../support/session'
import { setupXroadMocks } from '../setup-xroad.mocks'
import {
  additionalAttachments,
  expectHeadingToBeVisible,
  fillApplicantInfo,
  fillPaymentInfo,
  selectPeriod,
  submitApplication,
  writeComment,
} from './shared'

const homeUrl = '/umsoknir/heimilisuppbot'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019', // Gervimaður Afríka
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await setupXroadMocks()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Household Supplement', () => {
  applicationTest(
    'Should complete Household Supplement application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Agree to data providers', async () => {
        await expectHeadingToBeVisible(
          page,
          socialInsuranceAdministrationMessage.pre.externalDataSection,
        )
        await page.getByTestId('agree-to-data-providers').click()
        await page
          .getByRole('button', {
            name: label(
              socialInsuranceAdministrationMessage.pre.startApplication,
            ),
          })
          .click()
      })

      await applicationTest.step('Fill in applicant info', () =>
        fillApplicantInfo(page),
      )

      await applicationTest.step('Fill in payment information', () =>
        fillPaymentInfo(page, false),
      )

      await applicationTest.step('Household supplement', async () => {
        await expectHeadingToBeVisible(
          page,
          householdSupplementFormMessage.shared.householdSupplement,
        )

        await page
          .getByRole('region', {
            name: label(
              householdSupplementFormMessage.info.householdSupplementHousing,
            ),
          })
          .getByRole('radio', {
            name: label(
              householdSupplementFormMessage.info
                .householdSupplementHousingOwner,
            ),
          })
          .click()

        await page
          .getByRole('region', {
            name: label(
              householdSupplementFormMessage.info
                .householdSupplementChildrenBetween18And25,
            ),
          })
          .getByRole('radio', {
            name: label(socialInsuranceAdministrationMessage.shared.no),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('Select period', () => selectPeriod(page))

      await applicationTest.step(
        'Check that additional documents header is visible',
        () => additionalAttachments(page),
      )

      await applicationTest.step('Write comment', () => writeComment(page))

      await applicationTest.step('Submit application', () =>
        submitApplication(page),
      )

      await applicationTest.step(
        'Check that conclusion screen header is visible',
        async () => {
          await expect(
            page
              .getByRole('heading', {
                name: label(
                  socialInsuranceAdministrationMessage.conclusionScreen
                    .receivedTitle,
                ),
              })
              .first(),
          ).toBeVisible()
        },
      )
    },
  )
})
