import { coreMessages } from '@island.is/application/core/messages'
import {
  employerFormMessages,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave/messages'
import { test as base, expect, Page } from '@playwright/test'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import formatISO from 'date-fns/formatISO'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import {
  EmailAccount,
  makeEmailAccount,
} from '../../../../support/email-account'
import { label } from '../../../../support/i18n'
import { helpers } from '../../../../support/locator-helpers'
import { session } from '../../../../support/session'
import {
  BaseAuthority,
  env,
  getEnvironmentBaseUrl,
  TestEnvironment,
} from '../../../../support/urls'
import { setupXroadMocks } from './setup-xroad.mocks'

const selectTypeOfApplication = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.applicationTypeTitle),
    }),
  ).toBeVisible()
  await page.getByTestId('parental-leave').click()
  await proceed()
}

const agreeToDataProviders = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.introductionProvider),
    }),
  ).toBeVisible()
  await page.getByTestId('agree-to-data-providers').click()
  await proceed()
}

const fillApplicantInfo = async (page: Page, applicant: EmailAccount) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.applicant.title),
    }),
  ).toBeVisible()
  const emailBox = page.getByRole('textbox', {
    name: label(parentalLeaveFormMessages.applicant.email),
  })
  await emailBox.selectText()
  await emailBox.fill(applicant.email)

  const phoneNumber = page.getByRole('textbox', {
    name: label(parentalLeaveFormMessages.applicant.phoneNumber),
  })
  await phoneNumber.selectText()
  await phoneNumber.fill('6555555')

  await page
    .getByRole('region', {
      name: label(parentalLeaveFormMessages.applicant.languageTitle),
    })
    .getByRole('radio', {
      name: label(parentalLeaveFormMessages.applicant.icelandic),
    })
    .click()
  await proceed()
}

const fillPaymentInformation = async (page: Page) => {
  const apiUrl = applicationSystemApi[env]

  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.paymentInformationName),
    }),
  ).toBeVisible()

  const paymentBank = page.getByRole('textbox', {
    name: label(parentalLeaveFormMessages.shared.paymentInformationBank),
  })
  await paymentBank.selectText()
  await paymentBank.fill('051226054678')

  await page.waitForResponse(`${apiUrl}/api/graphql?op=GetPensionFunds`)
  const pensionFund = page.getByRole('combobox', {
    name: `${label(parentalLeaveFormMessages.shared.pensionFund)} ${label(
      parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
    )}`,
  })
  await pensionFund.focus()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  await page.getByTestId('use-union').click()
  await page.waitForResponse(`${apiUrl}/api/graphql?op=GetUnions`)
  const paymentUnion = page.getByTestId('payments-union')
  await paymentUnion.focus()
  await page.keyboard.type('VR')
  await page.keyboard.press('Enter')

  await page.getByTestId('use-private-pension-fund').click()
  const privatePensionFund = page.getByTestId('private-pension-fund')
  await privatePensionFund.focus()
  await privatePensionFund.press('ArrowDown')
  await page
    .locator('#react-select-payments\\.privatePensionFund-option-0')
    .click()
  await page.getByTestId('private-pension-fund-ratio').press('ArrowDown')
  await page
    .locator('#react-select-payments\\.privatePensionFundPercentage-option-0')
    .click()
  await proceed()
}

const fillPersonalAllowance = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.personalAllowance.title),
    }),
  ).toBeVisible()
  await page.getByTestId('use-personal-finance').click()
  await page.getByTestId('use-as-much-as-possible').click()
  await proceed()
}

const selfEmployed = async (page: Page) => {
  const { proceed } = helpers(page)
  await expect(
    page.getByText(label(parentalLeaveFormMessages.selfEmployed.title)),
  ).toBeVisible()
  await page
    .getByRole('radio', {
      name: label(parentalLeaveFormMessages.shared.noOptionLabel),
    })
    .click()
  await expect(
    page.getByText(
      label(
        parentalLeaveFormMessages.employer.isReceivingUnemploymentBenefitsTitle,
      ),
    ),
  ).toBeVisible()
  await page
    .getByRole('radio', {
      name: label(parentalLeaveFormMessages.shared.noOptionLabel),
    })
    .nth(1)
    .click()
  await proceed()
}

const registerEmployer = async (page: Page, employer: EmailAccount) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.employer.title),
    }),
  ).toBeVisible()

  await page
    .getByRole('button', {
      name: label(parentalLeaveFormMessages.employer.addEmployer),
    })
    .click()

  await expect(
    page.getByRole('paragraph').filter({
      hasText: label(parentalLeaveFormMessages.employer.registration),
    }),
  ).toBeVisible()
  await page.getByTestId('employer-email').fill(employer.email)
  const employmentRatio = page.getByTestId('employment-ratio')
  await employmentRatio.fill('100%')
  await employmentRatio.press('Enter')
  await page
    .getByRole('button', {
      name: label(parentalLeaveFormMessages.employer.registerEmployer),
    })
    .click()
  await proceed()
}

const startOfParentalLeave = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.firstPeriodStart.title),
    }),
  ).toBeVisible()
  await page
    .getByRole('region', {
      name: label(parentalLeaveFormMessages.firstPeriodStart.title),
    })
    .getByRole('radio', {
      name: label(parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption),
    })
    .click()
  await proceed()
}

const leaveDuration = async (page: Page, testId: string) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.duration.title),
    }),
  ).toBeVisible()
  await page
    .getByRole('radio', {
      name: label(parentalLeaveFormMessages.duration.monthsOption),
    })
    .click()
  await proceed()

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.duration.title),
    }),
  ).toBeVisible()

  await page.getByTestId(testId).click()
  await proceed()
}

const employmentRatio = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.ratio.title),
    }),
  ).toBeVisible()
  const selectPercentageUse = page.getByTestId('select-percentage-use')
  await selectPercentageUse.focus()
  await page.keyboard.type('50%')
  await page.keyboard.press('Enter')
  await proceed()
}

const currentLeavePlan = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('button', {
      name: label(parentalLeaveFormMessages.leavePlan.addAnother),
    }),
  ).toBeVisible()
  await proceed()
}

const additionalDocumentation = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.attachmentScreen.title),
    }),
  ).toBeVisible()
  await proceed()
}

const comment = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.applicant.commentSection),
    }),
  ).toBeVisible()
  await page
    .getByPlaceholder(
      label(parentalLeaveFormMessages.applicant.commentPlaceholder),
    )
    .fill(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
    )
  await proceed()
}

const submitApplication = async (page: Page) => {
  await page
    .getByRole('button', {
      name: label(parentalLeaveFormMessages.confirmation.submitButton),
    })
    .click()

  await expect(
    page.getByRole('heading', {
      name: label(parentalLeaveFormMessages.finalScreen.title),
    }),
  ).toBeVisible()
}

const getEmployerEmailAndApprove = async (
  employer: EmailAccount,
  page: Page,
) => {
  const { proceed } = helpers(page)

  const email = await employer.getLastEmail(6)

  // Require email
  if (!email || typeof email.html !== 'string') {
    throw new Error('Email not found, test incomplete')
  }
  const employerUrlMatch = email.html.match(/<a href="(http?:.*?)"/)
  if (employerUrlMatch?.length != 2)
    throw new Error(
      'Email does not contain the url to approve the parental leave application',
    )
  const employerUrl = employerUrlMatch[1]
  if (!employerUrl)
    throw new Error(`Could not find url for employer in email: ${email.html}`)
  await page.goto(employerUrl, { waitUntil: 'load' })

  await page
    .getByRole('region', {
      name: label(employerFormMessages.employerNationalRegistryIdSection),
    })
    .getByRole('textbox')
    // eslint-disable-next-line local-rules/disallow-kennitalas
    .fill('5402696029')
  await proceed()

  await page
    .getByRole('button', {
      name: label(coreMessages.buttonApprove),
    })
    .click()

  await expect(
    page.getByRole('heading', { name: label(coreMessages.thanks) }),
  ).toBeVisible()
}

const homeUrl = '/umsoknir/faedingarorlof'

const applicationSystemApi: { [env in TestEnvironment]: string } = {
  dev: getEnvironmentBaseUrl(BaseAuthority.dev),
  staging: getEnvironmentBaseUrl(BaseAuthority.staging),
  prod: getEnvironmentBaseUrl(BaseAuthority.prod),
  local: 'http://localhost:9456',
}

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

applicationTest.describe('Parental leave', () => {
  let applicant: EmailAccount
  let employer: EmailAccount
  let estimatedDateOfBirth: string

  applicationTest.beforeAll(async () => {
    applicant = await makeEmailAccount('applicant')
    employer = await makeEmailAccount('employer')

    const babyBDayRandomFactor = Math.ceil(Math.random() * 85)
    estimatedDateOfBirth = formatISO(
      addDays(addMonths(new Date(), 6), babyBDayRandomFactor),
      {
        representation: 'date',
      },
    )
  })

  applicationTest(
    'Primary parent should complete Parental leave application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Mock data', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.shared.mockDataUse),
          }),
        ).toBeVisible()
        await page
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.yesOptionLabel),
          })
          .click()
        await page
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.mockDataMother),
          })
          .click()

        await page
          .getByRole('textbox', {
            name: label(
              parentalLeaveFormMessages.shared.mockDataEstimatedDateOfBirth,
            ),
          })
          .fill(estimatedDateOfBirth)
        await proceed()
      })

      await applicationTest.step('Select type of application', () =>
        selectTypeOfApplication(page),
      )

      await applicationTest.step('Agree to data providers', () =>
        agreeToDataProviders(page),
      )

      await applicationTest.step('Child information', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.selectChild.screenTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('child-0').click()
        await page
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.noOptionLabel),
          })
          .click()
        await page.getByTestId('select-child').click()
      })

      await applicationTest.step(
        'Fill in applicant email address and telephone number',
        () => fillApplicantInfo(page, applicant),
      )

      await applicationTest.step("Child's parents", async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.shared.otherParentTitle),
          }),
        ).toBeVisible()
        await proceed()
      })

      await applicationTest.step('Fill in payment information', () =>
        fillPaymentInformation(page),
      )

      await applicationTest.step('Fill in Personal allowance', () =>
        fillPersonalAllowance(page),
      )

      await applicationTest.step("Spouse's personal allowance", async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              parentalLeaveFormMessages.personalAllowance.spouseTitle,
            ),
          }),
        ).toBeVisible()
        await page.getByTestId('dont-use-personal-finance').click()
        await proceed()
      })

      await applicationTest.step('Are you self employed?', () =>
        selfEmployed(page),
      )

      await applicationTest.step('Register an employer', () =>
        registerEmployer(page, employer),
      )

      await applicationTest.step('These are your rights', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.shared.theseAreYourRights),
          }),
        ).toBeVisible()
        await proceed()
      })

      await applicationTest.step('Transferal of rights', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.shared.transferRightsTitle),
          }),
        ).toBeVisible()
        await page
          .getByRole('region', {
            name: label(parentalLeaveFormMessages.shared.transferRightsTitle),
          })
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.transferRightsNone),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('Start of parental leave', () =>
        startOfParentalLeave(page),
      )

      await applicationTest.step('Leave duration', () =>
        leaveDuration(page, 'slider-step-6'),
      )

      await applicationTest.step(
        'What percent off your employment ratio will you take for the leave?',
        () => employmentRatio(page),
      )

      await applicationTest.step('Here is your current leave plan', () =>
        currentLeavePlan(page),
      )

      await applicationTest.step(
        'Additional documentation for application',
        () => additionalDocumentation(page),
      )

      await applicationTest.step('Write comment', () => comment(page))

      await applicationTest.step('Submit application', () =>
        submitApplication(page),
      )

      await applicationTest.step('Employer approval', async () => {
        await getEmployerEmailAndApprove(employer, page)
      })
    },
  )

  applicationTest(
    'Other parent should complete Parental leave application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Mock data', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.shared.mockDataUse),
          }),
        ).toBeVisible()
        await page
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.yesOptionLabel),
          })
          .click()
        await page
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.mockDataOtherParent),
          })
          .click()
        await page
          .getByRole('region', {
            name: label(
              parentalLeaveFormMessages.shared.mockDataExistingApplication,
            ),
          })
          .getByRole('radio', {
            name: 'Nei',
          })
          .click()

        await page
          .getByRole('region', {
            name: label(parentalLeaveFormMessages.shared.noChildrenFoundLabel),
          })
          .getByRole('radio', {
            name: label(parentalLeaveFormMessages.shared.noOptionLabel),
          })
          .click()

        await page
          .getByRole('textbox', {
            name: label(
              parentalLeaveFormMessages.shared.mockDataEstimatedDateOfBirth,
            ),
          })
          .fill(estimatedDateOfBirth)

        await page
          .getByRole('textbox', {
            name: label(
              parentalLeaveFormMessages.shared.mockDataPrimaryParentNationalID,
            ),
          })
          .fill('0101303019')
        await proceed()
      })

      await applicationTest.step('Select type of application', () =>
        selectTypeOfApplication(page),
      )

      await applicationTest.step('Agree to data providers', () =>
        agreeToDataProviders(page),
      )

      await applicationTest.step('Child information', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(parentalLeaveFormMessages.selectChild.screenTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('child-0').click()
        await page.getByTestId('select-child').click()
      })

      await applicationTest.step(
        'Fill in applicant email address and telephone number',
        () => fillApplicantInfo(page, applicant),
      )

      await applicationTest.step('Fill in payment information', () =>
        fillPaymentInformation(page),
      )

      await applicationTest.step('Fill in Personal allowance', () =>
        fillPersonalAllowance(page),
      )

      await applicationTest.step('Are you self employed?', () =>
        selfEmployed(page),
      )

      await applicationTest.step('Register an employer', () =>
        registerEmployer(page, employer),
      )

      await applicationTest.step('Start of parental leave', () =>
        startOfParentalLeave(page),
      )

      await applicationTest.step('Leave duration', () =>
        leaveDuration(page, 'slider-step-3'),
      )

      await applicationTest.step(
        'What percent off your employment ratio will you take for the leave?',
        () => employmentRatio(page),
      )

      await applicationTest.step('Here is your current leave plan', () =>
        currentLeavePlan(page),
      )

      await applicationTest.step(
        'Additional documentation for application',
        () => additionalDocumentation(page),
      )

      await applicationTest.step('Write comment', () => comment(page))

      await applicationTest.step('Submit application', () =>
        submitApplication(page),
      )

      await applicationTest.step('Employer approval', async () => {
        await getEmployerEmailAndApprove(employer, page)
      })
    },
  )
})
