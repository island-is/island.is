import { Page } from '@playwright/test'

import { expect } from '@island.is/testing/e2e'
import { verifyRequestCompletion } from '@island.is/testing/e2e'

import { randomAppealCaseNumber, uploadDocument } from '../../utils/helpers'

export const coaJudgesCompleteAppealCaseTest = async (
  page: Page,
  caseId: string,
) => {
  await Promise.all([
    page.goto(`/landsrettur/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Overview
  await expect(page).toHaveURL(`/landsrettur/yfirlit/${caseId}`)
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Appeal case reception
  await expect(page).toHaveURL(`/landsrettur/kaera/${caseId}`)
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
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Ruling
  await expect(page).toHaveURL(`/landsrettur/urskurdur/${caseId}`)
  await page.locator('label').filter({ hasText: 'Staðfesting' }).click()
  await page.getByPlaceholder('Hver eru úrskurðarorð Landsréttar?').click()
  await page
    .getByPlaceholder('Hver eru úrskurðarorð Landsréttar?')
    .fill('Test úrskurðarorð Landsréttar')
  await page.getByPlaceholder('Hver eru úrskurðarorð Landsréttar?').press('Tab')
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
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  await expect(page).toHaveURL(`/landsrettur/samantekt/${caseId}`)
  await page.getByTestId('continueButton').click()
}
