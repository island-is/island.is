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

test.describe.serial('Indictment defender tests', () => {
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

  test('judge should assign a defender to the accused', async ({
    judgePage,
  }) => {
    await judgeReceivesIndictmentThroughAdvocates(
      judgePage,
      caseId,
      accusedName,
      { assignDefender: true },
    )
  })

  test('defender should see the indictment case', async ({ defenderPage }) => {
    const page = defenderPage

    await Promise.all([
      page.goto(`/verjandi/akaera/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCase'),
    ])
    await expect(page).toHaveURL(`/verjandi/akaera/${caseId}`)
    await expect(
      page.getByRole('heading', { name: 'Yfirlit ákæru' }),
    ).toBeVisible()
    await expect(page.getByText(accusedName).first()).toBeVisible()
  })
})
