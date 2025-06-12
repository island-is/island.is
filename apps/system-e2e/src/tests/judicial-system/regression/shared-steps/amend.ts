import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export const judgeAmendsCase = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`/krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  await page.getByTestId('continueButton').click()

  await page.getByTestId('modalPrimaryButton').click()

  // Móttaka
  await page.getByTestId('continueButton').click()

  // Yfirlit
  await page.getByTestId('continueButton').click()

  // Fyrirtaka
  await Promise.all([
    page.getByRole('button', { name: 'Staðfesta' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Úrskurður
  await page
    .locator('textarea[id=courtLegalArguments]')
    .fill('Dómari hefur ákveðið að breyta úrskurði')

  await page.getByTestId('continueButton').click()

  // Þingbók
  await page.getByTestId('continueButton').click()

  // Samantekt
  await page
    .getByRole('button', { name: 'Samþykkja kröfu og undirrita úrskurð' })
    .click()
  await page.getByRole('dialog').waitFor({ state: 'visible' })
  await page.locator('textarea[id=reason]').fill('Dómari breytti úrskurði')
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
  ])

  await page.getByTestId('modalSecondaryButton').click()

  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)

  await expect(page.getByText('Dómari breytti úrskurði')).toBeVisible()

  await page.getByRole('button', { name: 'Úrskurður héraðsdóms' }).click()
  await expect(
    page.getByText('Dómari hefur ákveðið að breyta úrskurði'),
  ).toBeVisible()
}
