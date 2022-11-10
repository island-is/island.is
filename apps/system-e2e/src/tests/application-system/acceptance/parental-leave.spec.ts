import { BrowserContext, expect, test } from '@playwright/test'
import {
  BaseAuthority,
  getEnvironmentBaseUrl,
  TestEnvironment,
  urls,
} from '../../../support/utils'
import {
  employerFormMessages,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave/messages'
import { coreMessages } from '@island.is/application/core/messages'
import { label } from '../../../support/i18n'
import { EmailAccount } from '../../../support/email-account'
import { helpers, locatorByRole } from '../../../support/locator-helpers'
import { Response } from '@anev/ts-mountebank'
import { EinstaklingsupplysingarToJSON } from '../../../../../../libs/clients/national-registry/v2/gen/fetch'
import { addXroadMock, resetMocks, wildcard } from '../../../support/wire-mocks'
import { NationalRegistry } from '../../../../../../infra/src/dsl/xroad'

test.use({ baseURL: urls.islandisBaseUrl })

const applicationSystemApi: { [env in TestEnvironment]: string } = {
  dev: getEnvironmentBaseUrl(BaseAuthority.dev),
  staging: getEnvironmentBaseUrl(BaseAuthority.staging),
  prod: getEnvironmentBaseUrl(BaseAuthority.prod),
  local: 'http://localhost:4444',
}

async function setupXroadMocks() {
  await resetMocks()
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019',
    new Response().withJSONBody(
      EinstaklingsupplysingarToJSON({
        kennitala: '0101303019',
        nafn: 'Gervimaður Afríka',
        eiginnafn: 'Gervimaður',
        millinafn: null,
        kenninafn: 'Afríka',
        fulltNafn: 'Gervimaður Afríka',
        kynkodi: '1',
        bannmerking: false,
        faedingardagur: new Date('1930-01-01T00:00:00'),
        logheimili: {
          heiti: 'Engihjalli 3',
          postnumer: '200',
          stadur: 'Kópavogur',
          sveitarfelagsnumer: '1000',
        },
        adsetur: {
          heiti: 'Fellsmúli 2',
          postnumer: '108',
          stadur: 'Reykjavík',
          sveitarfelagsnumer: '0000',
        },
      }),
    ),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/1111111119',
    new Response().withJSONBody(
      EinstaklingsupplysingarToJSON({
        kennitala: '1111111119',
        nafn: 'Stubbur Maack',
        eiginnafn: 'Stubbur',
        millinafn: null,
        kenninafn: 'Maack',
        fulltNafn: 'Stubbur Maack',
        kynkodi: '3',
        bannmerking: false,
        faedingardagur: new Date('2011-11-11T00:00:00'),
        logheimili: {
          heiti: 'Engihjalli 3',
          postnumer: '200',
          stadur: 'K..pavogur',
          sveitarfelagsnumer: '1000',
        },
        adsetur: {
          heiti: 'Fellsm..li 2',
          postnumer: '108',
          stadur: 'Reykjav..k',
          sveitarfelagsnumer: '0000',
        },
      }),
    ),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101307789',
    new Response().withJSONBody(
      EinstaklingsupplysingarToJSON({
        kennitala: '0101307789',
        nafn: 'Gervima..ur ..tl..nd',
        eiginnafn: 'Gervima..ur',
        millinafn: null,
        kenninafn: '..tl..nd',
        fulltNafn: 'Gervima..ur ..tl..nd',
        kynkodi: '1',
        bannmerking: false,
        faedingardagur: new Date('1930-01-01T00:00:00'),
        logheimili: {
          heiti: 'Engihjalli 3',
          postnumer: '200',
          stadur: 'K..pavogur',
          sveitarfelagsnumer: '1000',
        },
        adsetur: {
          heiti: 'Fellsm..li 2',
          postnumer: '108',
          stadur: 'Reykjav..k',
          sveitarfelagsnumer: '0000',
        },
      }),
    ),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/forsja',
    new Response().withJSONBody(['1111111119']),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/forsja/1111111119',
    new Response().withJSONBody(['0101307789']),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/hjuskapur',
    new Response().withJSONBody({
      kennitalaMaka: '0101307789',
      nafnMaka: 'Gervima..ur ..tl..nd',
      hjuskaparkodi: '3',
      breytt: '2021-05-26T22:23:40.513',
    }),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/fjolskyldumedlimir',
    new Response().withJSONBody({
      fjolskyldunumer: '0101303019',
      einstaklingar: [
        {
          kennitala: '0101303019',
          nafn: 'Gervima..ur Afr..ka',
          eiginnafn: 'Gervima..ur',
          millinafn: null,
          kenninafn: 'Afr..ka',
          fulltNafn: 'Gervima..ur Afr..ka',
          kynkodi: '1',
          bannmerking: false,
          faedingardagur: '1930-01-01T00:00:00',
          logheimili: {
            heiti: 'Engihjalli 3',
            postnumer: '200',
            stadur: 'K..pavogur',
            sveitarfelagsnumer: '1000',
          },
          adsetur: {
            heiti: 'Fellsm..li 2',
            postnumer: '108',
            stadur: 'Reykjav..k',
            sveitarfelagsnumer: '0000',
          },
        },
        {
          kennitala: '0101307789',
          nafn: 'Gervima..ur ..tl..nd',
          eiginnafn: 'Gervima..ur',
          millinafn: null,
          kenninafn: '..tl..nd',
          fulltNafn: 'Gervima..ur ..tl..nd',
          kynkodi: '1',
          bannmerking: false,
          faedingardagur: '1930-01-01T00:00:00',
          logheimili: {
            heiti: 'Engihjalli 3',
            postnumer: '200',
            stadur: 'K..pavogur',
            sveitarfelagsnumer: '1000',
          },
          adsetur: {
            heiti: 'Fellsm..li 2',
            postnumer: '108',
            stadur: 'Reykjav..k',
            sveitarfelagsnumer: '0000',
          },
        },
        {
          kennitala: '1111111119',
          nafn: 'Stubbur Maack',
          eiginnafn: 'Stubbur',
          millinafn: null,
          kenninafn: 'Maack',
          fulltNafn: 'Stubbur Maack',
          kynkodi: '3',
          bannmerking: false,
          faedingardagur: '2011-11-11T00:00:00',
          logheimili: {
            heiti: 'Engihjalli 3',
            postnumer: '200',
            stadur: 'K..pavogur',
            sveitarfelagsnumer: '1000',
          },
          adsetur: {
            heiti: 'Fellsm..li 2',
            postnumer: '108',
            stadur: 'Reykjav..k',
            sveitarfelagsnumer: '0000',
          },
        },
      ],
    }),
  )
  await wildcard()
}

test.describe('Parental leave', () => {
  let context: BrowserContext
  let applicant: EmailAccount
  let employer: EmailAccount

  test.beforeAll(async () => {
    // applicant = await makeEmailAccount('applicant')
    // employer = await makeEmailAccount('employer')
  })
  test.beforeAll(async ({ browser }) => {
    // context = await session({
    //   browser: browser,
    //   storageState: 'parental-leave.json',
    //   homeUrl: `${urls.islandisBaseUrl}/umsoknir/faedingarorlof`,
    //   phoneNumber: '0103019',
    //   idsLoginOn: true,
    // })
  })
  test.afterAll(async () => {
    // await context.close()
  })

  test('should be able to create application', async () => {
    // const apiUrl = applicationSystemApi[env]
    // await mockApi(page, `${apiUrl}/api/graphql?op=GetTranslations`, {
    //   data: { getTranslations: {} },
    // })

    await setupXroadMocks()
    const page = await context.newPage()

    await page.goto('/umsoknir/faedingarorlof', { waitUntil: 'networkidle' })
    const { findByRole, findByTestId, proceed } = helpers(page)

    await expect(
      findByRole(
        'heading',
        label(parentalLeaveFormMessages.shared.mockDataUse),
      ),
    ).toBeVisible()
    await findByRole(
      'radio',
      label(parentalLeaveFormMessages.shared.noOptionLabel),
    ).click()

    await proceed()

    await page.locator("[data-testid='agree-to-data-providers']").click()
    await proceed()

    await page.locator("[data-testid='child-0']").click()
    await findByTestId('select-child').click()

    const emailBox = findByRole(
      'textbox',
      label(parentalLeaveFormMessages.applicant.email),
    )
    await emailBox.selectText()
    await emailBox.type(`${applicant.email}`)

    const phoneNumber = findByRole(
      'textbox',
      label(parentalLeaveFormMessages.applicant.phoneNumber),
    )
    await phoneNumber.selectText()
    await phoneNumber.type('5555555')

    await proceed()

    await findByRole(
      'radio',
      label(parentalLeaveFormMessages.shared.otherParentOption),
    ).click()

    const otherParentName = findByRole(
      'textbox',
      label(parentalLeaveFormMessages.shared.otherParentName),
    )
    await otherParentName.selectText()
    await otherParentName.type('Gervimaður Ameríku')

    const otherParentKt = findByRole(
      'textbox',
      label(parentalLeaveFormMessages.shared.otherParentID),
    )
    await otherParentKt.selectText()
    // eslint-disable-next-line local-rules/disallow-kennitalas
    await otherParentKt.type('0101302989')
    await proceed()

    await findByRole(
      'radio',
      label(parentalLeaveFormMessages.rightOfAccess.yesOption),
    ).click()
    await proceed()

    await expect(
      findByRole('heading', {
        name: label(parentalLeaveFormMessages.shared.paymentInformationName),
      }),
    ).toBeVisible()

    const paymentBank = findByRole('textbox', {
      name: label(parentalLeaveFormMessages.shared.paymentInformationBank),
    })
    await paymentBank.selectText()
    await paymentBank.type('051226054678')

    const pensionFund = findByRole('combobox', {
      name: `${label(parentalLeaveFormMessages.shared.pensionFund)} ${label(
        parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
      )}`,
    })
    await pensionFund.press('ArrowDown')

    await page.locator('#react-select-payments\\.pensionFund-option-0').click()
    await page.locator("[data-testid='use-union']").click()
    const paymentUnion = page.locator("[data-testid='payments-union']")
    await paymentUnion.focus()
    await paymentUnion.press('ArrowDown')
    await page.locator('#react-select-payments\\.union-option-0').click()
    await page.locator("[data-testid='use-private-pension-fund']").click()
    const privatePensionFund = page.locator(
      "[data-testid='private-pension-fund']",
    )
    await privatePensionFund.focus()
    await privatePensionFund.press('ArrowDown')
    await page
      .locator('#react-select-payments\\.privatePensionFund-option-0')
      .click()
    await page
      .locator("[data-testid='private-pension-fund-ratio']")
      .press('ArrowDown')
    await page
      .locator('#react-select-payments\\.privatePensionFundPercentage-option-0')
      .click()
    await proceed()

    await page.locator("[data-testid='use-personal-finance']").click()
    await proceed()

    await page.locator("[data-testid='use-as-much-as-possible']").click()
    await proceed()

    await findByRole('region', {
      name: label(parentalLeaveFormMessages.personalAllowance.useFromSpouse),
    })
      .locator(
        locatorByRole('radio', {
          name: label(parentalLeaveFormMessages.shared.noOptionLabel),
        }),
      )
      .click()
    await proceed()

    await findByRole('region', {
      name: label(parentalLeaveFormMessages.selfEmployed.title),
    })
      .locator(
        locatorByRole('radio', {
          name: label(parentalLeaveFormMessages.shared.noOptionLabel),
        }),
      )
      .click()
    await proceed()

    await expect(
      findByRole('heading', {
        name: label(parentalLeaveFormMessages.employer.title),
      }),
    ).toBeVisible()
    await findByRole('textbox', {
      name: label(parentalLeaveFormMessages.employer.email),
    }).type(employer.email)
    await proceed()

    await expect(
      findByRole('heading', {
        name: label(parentalLeaveFormMessages.shared.theseAreYourRights),
      }),
    ).toBeVisible()
    await proceed()

    await findByRole('region', {
      name: label(parentalLeaveFormMessages.shared.transferRightsTitle),
    })
      .locator(
        locatorByRole('radio', {
          name: label(parentalLeaveFormMessages.shared.transferRightsNone),
        }),
      )
      .click()
    await proceed()

    await expect(
      findByRole('region', {
        name: label(parentalLeaveFormMessages.shared.periodsImageTitle),
      }),
    ).toBeVisible()
    await proceed()

    await findByRole('region', {
      name: label(parentalLeaveFormMessages.firstPeriodStart.title),
    })
      .locator(
        locatorByRole('radio', {
          name: label(
            parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption,
          ),
        }),
      )
      .click()
    await proceed()

    await expect(
      findByRole('heading', {
        name: label(parentalLeaveFormMessages.duration.title),
      }),
    ).toBeVisible()
    await findByRole('radio', {
      name: label(parentalLeaveFormMessages.duration.monthsOption),
    }).click()
    await proceed()

    await expect(
      findByRole('region', {
        name: label(parentalLeaveFormMessages.duration.title),
      }),
    ).toBeVisible()
    await findByRole('button', {
      name: '6 months',
    }).click()
    await proceed()

    await findByTestId('select-percentage-use').type('50%')
    await findByTestId('select-percentage-use').press('Enter')
    await proceed()

    await expect(
      findByRole('button', {
        name: label(parentalLeaveFormMessages.leavePlan.addAnother),
      }),
    ).toBeVisible()
    await proceed()

    await findByRole('button', {
      name: label(parentalLeaveFormMessages.confirmation.title),
    }).click()

    const email = await employer.getLastEmail(6)

    if (email && typeof email.html === 'string') {
      const employerUrlMatch = email.html.match(/>(https?:.*)<\/p>/)
      if (employerUrlMatch?.length != 2)
        throw new Error(
          'Email does not contain the url to approve the parental leave application',
        )
      const employerUrl = employerUrlMatch[1]
      if (!employerUrl)
        throw new Error(
          `Could not find url for employer in email: ${email.html}`,
        )
      await page.goto(employerUrl)

      await findByRole('region', {
        name: label(employerFormMessages.employerNationalRegistryIdSection),
      })
        .locator('role=textbox')
        // eslint-disable-next-line local-rules/disallow-kennitalas
        .type('5402696029')
      await proceed()

      await findByRole('button', {
        name: label(coreMessages.buttonApprove),
      }).click()
    }
  })
})
