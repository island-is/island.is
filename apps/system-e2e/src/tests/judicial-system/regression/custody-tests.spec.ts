import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  randomPoliceCaseNumber,
  randomCourtCaseNumber,
  getDaysFromNow,
  chooseDocument,
  verifyUpload,
} from '../utils/helpers'
import { judgeReceivesAppealTest } from './shared-steps/receive-appeal'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'
import { judgeAmendsCase } from './shared-steps/amend'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Custody tests', () => {
  let caseId = ''
  let extendedCaseId = ''
  const today = getDaysFromNow()
  const custodyEndDate = getDaysFromNow(2)
  const requestedCustodyEndDate = getDaysFromNow(3)
  const extendedCustodyEndDate = getDaysFromNow(4)

  test('prosecutor should submit a custody request to court', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    await page.route('**/api/graphql', (route, request) => {
      const requestJSON = request.postDataJSON()

      if (requestJSON.operationName === 'CreateCase') {
        const modifiedData = requestJSON

        modifiedData.variables.input = {
          ...modifiedData.variables.input,
          defenderNationalId: '0909090909',
        }
        route.continue({
          method: 'POST',
          postData: JSON.stringify(modifiedData),
        })
      } else {
        route.continue()
      }
    })

    // Case list
    await page.goto('/krofur')
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Gæsluvarðhald' }).click()
    await expect(page).toHaveURL('/krafa/ny/gaesluvardhald')

    // New custody request
    await expect(
      page.getByRole('heading', { name: 'Gæsluvarðhald' }),
    ).toBeVisible()
    await page
      .locator('input[name=policeCaseNumbers]')
      .fill(randomPoliceCaseNumber())
    await page.getByRole('button', { name: 'Skrá númer' }).click()
    await page.getByRole('checkbox').first().check()
    await page.locator('input[name=inputName]').fill(faker.name.findName())
    await page.locator('input[name=accusedAddress]').fill('Einhversstaðar 1')
    await page.locator('#defendantGender').click()
    await page.locator('#react-select-defendantGender-option-0').click()
    await page
      .locator('input[id=react-select-advocateName-input]')
      .fill('Saul Goodman')
    await page.locator('#react-select-advocateName-option-0').click()
    await page
      .locator('input[name=defenderEmail]')
      .fill('jl+auto+defender@kolibri.is')
    await page.locator('input[id=defender-access-ready-for-court]').click()
    await page.locator('input[name=leadInvestigator]').fill('Stjórinn')
    await expect(
      page.getByRole('button', { name: 'Óskir um fyrirtöku' }),
    ).toBeVisible()
    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase').then(
        (res) => (caseId = res.data.createCase.id),
      ),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Court date request
    await expect(page).toHaveURL(`/krafa/fyrirtaka/${caseId}`)
    await page.locator('input[id=arrestDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=arrestDate-time]').fill('00:00')
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqCourtDate-time]').fill('15:00')
    await expect(
      page.getByRole('button', { name: 'Dómkröfur og lagagrundvöllur' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram með kröfu' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Prosecutor demands
    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${caseId}`,
    )
    await page.locator('input[id=reqValidToDate]').fill(requestedCustodyEndDate)
    await page.keyboard.press('Escape')
    await page.locator('textarea[name=lawsBroken]').click()
    await page.keyboard.type('Einhver lög voru brotin')
    await page.getByTestId('checkbox').first().click()
    await expect(
      page.getByRole('button', { name: 'Greinargerð' }),
    ).toBeVisible()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Prosecutor statement
    await expect(page).toHaveURL(`/krafa/greinargerd/${caseId}`)
    await page.locator('textarea[name=caseFacts]').click()
    await page.keyboard.type('Eitthvað gerðist')
    await page.locator('textarea[name=legalArguments]').click()
    await page.keyboard.type('Þetta er ekki löglegt')
    await page.locator('textarea[name=comments]').click()
    await page.keyboard.type('Sakborningur er hættulegur')
    await expect(
      page.getByRole('button', { name: 'Rannsóknargögn' }),
    ).toBeVisible()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case files
    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${caseId}`)
    await page.locator('textarea[name=caseFilesComments]').click()
    await page.keyboard.type('Engin gögn fylgja')
    await expect(page.getByRole('button', { name: 'Samantekt' })).toBeVisible()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Submit to court
    await expect(page).toHaveURL(`/krafa/stadfesta/${caseId}`)
    await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
    await page.getByRole('button', { name: 'Loka glugga' }).click()
    await expect(page).toHaveURL('/krofur')
  })

  test('court should submit decision in case', async ({ judgePage }) => {
    const page = judgePage
    await Promise.all([
      page.goto(`/domur/mottaka/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Reception and assignment
    await expect(page).toHaveURL(`/domur/mottaka/${caseId}`)
    await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
    await page.keyboard.press('Tab')
    await page.getByText('Veldu dómara/aðstoðarmann').click()
    await page
      .getByTestId('select-judge')
      .getByText('Test Dómari')
      .last()
      .click()
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Overview
    await expect(page).toHaveURL(`/domur/krafa/${caseId}`)
    await page.getByTestId('continueButton').isVisible()
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Hearing arrangements
    await expect(page).toHaveURL(`/domur/fyrirtokutimi/${caseId}`)
    await page.locator('input[id=courtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=courtDate-time]').fill('09:00')
    await page.keyboard.press('Tab')
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalSecondaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Ruling
    await expect(page).toHaveURL(`/domur/urskurdur/${caseId}`)
    await page.getByText('Krafa um gæsluvarðhald samþykkt').click()
    await page.locator('input[id=validToDate]').fill(custodyEndDate)
    await page.keyboard.press('Escape')
    await page.locator('input[id=validToDate-time]').fill('16:00')
    await page.keyboard.press('Tab')
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Court record
    await expect(page).toHaveURL(`/domur/thingbok/${caseId}`)
    await page.getByText('Varnaraðili tekur sér lögboðinn frest').click()
    await page.getByText('Sækjandi tekur sér lögboðinn frest').click()
    await page.locator('input[id=courtEndTime]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=courtEndTime-time]').fill('10:00')
    await page.keyboard.press('Tab')
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Confirmation
    await expect(page).toHaveURL(`/domur/stadfesta/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    ])
    await page.getByTestId('modalSecondaryButton').click()
  })

  test('judge should amend case', async ({ judgePage }) => {
    await judgeAmendsCase(judgePage, caseId)
  })

  test('prosecutor should appeal case', async ({ prosecutorPage }) => {
    await prosecutorAppealsCaseTest(prosecutorPage, caseId)
  })

  test('judge should receive appealed case', async ({ judgePage }) => {
    await judgeReceivesAppealTest(judgePage, caseId)
  })

  test('defender should be able to send a statement and does not see prosecutor case files', async ({
    defenderPage,
  }) => {
    const page = defenderPage
    await Promise.all([
      page.goto(`/verjandi/krafa/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCase'),
    ])
    await expect(page).toHaveURL(`/verjandi/krafa/${caseId}`)
    await expect(page.getByText('TestKaerugognSaekjanda.pdf')).toHaveCount(0)
    await expect(
      page.getByText('TestGreinargerdargognSaekjanda.pdf'),
    ).toHaveCount(0)
    await Promise.all([
      page.getByRole('button', { name: 'Senda greinargerð' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCase'),
    ])

    await expect(page).toHaveURL(`verjandi/greinargerd/${caseId}`)
    await chooseDocument(
      page,
      async () => {
        await page
          .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
          .nth(1)
          .click()
      },
      'TestGreinargerdVerjanda.pdf',
    )
    await chooseDocument(
      page,
      async () => {
        await page
          .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
          .nth(2)
          .click()
      },
      'TestGreinargerdVerjanda.pdf',
    )
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyUpload(page, true),
    ])
    await page.getByTestId('modalSecondaryButton').click()
  })

  test('coa judge should submit decision in appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId)
  })

  test('prosecutor asks for extension', async ({ prosecutorPage }) => {
    const page = prosecutorPage
    await Promise.all([
      page.goto(`/krafa/yfirlit/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])
    await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'ExtendCase'),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ]).then((values) => {
      const extendCaseResult = values[1]
      extendedCaseId = extendCaseResult.data.extendCase.id
    })

    // Defendant
    await expect(page).toHaveURL(`/krafa/sakborningur/${extendedCaseId}`)
    await page.locator('input[name=defender-access-no]').click()
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Court date request
    await expect(page).toHaveURL(`/krafa/fyrirtaka/${extendedCaseId}`)
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.getByTestId('reqCourtDate-time').click()
    await page.getByTestId('reqCourtDate-time').fill('10:00')
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalSecondaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Prosecutor demands
    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${extendedCaseId}`,
    )
    await page.locator('input[id=reqValidToDate]').fill(extendedCustodyEndDate)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqValidToDate-time]').fill('16:00')
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Prosecutor statement
    await expect(page).toHaveURL(`/krafa/greinargerd/${extendedCaseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case files
    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${extendedCaseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Submit to court
    await expect(page).toHaveURL(`/krafa/stadfesta/${extendedCaseId}`)
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()
  })
})
