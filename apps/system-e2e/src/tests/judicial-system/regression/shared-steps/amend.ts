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
  const courtLegalArgumentsField = page.locator(
    'textarea[id=courtLegalArguments]',
  )
  await courtLegalArgumentsField.fill('Dómari hefur ákveðið að breyta úrskurði')
  // Form uses useDebouncedInput(500ms); wait for UpdateCase so the value is persisted before continuing.
  await page.waitForResponse(
    (resp) =>
      resp.url().includes('/api/graphql') &&
      resp.request().postDataJSON()?.operationName === 'UpdateCase',
    { timeout: 5000 },
  )
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
  // After transition we either get "Þarf að undirrita?" (Já/Nei) or the signing method modal (Undirritun).
  // Wait for whichever appears: ruling was signed → askIfSignature → Nei; ruling not signed → signature path → Undirritun.
  const neiButton = page.getByRole('button', { name: 'Nei' })
  const signingModalHeading = page.getByRole('heading', { name: 'Undirritun' })
  await Promise.race([
    neiButton.waitFor({ state: 'visible', timeout: 12000 }),
    signingModalHeading.waitFor({ state: 'visible', timeout: 12000 }),
  ])
  if (await neiButton.isVisible()) {
    await Promise.all([
      neiButton.click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])
  } else {
    // SigningMethodSelectionModal: close without signing, then go to overview (case already transitioned).
    await page.getByTestId('modal').getByRole('button').first().click()
    await Promise.all([
      page.goto(`/krafa/yfirlit/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])
  }

  // Yfirlit
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await expect(page.getByText('Dómari breytti úrskurði')).toBeVisible()

  // Reload overview so the Case query runs again and returns the amended ruling.
  // TransitionCase does not return full case (e.g. courtLegalArguments), so after
  // the "Nei" path the overview can show cached data; a reload forces fresh data.
  await Promise.all([
    page.reload(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await expect(page.getByText('Dómari breytti úrskurði')).toBeVisible()

  // Expand ruling accordion and verify amended ruling text (court legal arguments).
  const rulingButton = page.getByRole('button', {
    name: 'Úrskurður héraðsdóms',
  })
  await expect(rulingButton).toBeVisible()
  await rulingButton.click()
  await expect(page.locator('#rulingAccordionItem')).toBeVisible({
    timeout: 5000,
  })
  await expect(
    page
      .locator('#rulingAccordionItem')
      .getByText('Dómari hefur ákveðið að breyta úrskurði'),
  ).toBeVisible({ timeout: 10000 })
}
