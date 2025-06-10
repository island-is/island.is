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
  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalSecondaryButton').click()

  // Úrskurður
  await page
    .getByTestId('courtLegalArguments')
    .fill('Dómari hefur ákveðið að breyta úrskurði')

  await page.getByTestId('continueButton').click()

  // Þingbók
  await page.getByTestId('continueButton').click()

  // Samantekt
  await page.getByTestId('continueButton').click()
  await page.getByLabel('Hverju var breytt?').fill('Dómari breytti úrskurði')
  await page.getByTestId('modalPrimaryButton').click()
  await page.getByTestId('modalSecondaryButton').click()

  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)

  await expect(
    page.getByText('Dómari hefur ákveðið að breyta úrskurði'),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Úrskurður héraðsdóms' }).click()
  await expect(page.getByText('Dómari breytti úrskurði')).toBeVisible()
}
