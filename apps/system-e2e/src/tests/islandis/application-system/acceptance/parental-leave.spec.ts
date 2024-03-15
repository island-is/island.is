import { BrowserContext, expect, test, Page } from '@playwright/test'
import {
  BaseAuthority,
  env,
  getEnvironmentBaseUrl,
  TestEnvironment,
  urls,
} from '../../../../support/urls'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import {
  EmailAccount,
  makeEmailAccount,
} from '../../../../support/email-account'
import { helpers } from '../../../../support/locator-helpers'
import { session } from '../../../../support/session'
import { setupXroadMocks } from './setup-xroad.mocks'

test.use({ baseURL: urls.islandisBaseUrl })

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
  const employerUrlMatch = email.html.match(/>(http?:.*)<\/p>/)
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
      name: 'Kennitala fyrirtækis',
    })
    .getByRole('textbox')
    // eslint-disable-next-line local-rules/disallow-kennitalas
    .type('5402696029')
  await proceed()

  await page
    .getByRole('button', {
      name: 'Samþykkja',
    })
    .click()

  await expect(page.getByRole('heading', { name: 'Takk fyrir' })).toBeVisible()
}

const applicationSystemApi: { [env in TestEnvironment]: string } = {
  dev: getEnvironmentBaseUrl(BaseAuthority.dev),
  staging: getEnvironmentBaseUrl(BaseAuthority.staging),
  prod: getEnvironmentBaseUrl(BaseAuthority.prod),
  local: 'http://localhost:9456',
}

test.describe('Parental leave', () => {
  let context: BrowserContext
  let applicant: EmailAccount
  let employer: EmailAccount
  let applicationID: string
  let submitApplicationSuccess: boolean

  test.beforeAll(async () => {
    applicant = await makeEmailAccount('applicant')
    employer = await makeEmailAccount('employer')
    submitApplicationSuccess = false
  })
  test.beforeEach(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: `${urls.islandisBaseUrl}/umsoknir/faedingarorlof`,
      phoneNumber: submitApplicationSuccess ? '0102989' : '0102399',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('Primary parent should be able to create application', async () => {
    const page = await context.newPage()
    await disablePreviousApplications(page)
    await disableI18n(page)
    await setupXroadMocks()

    const apiUrl = applicationSystemApi[env]

    await page.goto('/umsoknir/faedingarorlof', { waitUntil: 'load' })
    const { proceed } = helpers(page)

    // Mock data
    await expect(
      page.getByRole('heading', {
        name: 'Viltu nota gervigögn?',
      }),
    ).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Nei',
      })
      .click()
    await proceed()

    applicationID = page.url().split('/').slice(-1)[0]

    // Type of application
    await expect(
      page.getByRole('heading', {
        name: 'Tegund umsóknar',
      }),
    ).toBeVisible()
    await page.getByTestId('parental-leave').click()
    await proceed()

    // External Data
    await expect(
      page.getByRole('heading', {
        name: 'Sækja gögn',
      }),
    ).toBeVisible()
    await page.getByTestId('agree-to-data-providers').click()
    await proceed()

    // Child information
    await expect(
      page.getByRole('heading', {
        name: 'Upplýsingar um barn',
      }),
    ).toBeVisible()
    await page.getByTestId('child-0').click()
    await page
      .getByRole('radio', {
        name: 'Nei',
      })
      .click()
    await page.getByTestId('select-child').click()

    // Email address and telephone number
    await expect(
      page.getByRole('heading', {
        name: 'Netfang og símanúmer',
      }),
    ).toBeVisible()
    const emailBox = page.getByRole('textbox', {
      name: 'Netfang',
    })
    await emailBox.selectText()
    await emailBox.type(applicant.email)

    const phoneNumber = page.getByRole('textbox', {
      name: 'Símanúmer',
    })
    await phoneNumber.selectText()
    await phoneNumber.type('6555555')

    await page
      .getByRole('region', {
        name: 'Vinasamlegast veldu tungumál fyrir samskipti við sjóðinn',
      })
      .getByRole('radio', {
        name: 'Íslenska',
      })
      .click()
    await proceed()

    // Child's parents
    await expect(
      page.getByRole('heading', {
        name: 'Vinsamlegast staðfestu hitt foreldrið (ef það á við)',
      }),
    ).toBeVisible()
    await page
      .getByRole('region', {
        name: 'Hitt foreldrið',
      })
      .getByRole('radio')
      .first()
      .click()
    await proceed()

    // Payment information
    await expect(
      page.getByRole('heading', {
        name: 'Er allt eins og það á að vera?',
      }),
    ).toBeVisible()

    const paymentBank = page.getByRole('textbox', {
      name: 'Banki',
    })
    await paymentBank.selectText()
    await paymentBank.type('051226054678')

    await page.waitForResponse(`${apiUrl}/api/graphql?op=GetPensionFunds`)
    const pensionFund = page.getByRole('combobox', {
      name: `${'Lífeyrissjóður'} ${'Skrifaðu hér til að leita'}`,
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

    // Personal Allowance
    await expect(
      page.getByRole('heading', {
        name: 'Persónuafsláttur',
      }),
    ).toBeVisible()
    await page.getByTestId('use-personal-finance').click()
    await page.getByTestId('use-as-much-as-possible').click()
    await proceed()

    // Spouse's personal allowance
    await expect(
      page.getByRole('heading', {
        name: 'Beiðni um persónuafslátt frá maka',
      }),
    ).toBeVisible()
    await page.getByTestId('dont-use-personal-finance').click()
    await proceed()

    // Are you self employed?
    await expect(page.getByText('Ertu sjálfstætt starfandi?')).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Nei',
      })
      .click()
    await expect(page.getByText('Skrifaðu hér til að leita')).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Nei',
      })
      .nth(1)
      .click()
    await proceed()

    // Register an employer
    await expect(
      page.getByRole('heading', {
        name: 'Vinnuveitendur',
      }),
    ).toBeVisible()

    await page
      .getByRole('button', {
        name: 'Bæta við vinnuveitanda',
      })
      .click()

    await expect(
      page.getByRole('paragraph').filter({
        hasText: 'Skráning vinnuveitanda',
      }),
    ).toBeVisible()
    await page.getByTestId('employer-email').type(employer.email)
    await page.getByTestId('employer-phone-number').type('6555555')
    const employmentRatio = page.getByTestId('employment-ratio')
    await employmentRatio.type('100%')
    await employmentRatio.press('Enter')
    await page
      .getByRole('button', {
        name: 'Skrá vinnuveitanda',
      })
      .click()
    await proceed()

    // Additional documentation for application
    await expect(
      page.getByRole('heading', {
        name: 'Staðfesting',
      }),
    ).toBeVisible()
    await proceed()

    // These are your rights
    await expect(
      page.getByRole('heading', {
        name: 'Þetta eru réttindin þín',
      }),
    ).toBeVisible()
    await proceed()

    // Transferal of rights
    await expect(
      page.getByRole('heading', {
        name: 'Tilfærsla réttinda',
      }),
    ).toBeVisible()
    await page
      .getByRole('region', {
        name: 'Tilfærsla réttinda',
      })
      .getByRole('radio', {
        name: 'Ég vil ekki færa daga',
      })
      .click()
    await proceed()

    // Start of parental leave
    await expect(
      page.getByRole('heading', {
        name: 'Upphaf fæðingarorlofs',
      }),
    ).toBeVisible()
    await page
      .getByRole('region', {
        name: 'Upphaf fæðingarorlofs',
      })
      .getByRole('radio', {
        name: 'Skrifaðu hér til að leita',
      })
      .click()
    await proceed()

    // Leave duration
    await expect(
      page.getByRole('heading', {
        name: 'Lengd fæðingarorlofs',
      }),
    ).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Í fjölda mánaða',
      })
      .click()
    await proceed()

    await expect(
      page.getByRole('heading', {
        name: 'Lengd fæðingarorlofs',
      }),
    ).toBeVisible()
    await page
      .getByRole('button', {
        name: '6 months',
        exact: true,
      })
      .click()
    await proceed()

    // What percent off your employment ratio will you take for the leave?
    await expect(
      page.getByRole('heading', {
        name: 'Hversu hátt hlutfall viltu að fæðingarorlofið sé af starfshlutfalli þínu?',
      }),
    ).toBeVisible()
    const selectPercentageUse = page.getByTestId('select-percentage-use')
    await selectPercentageUse.focus()
    await page.keyboard.type('50%')
    await page.keyboard.press('Enter')
    await proceed()

    // Here is your current leave plan
    await expect(
      page.getByRole('button', {
        name: 'Bæta við tímabili',
      }),
    ).toBeVisible()
    await proceed()

    // Submit application
    await page
      .getByRole('button', {
        name: label(parentalLeaveFormMessages.confirmation.submitButton),
      })
      .click()

    await expect(
      page.getByRole('heading', {
        name: 'Til hamingju, hér að neðan eru næstu skref',
      }),
    ).toBeVisible()
    submitApplicationSuccess = true
    await getEmployerEmailAndApprove(employer, page)
  })

  test('Other parent should be able to create application', async () => {
    // Skip this test if primary parent was unable to submit application
    test.skip(
      submitApplicationSuccess !== true,
      'Primary parent unable to submit application',
    )
    const page = await context.newPage()
    await disablePreviousApplications(page)
    await disableI18n(page)
    await setupXroadMocks()

    const apiUrl = applicationSystemApi[env]

    await page.goto('/umsoknir/faedingarorlof', { waitUntil: 'load' })
    const { proceed } = helpers(page)

    // Mock data
    await expect(
      page.getByRole('heading', {
        name: 'Viltu nota gervigögn?',
      }),
    ).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Já',
      })
      .click()
    await page
      .getByRole('radio', {
        name: 'Hitt foreldri',
      })
      .click()
    await page
      .getByRole('region', {
        name: 'Ég vil byrja frá raunverulegum fæðingardegi',
      })
      .getByRole('radio', {
        name: 'Já',
      })
      .click()

    const mockDataApplicationID = page.getByRole('textbox', {
      name: 'Umsóknarnúmer frá aðalforeldri',
    })
    await mockDataApplicationID.selectText()
    await mockDataApplicationID.type(applicationID)
    await proceed()

    // Type of application
    await expect(
      page.getByRole('heading', {
        name: 'Tegund umsóknar',
      }),
    ).toBeVisible()
    await page.getByTestId('parental-leave').click()
    await proceed()

    // External Data
    await expect(
      page.getByRole('heading', {
        name: 'Sækja gögn',
      }),
    ).toBeVisible()
    await page.getByTestId('agree-to-data-providers').click()
    await proceed()

    // Child information
    await expect(
      page.getByRole('heading', {
        name: 'Upplýsingar um barn',
      }),
    ).toBeVisible()
    await page.getByTestId('child-0').click()
    await page.getByTestId('select-child').click()

    // Email address and telephone number
    await expect(
      page.getByRole('heading', {
        name: 'Netfang og símanúmer',
      }),
    ).toBeVisible()
    const emailBox = page.getByRole('textbox', {
      name: 'Netfang',
    })
    await emailBox.selectText()
    await emailBox.type(applicant.email)

    const phoneNumber = page.getByRole('textbox', {
      name: 'Símanúmer',
    })
    await phoneNumber.selectText()
    await phoneNumber.type('6555555')

    await page
      .getByRole('region', {
        name: 'Vinasamlegast veldu tungumál fyrir samskipti við sjóðinn',
      })
      .getByRole('radio', {
        name: 'Íslenska',
      })
      .click()
    await proceed()

    // Payment information
    await expect(
      page.getByRole('heading', {
        name: 'Er allt eins og það á að vera?',
      }),
    ).toBeVisible()

    const paymentBank = page.getByRole('textbox', {
      name: 'Banki',
    })
    await paymentBank.selectText()
    await paymentBank.type('051226054678')

    await page.waitForResponse(`${apiUrl}/api/graphql?op=GetPensionFunds`)
    const pensionFund = page.getByRole('combobox', {
      name: `${'Lífeyrissjóður'} ${'Skrifaðu hér til að leita'}`,
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

    // Personal Allowance
    await expect(
      page.getByRole('heading', {
        name: 'Persónuafsláttur',
      }),
    ).toBeVisible()
    await page.getByTestId('use-personal-finance').click()
    await page.getByTestId('use-as-much-as-possible').click()
    await proceed()

    // Are you self employed?
    await expect(page.getByText('Ertu sjálfstætt starfandi?')).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Nei',
      })
      .click()
    await expect(page.getByText('Skrifaðu hér til að leita')).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Nei',
      })
      .nth(1)
      .click()
    await proceed()

    // Register an employer
    await expect(
      page.getByRole('heading', {
        name: 'Vinnuveitendur',
      }),
    ).toBeVisible()

    await page
      .getByRole('button', {
        name: 'Bæta við vinnuveitanda',
      })
      .click()

    await expect(
      page.getByRole('paragraph').filter({
        hasText: 'Skráning vinnuveitanda',
      }),
    ).toBeVisible()
    await page.getByTestId('employer-email').type(employer.email)
    await page.getByTestId('employer-phone-number').type('6555555')
    const employmentRatio = page.getByTestId('employment-ratio')
    await employmentRatio.type('100%')
    await employmentRatio.press('Enter')
    await page
      .getByRole('button', {
        name: 'Skrá vinnuveitanda',
      })
      .click()
    await proceed()

    // Additional documentation for application
    await expect(
      page.getByRole('heading', {
        name: 'Staðfesting',
      }),
    ).toBeVisible()
    await proceed()

    // Start of parental leave
    await expect(
      page.getByRole('heading', {
        name: 'Upphaf fæðingarorlofs',
      }),
    ).toBeVisible()
    await page
      .getByRole('region', {
        name: 'Upphaf fæðingarorlofs',
      })
      .getByRole('radio', {
        name: 'Skrifaðu hér til að leita',
      })
      .click()
    await proceed()

    // Leave duration
    await expect(
      page.getByRole('heading', {
        name: 'Lengd fæðingarorlofs',
      }),
    ).toBeVisible()
    await page
      .getByRole('radio', {
        name: 'Í fjölda mánaða',
      })
      .click()
    await proceed()

    await expect(
      page.getByRole('heading', {
        name: 'Lengd fæðingarorlofs',
      }),
    ).toBeVisible()
    await page
      .getByRole('button', {
        name: '3 months',
        exact: true,
      })
      .click()
    await proceed()

    // What percent off your employment ratio will you take for the leave?
    await expect(
      page.getByRole('heading', {
        name: 'Hversu hátt hlutfall viltu að fæðingarorlofið sé af starfshlutfalli þínu?',
      }),
    ).toBeVisible()
    const selectPercentageUse = page.getByTestId('select-percentage-use')
    await selectPercentageUse.focus()
    await page.keyboard.type('50%')
    await page.keyboard.press('Enter')
    await proceed()

    // Here is your current leave plan
    await expect(
      page.getByRole('button', {
        name: 'Bæta við tímabili',
      }),
    ).toBeVisible()
    await proceed()

    // Submit application
    await page
      .getByRole('button', {
        name: label(parentalLeaveFormMessages.confirmation.submitButton),
      })
      .click()

    await expect(
      page.getByRole('heading', {
        name: 'Ég vil byrja frá raunverulegum fæðingardegi',
      }),
    ).toBeVisible()
    await getEmployerEmailAndApprove(employer, page)
  })
})
