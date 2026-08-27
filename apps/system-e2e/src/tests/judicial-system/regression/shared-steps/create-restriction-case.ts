import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import {
  getDaysFromNow,
  injectTestDefenderIntoLawyerRegistry,
  randomPoliceCaseNumber,
  selectTestDefender,
} from '../../utils/helpers'

/**
 * Prosecutor creates a custody request and submits it to court. The test
 * defender is registered through the lawyer-registry combobox so the
 * defender fixture (0909090909) gets limited access to the case.
 * Returns the created case id.
 */
export const prosecutorCreatesCustodyRequest = async (
  page: Page,
  accusedName: string,
  requestedCustodyEndDate: string,
): Promise<string> => {
  let caseId = ''
  const today = getDaysFromNow()

  await injectTestDefenderIntoLawyerRegistry(page)

  // Case list groups
  await page.goto('/malalistar')
  await expect(page).toHaveURL('/malalistar')
  await page.getByRole('button', { name: 'Nýtt mál' }).click()
  await page.getByRole('menuitem', { name: 'Gæsluvarðhald' }).click()
  await expect(page).toHaveURL('/krafa/ny/gaesluvardhald')

  // New custody request
  await expect(
    page.getByRole('heading', { name: 'Gæsluvarðhald' }),
  ).toBeVisible()
  await page
    .locator('input[name=policeCaseNumbers]')
    .fill(randomPoliceCaseNumber())
  await page.getByRole('button', { name: 'Skrá númer' }).click()
  await page.getByRole('checkbox').first().check()
  await page.locator('input[name=inputName]').fill(accusedName)
  await page.locator('input[name=accusedAddress]').fill('Einhversstaðar 1')
  await page.locator('#defendantGender').click()
  await page.locator('#react-select-defendantGender-option-0').click()

  // Defender - selected from the (intercepted) lawyer registry so the
  // CreateCase mutation carries the defender fields set by the real UI
  await selectTestDefender(page)
  await page.locator('label[for="defender-access-ready-for-court"]').click()

  await page.locator('input[name=leadInvestigator]').fill('Stjórinn')
  await expect(
    page.getByRole('button', { name: 'Óskir um fyrirtöku' }),
  ).toBeVisible()
  await Promise.all([
    page.getByRole('button', { name: 'Stofna mál' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'CreateCase').then(
      (res) => (caseId = res.data.createCase.id),
    ),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Court date request
  await expect(page).toHaveURL(`/krafa/fyrirtaka/${caseId}`)
  await page.locator('input[id=arrestDate]').fill(today)
  await page.keyboard.press('Escape')
  await page.locator('input[id=arrestDate-time]').fill('00:00')
  await page.locator('input[id=reqCourtDate]').fill(today)
  await page.keyboard.press('Escape')
  await page.locator('input[id=reqCourtDate-time]').fill('15:00')
  await expect(
    page.getByRole('button', { name: 'Dómkröfur og lagagrundvöllur' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Halda áfram' }).click()
  await Promise.all([
    page.getByRole('button', { name: 'Halda áfram með kröfu' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Prosecutor demands
  await expect(page).toHaveURL(`/krafa/domkrofur-og-lagagrundvollur/${caseId}`)
  await page.locator('input[id=reqValidToDate]').fill(requestedCustodyEndDate)
  await page.keyboard.press('Escape')
  await page.locator('textarea[name=lawsBroken]').click()
  await page.keyboard.type('Einhver lög voru brotin')
  await page.getByTestId('checkbox').first().click()
  await expect(page.getByRole('button', { name: 'Greinargerð' })).toBeVisible()
  await Promise.all([
    page.getByRole('button', { name: 'Halda áfram' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Prosecutor statement
  await expect(page).toHaveURL(`/krafa/greinargerd/${caseId}`)
  await page.locator('textarea[name=caseFacts]').click()
  await page.keyboard.type('Eitthvað gerðist')
  await page.locator('textarea[name=legalArguments]').click()
  await page.keyboard.type('Þetta er ekki löglegt')
  await page.locator('textarea[name=comments]').click()
  await page.keyboard.type('Sakborningur er hættulegur')
  // Blur so debounced Case update runs; then wait for form to become valid (footer button enabled).
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Halda áfram' })).toBeEnabled({
    timeout: 15000,
  })
  await Promise.all([
    page.getByRole('button', { name: 'Halda áfram' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Case files
  await expect(page).toHaveURL(`/krafa/rannsoknargogn/${caseId}`)
  await page.locator('textarea[name=caseFilesComments]').click()
  await page.keyboard.type('Engin gögn fylgja')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Halda áfram' })).toBeEnabled({
    timeout: 15000,
  })
  await Promise.all([
    page.getByRole('button', { name: 'Halda áfram' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Submit to court
  await expect(page).toHaveURL(`/krafa/stadfesta/${caseId}`)
  await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
  await page.getByTestId('modalSecondaryButton').click()
  await expect(page).toHaveURL('/malalistar')

  return caseId
}
