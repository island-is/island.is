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

test.describe.serial('Indictment completing for some tests', () => {
  let caseId = ''
  const accusedName = faker.name.findName()
  const secondAccusedName = faker.name.findName()

  test('prosecutor should create a new indictment case with two defendants', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesIndictmentCase(
      prosecutorPage,
      accusedName,
      secondAccusedName,
    )
  })

  test('prosecutor should accept and send indictment case to court', async ({
    prosecutorPage,
  }) => {
    await prosecutorSendsIndictmentToCourt(prosecutorPage, caseId, accusedName)
  })

  test('judge should complete the case for one of two defendants', async ({
    judgePage,
  }) => {
    const page = judgePage

    // Case list through subpoena, advocates and on to the court record
    await judgeReceivesIndictmentThroughAdvocates(page, caseId, accusedName)

    // Conclusion - completing for some does not require a court record
    await Promise.all([
      page.goto(`/domur/akaera/stada-og-lyktir/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await page
      .locator('label')
      .filter({ hasText: 'Skrá lyktir á einstaka aðila án þess að ljúka máli' })
      .click()

    // A conclusion can be registered for all but one defendant - cancel the
    // indictment against the first defendant. Click the select control rather
    // than the placeholder: react-select lays the input container over the
    // placeholder in the same grid cell, so a click aimed at the placeholder
    // never reaches it.
    await page
      .locator('.island-select__control')
      .filter({ hasText: 'Veldu lyktir ef á við' })
      .first()
      .click()
    await page.getByRole('option', { name: 'Niðurfelling máls' }).click()

    await page.getByTestId('continueButton').click()

    // Conclusion date modal - the date is prefilled with today
    await expect(
      page.getByText('Skrá lyktir á aðila án þess að ljúka máli'),
    ).toBeVisible()
    await page.getByTestId('modalPrimaryButton').click()

    // Confirmation modal - wait for the first modal to unmount so only
    // one modal button remains
    await expect(page.getByText('Viltu staðfesta lyktir?')).toBeVisible()
    await expect(
      page.getByText('Lyktir verða skráðar á valda aðila.'),
    ).toHaveCount(0)
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])

    await expect(page).toHaveURL(`domur/akaera/yfirlit/${caseId}`)

    // The overview moves a defendant whose indictment was cancelled out of the
    // defendant list and into a section of its own, titled with the decision.
    // ('Niðurfellt' is only rendered for defendants still on the list.)
    await expect(page.getByText('Niðurfelling máls').first()).toBeVisible()
    await expect(page.getByText(accusedName).first()).toBeVisible()

    // The case is not completed - it remains active for the other defendant
    await expect(page.getByText(secondAccusedName).first()).toBeVisible()
  })
})
