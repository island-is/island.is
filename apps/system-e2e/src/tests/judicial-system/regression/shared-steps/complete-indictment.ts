import { Page, expect } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { chooseDocument, getDaysFromNow } from '../../utils/helpers'
import { judgeReceivesIndictmentThroughAdvocates } from './indictment-to-court-record'

// The district court takes the case from reception to a completed verdict:
// a court session with a verdict, the conclusion, the summary, and finally
// the verdict's service on the defendant.
export const judgeCompletesIndictmentWithVerdict = async (
  page: Page,
  caseId: string,
  accusedName: string,
) => {
  // Case list through subpoena, advocates and on to the court record
  await judgeReceivesIndictmentThroughAdvocates(page, caseId, accusedName)

  // Indictment court record
  await Promise.all([
    page.getByRole('button', { name: 'Bæta við þinghaldi' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'CreateCourtSession'),
  ])
  // The rich text editor is TipTap, which renders a contenteditable
  // element - there is no iframe to reach into.
  await page
    .getByTestId('entries')
    .locator('[contenteditable="true"]')
    .fill('Afstaða, málflutningur, og bókun')

  await page.locator('label').filter({ hasText: 'Dómur kveðinn upp' }).click()
  await page.getByTestId('ruling').fill('Dómsorð')

  await page.getByTestId('confirm-court-record').click()
  await page.getByTestId('continueButton').click()

  // Conclusion
  await expect(page).toHaveURL(`domur/akaera/stada-og-lyktir/${caseId}`)

  await page.locator('label').filter({ hasText: 'Lokið' }).click()
  await page.locator('label').filter({ hasText: 'Dómur' }).click()

  await chooseDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja gögn til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestDomur.pdf',
  )

  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Case overview
  await expect(page).toHaveURL(`domur/akaera/samantekt/${caseId}`)
  await page.getByTestId('continueButton').click()

  await page.waitForSelector('input[type="checkbox"]', { state: 'visible' })
  await page
    .getByRole('checkbox', { name: 'Ég hef rýnt þetta dómskjal' })
    .check()
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Completed case overview
  await expect(page).toHaveURL(`domur/akaera/lokid/${caseId}`)

  await page
    .locator('label')
    .filter({ hasText: 'Birta skal dómfellda dóminn' })
    .click()

  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalPrimaryButton').click()
}

// The public prosecution office records the verdict's service date and hands
// the case to a reviewer.
export const publicProsecutorOfficeAssignsReviewer = async (
  page: Page,
  accusedName: string,
) => {
  const today = getDaysFromNow()

  // Case list for new cases
  await page.goto('/malalistar/ny-sakamal')
  await expect(page).toHaveURL('/malalistar/ny-sakamal')
  await page.getByText(accusedName).click()

  // Indictment overview

  // Note: this is not a standard UX path since all cases should be served and updated via external sources
  await page.locator('input[id=defendantServiceDate]').fill(today)
  await page.keyboard.press('Escape')

  await Promise.all([
    page.getByTestId('button-defendant-service-date').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateVerdict'),
  ])

  await page.getByText('Veldu saksóknara').click()
  await page
    .getByTestId('select-reviewer')
    .getByText('Test Ríkissaksóknari')
    .last()
    .click()

  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
  ])
  await page.getByTestId('modalSecondaryButton').click()

  // Case list for assigned cases
  await page.goto('/malalistar/sakamal-i-yfirlestri')
  await expect(page).toHaveURL('/malalistar/sakamal-i-yfirlestri')
  await expect(page.getByText(accusedName)).toHaveCount(1)
}
