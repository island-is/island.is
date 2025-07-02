import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export const judgeAmendsCase = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`/krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Yfirlit
  await page.getByTestId('continueButton').click()
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Móttaka
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Yfirlit
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Fyrirtaka
  await page.getByTestId('continueButton').click()
  await Promise.all([
    page.getByTestId('modalSecondaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Úrskurður
  await page
    .locator('textarea[id=courtLegalArguments]')
    .fill('Dómari hefur ákveðið að breyta úrskurði')
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Þingbók
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Samantekt - ATH the frontend uses the presence of a RULING nofication
  // to determine if the case is being amended or not.
  // This does not work in this test because the ruling was not signed and
  // therefore no notification was created. Fix later.
  // await page.getByTestId('continueButton').click()
  // await page.locator('input[name=reason]').fill('Dómari breytti úrskurði')
  // await Promise.all([
  //   page.getByTestId('modalPrimaryButton').click(),
  //   verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
  // ])
  // await page.getByTestId('modalSecondaryButton').click()
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
  ])
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)

  // await expect(page.getByText('Dómari breytti úrskurði')).toBeVisible()

  await page.getByRole('button', { name: 'Úrskurður héraðsdóms' }).click()
  await expect(
    page.getByText('Dómari hefur ákveðið að breyta úrskurði'),
  ).toBeVisible()
}
