import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  judgeCompletesIndictmentWithVerdict,
  publicProsecutorOfficeAssignsReviewer,
} from './shared-steps/complete-indictment'
import {
  prosecutorCreatesIndictmentCase,
  prosecutorSendsIndictmentToCourt,
} from './shared-steps/indictment-to-court-record'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Indictment tests', () => {
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

  test('judge should receive indictment case', async ({ judgePage }) => {
    await judgeCompletesIndictmentWithVerdict(judgePage, caseId, accusedName)
  })

  test('public prosecutor office should assign a reviewer to an indictment', async ({
    publicProsecutorOfficePage,
  }) => {
    await publicProsecutorOfficeAssignsReviewer(
      publicProsecutorOfficePage,
      accusedName,
    )
  })

  test('public prosecutor should receive and review indictment', async ({
    publicProsecutorPage,
  }) => {
    const page = publicProsecutorPage

    // Case list for cases in review
    await page.goto('/malalistar/sakamal-til-yfirlestrar')
    await expect(page).toHaveURL('/malalistar/sakamal-til-yfirlestrar')
    await page.getByText(accusedName).click()

    await page.getByText('Una héraðsdómi').click()
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])

    // Case list for reviewed cases
    await page.goto('/malalistar/yfirlesin-sakamal')
    await expect(page).toHaveURL('/malalistar/yfirlesin-sakamal')
    await expect(page.getByText(accusedName)).toHaveCount(1)
  })

  test('public prosecutor office should deliver indictment to prison', async ({
    publicProsecutorOfficePage,
  }) => {
    const page = publicProsecutorOfficePage

    // Case list for cases already reviewed
    await page.goto('/malalistar/yfirlesin-sakamal')
    await expect(page).toHaveURL('/malalistar/yfirlesin-sakamal')
    await page.getByText(accusedName).click()

    await page.getByRole('button', { name: 'Valmynd' }).click()
    await page.getByRole('menuitem', { name: 'Senda til fullnustu' }).click()

    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])

    // Case list for defendants sent to prison
    await page.goto('/malalistar/sakamal-i-fullnustu')
    await expect(page).toHaveURL('/malalistar/sakamal-i-fullnustu')
    await expect(page.getByText(accusedName)).toHaveCount(1)
  })
})
