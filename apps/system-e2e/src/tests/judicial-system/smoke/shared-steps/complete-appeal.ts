import { Page, expect } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { createFakePdf, randomAppealCaseNumber } from '../../utils/helpers'

export async function coaJudgeCompletesCaseTest(page: Page, caseId: string) {
  await page.goto(`/landsrettur/yfirlit/${caseId}`)

  // Overview
  await expect(page).toHaveURL(`/landsrettur/yfirlit/${caseId}`)
  await page.getByTestId('continueButton').click()

  // Appeal case reception
  await expect(page).toHaveURL(`/landsrettur/kaera/${caseId}`)
  const appealCaseNumber = randomAppealCaseNumber()
  await page.getByText('Mál nr. *').fill(appealCaseNumber)

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    page.getByText('Mál nr. *').press('Tab'),
  ])
  await page.getByTestId('select-assistant').click()
  await Promise.all([
    page.locator('#react-select-assistant-option-0').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
  ])

  await page.getByTestId('icon-chevronDown').nth(2).click()
  await Promise.all([
    page.locator('#react-select-judge-option-0').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
  ])
  await page.getByTestId('icon-chevronDown').nth(3).click()
  await Promise.all([
    page.locator('#react-select-judge-option-0').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
  ])
  await page.getByTestId('icon-chevronDown').nth(4).click()
  await Promise.all([
    page.locator('#react-select-judge-option-0').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
  ])

  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalPrimaryButton').click()

  // Ruling
  await expect(page).toHaveURL(`/landsrettur/urskurdur/${caseId}`)
  await Promise.all([
    page.locator('label').filter({ hasText: 'Staðfesting' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
  ])
  await page.getByPlaceholder('Hver eru úrskurðarorð Landsréttar?').click()
  await page
    .getByPlaceholder('Hver eru úrskurðarorð Landsréttar?')
    .fill('Test úrskurðarorð Landsréttar')
  await page.getByPlaceholder('Hver eru úrskurðarorð Landsréttar?').press('Tab')

  const rulingFileChooserPromise = page.waitForEvent('filechooser')
  await page.getByText('Velja gögn til að hlaða upp').click()
  const rulingFileChooser = await rulingFileChooserPromise
  await page.waitForTimeout(1000)
  await rulingFileChooser.setFiles(await createFakePdf('TestNidurstada.pdf'))
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
    verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
  ])
  await page.getByTestId('continueButton').click()
  await expect(page).toHaveURL(`/landsrettur/samantekt/${caseId}`)
  await page.getByTestId('continueButton').click()
}
