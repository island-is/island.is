import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { pensionSupplementFormMessage } from '@island.is/application/templates/social-insurance-administration/pension-supplement'
import { test as base, expect, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
  label,
  session,
} from '@island.is/testing/e2e'
import { setupXroadMocks } from '../setup-xroad.mocks'
import {
  additionalAttachments,
  expectHeadingToBeVisible,
  fillApplicantInfo,
  fillPaymentInfo,
  selectPeriod,
  submitApplication,
  writeComment,
  proceed,
} from './shared'

const homeUrl = '/umsoknir/uppbot-a-lifeyri'

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
    await expect(applicationPage).toBeApplication('uppbot-a-lifeyri')
    await setupXroadMocks()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Pension Supplement', () => {
  applicationTest(
    'Should complete Pension Supplement application successfully',
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
        fillPaymentInfo(page, false),
      )

      await applicationTest.step('Select application reason', async () => {
        await expectHeadingToBeVisible(
          page,
          pensionSupplementFormMessage.applicationReason.title,
        )

        await page
          .getByRole('region', {
            name: label(pensionSupplementFormMessage.applicationReason.title),
          })
          .getByRole('checkbox', {
            name: label(
              pensionSupplementFormMessage.applicationReason.medicineCost,
            ),
          })
          .click()

        await proceed(page)
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
