import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { randomIndictmentCourtCaseNumber } from '../utils/helpers'
import {
  prosecutorCreatesIndictmentCase,
  prosecutorSendsIndictmentToCourt,
  judgeReceivesIndictmentThroughAdvocates,
} from './shared-steps/indictment-to-court-record'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Indictment merge tests', () => {
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

  test('judge should complete indictment case with a merge', async ({
    judgePage,
  }) => {
    const page = judgePage

    // Case list through subpoena, advocates and on to the court record
    await judgeReceivesIndictmentThroughAdvocates(page, caseId, accusedName)

    // Conclusion - a merge is allowed with an empty court record,
    // so no court session is created
    await Promise.all([
      page.goto(`/domur/akaera/stada-og-lyktir/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await page.locator('label').filter({ hasText: 'Lokið' }).click()
    await page
      .locator('label')
      .filter({ hasText: 'Sameinað öðru máli' })
      .click()

    // Merge into a case outside of the judicial system portal
    await page
      .getByRole('textbox', { name: 'Sameina við mál utan Réttarvörslugáttar' })
      .fill(randomIndictmentCourtCaseNumber())
    await page.keyboard.press('Tab')

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
    await expect(page.getByText('Sameinað').first()).toBeVisible()
  })
})
