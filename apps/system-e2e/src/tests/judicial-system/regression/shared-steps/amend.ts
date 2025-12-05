import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export const judgeAmendsCase = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`/krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Yfirlit
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await page.getByTestId('continueButton').click()
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Móttaka
  await expect(page).toHaveURL(`/domur/mottaka/${caseId}`)
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Yfirlit
  await expect(page).toHaveURL(`/domur/krafa/${caseId}`)
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Fyrirtaka
  await expect(page).toHaveURL(`/domur/fyrirtokutimi/${caseId}`)
  await page.getByTestId('continueButton').click()

  // Úrskurður
  await expect(page).toHaveURL(`/domur/urskurdur/${caseId}`)
  await page
    .locator('textarea[id=courtLegalArguments]')
    .fill('Dómari hefur ákveðið að breyta úrskurði')
  await page.click('textarea[id=ruling]')
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Þingbók
  await expect(page).toHaveURL(`/domur/thingbok/${caseId}`)
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Samantekt
  await expect(page).toHaveURL(`/domur/stadfesta/${caseId}`)
  await page.getByTestId('continueButton').click()
  await page.locator('textarea[name=reason]').fill('Dómari breytti úrskurði')
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
  ])
  await Promise.all([
    page.getByTestId('modalSecondaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Yfirlit
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await expect(page.getByText('Dómari breytti úrskurði')).toBeVisible()

  await page.getByRole('button', { name: 'Úrskurður héraðsdóms' }).click()
  await expect(
    page.getByText('Dómari hefur ákveðið að breyta úrskurði'),
  ).toBeVisible()
}
