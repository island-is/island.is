import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  prosecutorCreatesIndictmentCase,
  prosecutorSendsIndictmentToCourt,
  judgeReceivesIndictmentThroughAdvocates,
} from './shared-steps/indictment-to-court-record'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Indictment fine tests', () => {
  let caseId = ''
  const accusedName = faker.name.findName()

  test('prosecutor should create a new indictment case', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesIndictmentCase(prosecutorPage, accusedName)
  })

  test('prosecutor should accept and send indictment case to court', async ({
    prosecutorPage,
  }) => {
    await prosecutorSendsIndictmentToCourt(prosecutorPage, caseId, accusedName)
  })

  test('judge should complete indictment case with a fine', async ({
    judgePage,
  }) => {
    const page = judgePage

    // Case list through subpoena, advocates and on to the court record
    await judgeReceivesIndictmentThroughAdvocates(page, caseId, accusedName)

    // Indictment court record - a fine needs a confirmed court record
    // but no judgement ruling
    await Promise.all([
      page.getByRole('button', { name: 'Bæta við þinghaldi' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCourtSession'),
    ])

    // Session accordion expands and auto-initializes judge/location/dates.
    await expect(page.getByTestId('entries')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('confirm-court-record')).toBeVisible()

    // The rich text editor is TipTap, which renders a contenteditable
    // element - there is no iframe to reach into.
    await page
      .getByTestId('entries')
      .locator('[contenteditable="true"]')
      .fill('Þinghald vegna viðurlagaákvörðunar')

    // No judgement or order is pronounced in the session
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
      page.locator('input[id^="result_no-"]').check(),
    ])

    await expect(page.getByTestId('confirm-court-record')).toBeEnabled({
      timeout: 15000,
    })
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
      page.getByTestId('confirm-court-record').click(),
    ])
    await page.getByTestId('continueButton').click()

    // Conclusion
    await expect(page).toHaveURL(`domur/akaera/stada-og-lyktir/${caseId}`)

    await page.locator('label').filter({ hasText: 'Lokið' }).click()
    await page.locator('label').filter({ hasText: 'Viðurlagaákvörðun' }).click()

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case overview
    await expect(page).toHaveURL(`domur/akaera/samantekt/${caseId}`)
    await page.getByTestId('continueButton').click()

    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    ])

    // Completed case overview
    await expect(page).toHaveURL(`domur/akaera/lokid/${caseId}`)
    await expect(page.getByText('Viðurlagaákvörðun').first()).toBeVisible()
  })
})
