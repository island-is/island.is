import { Page, expect } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { randomAppealCaseNumber, uploadDocument } from '../../utils/helpers'

export const coaJudgesCompleteAppealCaseTest = async (
  page: Page,
  caseId: string,
  appealCaseId?: string,
) => {
  const appealCaseQuery = appealCaseId ? `?appealCaseId=${appealCaseId}` : ''

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.goto(`/landsrettur/yfirlit/${caseId}${appealCaseQuery}`),
  ])

  // Overview — require the targeted appeal case when provided
  await expect(page).toHaveURL(
    appealCaseId
      ? `/landsrettur/yfirlit/${caseId}?appealCaseId=${appealCaseId}`
      : `/landsrettur/yfirlit/${caseId}`,
  )
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  // Appeal case reception
  await expect(page).toHaveURL(
    new RegExp(`/landsrettur/kaera/${caseId}(\\?.*)?$`),
  )
  const appealCaseNumber = randomAppealCaseNumber()
  await page.getByText('Mál nr. *').fill(appealCaseNumber)
  await page.getByText('Mál nr. *').press('Tab')
  await page.getByTestId('select-assistant').click()
  await page.locator('#react-select-assistant-option-0').click()
  // TODO: Make sure we select different judges - wait for dropdown updates?
  await page.getByTestId('icon-chevronDown').nth(2).click()
  await page.locator('#react-select-judge-option-0').click()
  await page.getByTestId('icon-chevronDown').nth(3).click()
  await page.locator('#react-select-judge-option-0').click()
  await page.getByTestId('icon-chevronDown').nth(4).click()
  await page.locator('#react-select-judge-option-0').click()
  await page.getByTestId('continueButton').click()
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('modalPrimaryButton').click(),
  ])

  // Ruling
  await expect(page).toHaveURL(
    new RegExp(`/landsrettur/urskurdur/${caseId}(\\?.*)?$`),
  )
  await page.locator('label').filter({ hasText: 'Staðfesting' }).click()
  await page.getByPlaceholder('Hvert er úrskurðarorð Landsréttar?').click()
  await page
    .getByPlaceholder('Hvert er úrskurðarorð Landsréttar?')
    .fill('Test úrskurðarorð Landsréttar')
  await page.getByPlaceholder('Hvert er úrskurðarorð Landsréttar?').press('Tab')
  await uploadDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja gögn til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestNidurstadaLandsrettar.pdf',
  )
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(
    new RegExp(`/landsrettur/samantekt/${caseId}(\\?.*)?$`),
  )
  await page.getByTestId('continueButton').click()
}
