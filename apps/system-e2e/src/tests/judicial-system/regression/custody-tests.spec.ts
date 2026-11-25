import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { getDaysFromNow, chooseDocument, verifyUpload } from '../utils/helpers'
import { prosecutorCreatesCustodyRequest } from './shared-steps/create-restriction-case'
import { judgeSubmitsDecision } from './shared-steps/court-decision'
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
  const accusedName = faker.name.findName()

  test('prosecutor should submit a custody request to court', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesCustodyRequest(
      prosecutorPage,
      accusedName,
      requestedCustodyEndDate,
    )
  })

  test('court should submit decision in case', async ({ judgePage }) => {
    await judgeSubmitsDecision(judgePage, caseId, {
      decisionText: 'Krafa um gæsluvarðhald samþykkt',
      validToDate: custodyEndDate,
      dismissSignatureModal: true,
    })
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

    await expect(page).toHaveURL(`/verjandi/kaera/greinargerd/${caseId}`)
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
    await page.getByTestId('continueButton').click()
    await expect(page).toHaveURL(`/krafa/fyrirtaka/${extendedCaseId}`)

    // Court date request
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.getByTestId('reqCourtDate-time').click()
    await page.getByTestId('reqCourtDate-time').fill('10:00')
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()
    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${extendedCaseId}`,
    )

    // Prosecutor demands
    await page.locator('input[id=reqValidToDate]').fill(extendedCustodyEndDate)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqValidToDate-time]').fill('16:00')
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('continueButton')).toBeEnabled({
      timeout: 10000,
    })
    await page.getByTestId('continueButton').click()
    await expect(page).toHaveURL(`/krafa/greinargerd/${extendedCaseId}`)

    // Prosecutor statement
    await page.getByTestId('continueButton').click()
    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${extendedCaseId}`)

    // Case files
    await page.getByTestId('continueButton').click()
    // Submit to court
    await expect(page).toHaveURL(`/krafa/stadfesta/${extendedCaseId}`)
    await expect(
      page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }),
    ).toBeVisible()

    // Submit to court
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()
  })
})
