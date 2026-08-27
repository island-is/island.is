import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { getDaysFromNow, randomCourtCaseNumber } from '../../utils/helpers'

export const judgeSubmitsDecision = async (
  page: Page,
  caseId: string,
  options: {
    // Label of the decision radio to pick, e.g. 'Krafa um gæsluvarðhald
    // samþykkt' or 'Kröfu um gæsluvarðhald hafnað'.
    decisionText: string
    // Required when accepting; rejected/dismissed cases hide the
    // restriction-length section entirely.
    validToDate?: string
    // The confirmation step may open the signing-method modal, which the
    // custody flow dismisses without signing. E-signing is not exercised
    // by these tests.
    dismissSignatureModal?: boolean
  },
) => {
  const today = getDaysFromNow()

  await Promise.all([
    page.goto(`/domur/mottaka/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Reception and assignment
  await expect(page).toHaveURL(`/domur/mottaka/${caseId}`)
  await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
  await page.keyboard.press('Tab')
  await page.getByText('Veldu dómara/aðstoðarmann').click()
  await page.getByTestId('select-judge').getByText('Test Dómari').last().click()
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Overview
  await expect(page).toHaveURL(`/domur/krafa/${caseId}`)
  await expect(page.getByTestId('continueButton')).toBeVisible()
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
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Ruling
  await expect(page).toHaveURL(`/domur/urskurdur/${caseId}`)
  await page.getByText(options.decisionText).click()
  if (options.validToDate) {
    await page.locator('input[id=validToDate]').fill(options.validToDate)
    await page.keyboard.press('Escape')
    await page.locator('input[id=validToDate-time]').fill('16:00')
    await page.keyboard.press('Tab')
  }
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

  if (options.dismissSignatureModal) {
    await page.getByTestId('modalSecondaryButton').click()
  }
}
