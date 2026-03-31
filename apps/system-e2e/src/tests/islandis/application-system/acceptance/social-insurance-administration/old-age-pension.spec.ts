import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { oldAgePensionFormMessage } from '@island.is/application/templates/social-insurance-administration/old-age-pension'
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

const oldAgeApplicationTest = async (page: Page, applicationType: string) => {
  const { proceed } = helpers(page)

  await applicationTest.step('Select type of application', async () => {
    await expectHeadingToBeVisible(
      page,
      oldAgePensionFormMessage.pre.applicationTypeTitle,
    )
    await page.getByTestId(applicationType).click()
    await proceed()
  })

  await applicationTest.step('Agree to data providers', async () => {
    await expectHeadingToBeVisible(
      page,
      socialInsuranceAdministrationMessage.pre.externalDataSection,
    )
    await page.getByTestId('agree-to-data-providers').click()
    await proceed()
  })

  await applicationTest.step(
    'Answer pension fund question and start application',
    async () => {
      await expectHeadingToBeVisible(
        page,
        oldAgePensionFormMessage.pre.questionTitle,
      )
      await page
        .getByRole('radio', {
          name: label(socialInsuranceAdministrationMessage.shared.yes),
        })
        .click()
      await page
        .getByRole('button', {
          name: label(
            socialInsuranceAdministrationMessage.pre.startApplication,
          ),
        })
        .click()
    },
  )

  await applicationTest.step('Fill in applicant info', () =>
    fillApplicantInfo(page),
  )

  await applicationTest.step('Fill in payment information', () =>
    fillPaymentInfo(page, true),
  )

  await applicationTest.step('One payment per year', async () => {
    await expectHeadingToBeVisible(
      page,
      oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
    )
    await page
      .getByRole('radio', {
        name: label(socialInsuranceAdministrationMessage.shared.no),
      })
      .click()
    await proceed()
  })

  await applicationTest.step('View residence history', async () => {
    await expectHeadingToBeVisible(
      page,
      oldAgePensionFormMessage.residence.residenceHistoryTitle,
    )
    await proceed()
  })

  if (applicationType === 'half-old-age-pension') {
    await applicationTest.step('Self-employed or employee', async () => {
      await expectHeadingToBeVisible(
        page,
        oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
      )

      await page
        .getByRole('radio', {
          name: label(oldAgePensionFormMessage.employer.employee),
        })
        .click()
      await proceed()
    })

    await applicationTest.step('Employer registration', async () => {
      await expectHeadingToBeVisible(
        page,
        oldAgePensionFormMessage.employer.registrationTitle,
      )

      const employerEmail = page.getByRole('textbox', {
        name: label(oldAgePensionFormMessage.employer.email),
      })
      await employerEmail.selectText()
      await employerEmail.fill('mockEmail@mail.is')

      await page
        .getByRole('radio', {
          name: label(oldAgePensionFormMessage.employer.ratioYearly),
        })
        .click()

      const employmentRatio = page.getByRole('textbox', {
        name: label(oldAgePensionFormMessage.employer.ratio),
      })
      await employmentRatio.selectText()
      await employmentRatio.fill('50')
      await proceed()
    })

    await applicationTest.step('Employers', async () => {
      await expectHeadingToBeVisible(
        page,
        oldAgePensionFormMessage.employer.employerTitle,
      )
      await proceed()
    })
  }

  await applicationTest.step('Select period', () => selectPeriod(page))

  await applicationTest.step(
    'Check that attachments for pension payments header is visible',
    async () => {
      await expectHeadingToBeVisible(
        page,
        oldAgePensionFormMessage.fileUpload.pensionFileTitle,
      )
      await proceed()
    },
  )

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
}

const homeUrl = '/umsoknir/ellilifeyrir'

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

applicationTest.describe('Old Age Pension', () => {
  applicationTest(
    'Should complete Old Age Pension application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage

      await oldAgeApplicationTest(page, 'old-age-pension')
    },
  )
})

applicationTest.describe('Half Old Age Pension', () => {
  applicationTest(
    'Should complete Half Old Age Pension application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage

      await oldAgeApplicationTest(page, 'half-old-age-pension')
    },
  )
})
