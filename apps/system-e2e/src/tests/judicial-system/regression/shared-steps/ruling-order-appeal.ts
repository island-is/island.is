import { Page, expect } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { chooseDocument, verifyUpload } from '../../utils/helpers'

/**
 * Upload a mid-case ruling order (úrskurður undir rekstri máls) and confirm it
 * as the registered judge. Leaves the browser on the indictment court overview.
 */
export const judgeUploadsAndConfirmsRulingOrder = async (
  page: Page,
  caseId: string,
) => {
  await Promise.all([
    page.goto(`/domur/akaera/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  await expect(page).toHaveURL(`/domur/akaera/yfirlit/${caseId}`)

  await page
    .getByRole('button', { name: 'Hlaða upp úrskurði undir rekstri máls' })
    .click()
  await expect(page).toHaveURL(`/domur/akaera/urskurdir/${caseId}`)

  await chooseDocument(
    page,
    async () => {
      // Prefer the inner <button> — the UploadFiles dropzone wrapper also has
      // role="button" and includes the same label in its accessible name.
      await page
        .locator('button')
        .filter({ hasText: 'Velja skjöl til að hlaða upp' })
        .click()
    },
    'TestUrskurdur.pdf',
  )

  await page.getByTestId('continueButton').click()
  await Promise.all([
    page.getByRole('button', { name: 'Já, hlaða upp' }).click(),
    verifyUpload(page),
  ])

  await expect(page).toHaveURL(`/domur/akaera/yfirlit/${caseId}`)
  await expect(page.getByRole('button', { name: 'Staðfesta' })).toBeVisible({
    timeout: 15000,
  })

  await page.getByRole('button', { name: 'Staðfesta' }).click()
  await Promise.all([
    page.getByTestId('modalPrimaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'ConfirmRulingOrder'),
  ])
}

/**
 * Create an ORDER court session, record prosecutor in-court appeal (defendant
 * accepts), and confirm the court record. Auto-creates the AppealCase.
 */
export const judgeCreatesInCourtRulingOrderAppeal = async (
  page: Page,
  caseId: string,
) => {
  await Promise.all([
    page.goto(`/domur/akaera/thingbok/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  await expect(page).toHaveURL(`/domur/akaera/thingbok/${caseId}`)

  await Promise.all([
    page.getByRole('button', { name: 'Bæta við þinghaldi' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'CreateCourtSession'),
  ])

  // Session accordion expands and auto-initializes judge/location/dates.
  await expect(page.getByTestId('entries')).toBeVisible({ timeout: 15000 })
  await expect(page.getByTestId('confirm-court-record')).toBeVisible()

  await page
    .getByTestId('entries')
    .frameLocator('iframe')
    .locator('body')
    .fill('Afstaða, málflutningur, og bókun vegna úrskurðar')

  await Promise.all([
    page
      .locator('label')
      .filter({ hasText: 'Úrskurður undir rekstri máls' })
      .click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
  ])

  await expect(
    page.locator('input[id^="result_ruling_file-"]').first(),
  ).toBeVisible({ timeout: 10000 })

  await Promise.all([
    page.locator('input[id^="result_ruling_file-"]').first().check(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
  ])

  await page.getByTestId('ruling').fill('Úrskurðarorð úr e2e prófi')
  await Promise.all([
    page.getByTestId('ruling').press('Tab'),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
  ])

  await Promise.all([
    page
      .locator('label')
      .filter({ hasText: 'Ákærði unir úrskurðinum' })
      .click(),
    verifyRequestCompletion(
      page,
      '/api/graphql',
      'UpdateCourtSessionAppealDecision',
    ),
  ])

  await Promise.all([
    page
      .locator('label')
      .filter({ hasText: 'Sækjandi kærir úrskurðinn' })
      .first()
      .click(),
    verifyRequestCompletion(
      page,
      '/api/graphql',
      'UpdateCourtSessionAppealDecision',
    ),
  ])

  await expect(page.getByTestId('confirm-court-record')).toBeEnabled({
    timeout: 15000,
  })
  await Promise.all([
    page.getByTestId('confirm-court-record').click(),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
  ])
}

/**
 * District court receives the in-court ruling-order appeal and notifies COA.
 * Returns the appealCaseId from the loaded Case query.
 */
export const judgeReceivesRulingOrderAppeal = async (
  page: Page,
  caseId: string,
): Promise<string> => {
  const caseResponse = await Promise.all([
    page.goto(`/domur/akaera/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ]).then(([, res]) => res)

  await expect(page).toHaveURL(`/domur/akaera/yfirlit/${caseId}`)

  const appealCaseId =
    caseResponse?.data?.case?.rulingOrderAppealCases?.[0]?.id
  expect(appealCaseId).toBeTruthy()

  await page.getByLabel(/Valmynd fyrir/).click()
  await Promise.all([
    page.getByText('Senda til Landsréttar').click(),
    verifyRequestCompletion(page, '/api/graphql', 'TransitionAppealCase'),
  ])
  await page.getByTestId('modalPrimaryButton').click()

  return appealCaseId as string
}
