import { BrowserContext, Page, expect, test } from '@playwright/test'
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
import { helpers } from '../../../../support/locator-helpers'
import { session } from '../../../../support/session'
import {
  BaseAuthority,
  TestEnvironment,
  env,
  getEnvironmentBaseUrl,
  urls,
} from '../../../../support/urls'
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
      name: 'Kennitala fyrirtækis',
    })
    .getByRole('textbox')
    // eslint-disable-next-line local-rules/disallow-kennitalas
    .fill('5402696029')
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

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: `${urls.islandisBaseUrl}/umsoknir/faedingarorlof`,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })
    applicant = await makeEmailAccount('applicant')
    employer = await makeEmailAccount('employer')
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

    await test.step('Mock data', async () => {
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
          name: 'Móðir',
        })
        .click()

      const babyBDayRandomFactor = Math.ceil(Math.random() * 85)
      const estimatedDateOfBirth = formatISO(
        addDays(addMonths(new Date(), 6), babyBDayRandomFactor),
        {
          representation: 'date',
        },
      )
      await page
        .getByRole('textbox', {
          name: 'Áætlaður fæðingardagur:',
        })
        .fill(estimatedDateOfBirth)
      await proceed()
    })

    await test.step('Type of application', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Tegund umsóknar',
        }),
      ).toBeVisible()
      await page.getByTestId('parental-leave').click()
      await proceed()
    })

    await test.step('External Data', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Sækja gögn',
        }),
      ).toBeVisible()
      await page.getByTestId('agree-to-data-providers').click()
      await proceed()
    })

    await test.step('Child information', async () => {
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
    })

    await test.step('Email address and telephone number', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Netfang og símanúmer',
        }),
      ).toBeVisible()
      const emailBox = page.getByRole('textbox', {
        name: 'Netfang',
      })
      await emailBox.selectText()
      await emailBox.fill(applicant.email)

      const phoneNumber = page.getByRole('textbox', {
        name: 'Símanúmer',
      })
      await phoneNumber.selectText()
      await phoneNumber.fill('6555555')

      await page
        .getByRole('region', {
          name: 'Vinasamlegast veldu tungumál fyrir samskipti við sjóðinn',
        })
        .getByRole('radio', {
          name: 'Íslenska',
        })
        .click()
      await proceed()
    })

    await test.step("Child's parents", async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Vinsamlegast staðfestu hitt foreldrið (ef það á við)',
        }),
      ).toBeVisible()
      await proceed()
    })

    await test.step('Payment information', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Er allt eins og það á að vera?',
        }),
      ).toBeVisible()

      const paymentBank = page.getByRole('textbox', {
        name: 'Banki',
      })
      await paymentBank.selectText()
      await paymentBank.fill('051226054678')

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
        .locator(
          '#react-select-payments\\.privatePensionFundPercentage-option-0',
        )
        .click()
      await proceed()
    })

    await test.step('Personal Allowance', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Persónuafsláttur',
        }),
      ).toBeVisible()
      await page.getByTestId('use-personal-finance').click()
      await page.getByTestId('use-as-much-as-possible').click()
      await proceed()
    })

    await test.step("Spouse's personal allowance", async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Beiðni um persónuafslátt frá maka',
        }),
      ).toBeVisible()
      await page.getByTestId('dont-use-personal-finance').click()
      await proceed()
    })

    await test.step('Are you self employed?', async () => {
      await expect(page.getByText('Ertu sjálfstætt starfandi?')).toBeVisible()
      await page
        .getByRole('radio', {
          name: 'Nei',
        })
        .click()
      await expect(page.getByText('Ertu að þiggja bætur?')).toBeVisible()
      await page
        .getByRole('radio', {
          name: 'Nei',
        })
        .nth(1)
        .click()
      await proceed()
    })

    await test.step('Register an employer', async () => {
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
      await page.getByTestId('employer-email').fill(employer.email)
      const employmentRatio = page.getByTestId('employment-ratio')
      await employmentRatio.fill('100%')
      await employmentRatio.press('Enter')
      await page
        .getByRole('button', {
          name: 'Skrá vinnuveitanda',
        })
        .click()
      await proceed()
    })

    await test.step('These are your rights', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Þetta eru réttindin þín',
        }),
      ).toBeVisible()
      await proceed()
    })

    await test.step('Transferal of rights', async () => {
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
    })

    await test.step('Start of parental leave', async () => {
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
          name: 'Ég vil byrja frá raunverulegum fæðingardegi',
        })
        .click()
      await proceed()
    })

    await test.step('Leave duration', async () => {
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
    })

    await test.step(
      'What percent off your employment ratio will you take for the leave?',
      async () => {
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
      },
    )

    await test.step(' Here is your current leave plan', async () => {
      await expect(
        page.getByRole('button', {
          name: 'Bæta við tímabili',
        }),
      ).toBeVisible()
      await proceed()
    })

    await test.step('Additional documentation for application', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Viðbótargögn með umsókn',
        }),
      ).toBeVisible()
      await proceed()
    })

    await test.step('Comment', async () => {
      await expect(
        page.getByRole('heading', { name: 'Athugasemd' }),
      ).toBeVisible()
      await page
        .getByPlaceholder('Skrifaðu athugasemd hér')
        .fill(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
        )
      await proceed()
    })

    await test.step('Submit application', async () => {
      await page
        .getByRole('button', {
          name: 'Senda inn umsókn',
        })
        .click()

      await expect(
        page.getByRole('heading', {
          name: 'Til hamingju, hér að neðan eru næstu skref',
        }),
      ).toBeVisible()
    })

    await test.step('Employer approval', async () => {
      await getEmployerEmailAndApprove(employer, page)
    })
  })

  test('Other parent should be able to create application', async () => {
    const page = await context.newPage()
    await disablePreviousApplications(page)
    await disableI18n(page)
    await setupXroadMocks()

    const apiUrl = applicationSystemApi[env]

    await page.goto('/umsoknir/faedingarorlof', { waitUntil: 'load' })
    const { proceed } = helpers(page)

    await test.step('Mock data', async () => {
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
          name: 'Notaðu núverandi umsókn frá aðalforeldra',
        })
        .getByRole('radio', {
          name: 'Nei',
        })
        .click()

      await page
        .getByRole('region', {
          name: 'Viltu búa til umsókn vegna varanlegst fóstur, ættleiðingu eða föður án móður?',
        })
        .getByRole('radio', {
          name: 'Nei',
        })
        .click()

      const babyBDayRandomFactor = Math.ceil(Math.random() * 85)
      const estimatedDateOfBirth = formatISO(
        addDays(addMonths(new Date(), 6), babyBDayRandomFactor),
        {
          representation: 'date',
        },
      )
      await page
        .getByRole('textbox', {
          name: 'Áætlaður fæðingardagur:',
        })
        .fill(estimatedDateOfBirth)

      await page
        .getByRole('textbox', {
          name: 'Kennitala móður:',
        })
        .fill('0101303019')
      await proceed()
    })

    await test.step('Type of application', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Tegund umsóknar',
        }),
      ).toBeVisible()
      await page.getByTestId('parental-leave').click()
      await proceed()
    })

    await test.step('External Data', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Sækja gögn',
        }),
      ).toBeVisible()
      await page.getByTestId('agree-to-data-providers').click()
      await proceed()
    })

    await test.step('Child information', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Upplýsingar um barn',
        }),
      ).toBeVisible()
      await page.getByTestId('child-0').click()
      await page.getByTestId('select-child').click()
    })

    await test.step('Email address and telephone number', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Netfang og símanúmer',
        }),
      ).toBeVisible()
      const emailBox = page.getByRole('textbox', {
        name: 'Netfang',
      })
      await emailBox.selectText()
      await emailBox.fill(applicant.email)

      const phoneNumber = page.getByRole('textbox', {
        name: 'Símanúmer',
      })
      await phoneNumber.selectText()
      await phoneNumber.fill('6555555')

      await page
        .getByRole('region', {
          name: 'Vinasamlegast veldu tungumál fyrir samskipti við sjóðinn',
        })
        .getByRole('radio', {
          name: 'Íslenska',
        })
        .click()
      await proceed()
    })

    await test.step('Payment information', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Er allt eins og það á að vera?',
        }),
      ).toBeVisible()

      const paymentBank = page.getByRole('textbox', {
        name: 'Banki',
      })
      await paymentBank.selectText()
      await paymentBank.fill('051226054678')

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
        .locator(
          '#react-select-payments\\.privatePensionFundPercentage-option-0',
        )
        .click()
      await proceed()
    })

    await test.step('Personal Allowance', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Persónuafsláttur',
        }),
      ).toBeVisible()
      await page.getByTestId('use-personal-finance').click()
      await page.getByTestId('use-as-much-as-possible').click()
      await proceed()
    })

    await test.step('Are you self employed?', async () => {
      await expect(page.getByText('Ertu sjálfstætt starfandi?')).toBeVisible()
      await page
        .getByRole('radio', {
          name: 'Nei',
        })
        .click()
      await expect(page.getByText('Ertu að þiggja bætur?')).toBeVisible()
      await page
        .getByRole('radio', {
          name: 'Nei',
        })
        .nth(1)
        .click()
      await proceed()
    })

    await test.step('Register an employer', async () => {
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
      await page.getByTestId('employer-email').fill(employer.email)
      const employmentRatio = page.getByTestId('employment-ratio')
      await employmentRatio.fill('100%')
      await employmentRatio.press('Enter')
      await page
        .getByRole('button', {
          name: 'Skrá vinnuveitanda',
        })
        .click()
      await proceed()
    })

    await test.step('Start of parental leave', async () => {
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
          name: 'Ég vil byrja frá raunverulegum fæðingardegi',
        })
        .click()
      await proceed()
    })

    await test.step('Leave duration', async () => {
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
    })

    await test.step(
      'What percent off your employment ratio will you take for the leave?',
      async () => {
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
      },
    )

    await test.step('Here is your current leave plan', async () => {
      await expect(
        page.getByRole('button', {
          name: 'Bæta við tímabili',
        }),
      ).toBeVisible()
      await proceed()
    })

    await test.step('Additional documentation for application', async () => {
      await expect(
        page.getByRole('heading', {
          name: 'Viðbótargögn með umsókn',
        }),
      ).toBeVisible()
      await proceed()
    })

    await test.step('Comment', async () => {
      await expect(
        page.getByRole('heading', { name: 'Athugasemd' }),
      ).toBeVisible()
      await page
        .getByPlaceholder('Skrifaðu athugasemd hér')
        .fill(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
        )
      await proceed()
    })

    await test.step('Submit application', async () => {
      await page
        .getByRole('button', {
          name: 'Senda inn umsókn',
        })
        .click()

      await expect(
        page.getByRole('heading', {
          name: 'Til hamingju, hér að neðan eru næstu skref',
        }),
      ).toBeVisible()
    })

    await test.step('Employer approval', async () => {
      await getEmployerEmailAndApprove(employer, page)
    })
  })
})
