import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { test as base, expect, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../../support/disablers'
import { label } from '../../../../../support/i18n'
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

const homeUrl = '/umsoknir/felagslegur-vidbotarstudningur'

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
    await expect(applicationPage).toBeApplication(
      'felagslegur-vidbotarstudningur',
    )
    await setupXroadMocks()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Additional support for the elderly', () => {
  applicationTest(
    'Should complete Additional support for the elderly application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage

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
        fillPaymentInfo(page, true),
      )

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
                    .receivedAwaitingIncomePlanTitle,
                ),
              })
              .first(),
          ).toBeVisible()
        },
      )
    },
  )
})
