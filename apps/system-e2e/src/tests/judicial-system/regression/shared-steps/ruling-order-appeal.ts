import { Page, expect } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { chooseDocument, verifyUpload } from '../../utils/helpers'

// RulingOrderFileRow menu: aria-label is `Valmynd fyrir ${userGeneratedFilename}`.
// Upload sets userGeneratedFilename to "{courtCaseNumber} Úrskurður {date}"
// (AddRulingOrder), not the local file chooser name (TestUrskurdur.pdf).
const rulingOrderFileRowMenuButton = (page: Page) =>
  page.getByRole('button', {
    name: /^Valmynd fyrir .+ Úrskurður /,
  })

/**
 * Upload a mid-case ruling order (úrskurður undir rekstri máls) and confirm it
 * as the registered judge. Leaves the browser on the indictment court overview.
 */
export const judgeUploadsAndConfirmsRulingOrder = async (
  page: Page,
  caseId: string,
) => {
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.goto(`/domur/akaera/yfirlit/${caseId}`),
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
    verifyUpload(page),
    page.getByRole('button', { name: 'Já, hlaða upp' }).click(),
  ])

  await expect(page).toHaveURL(`/domur/akaera/yfirlit/${caseId}`)
  await expect(page.getByRole('button', { name: 'Staðfesta' })).toBeVisible({
    timeout: 15000,
  })

  await page.getByRole('button', { name: 'Staðfesta' }).click()
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'ConfirmRulingOrder'),
    page.getByTestId('modalPrimaryButton').click(),
  ])
}

const judgeCreatesOrderRulingSession = async (
  page: Page,
  caseId: string,
  prosecutorAppealLabel: string,
) => {
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.goto(`/domur/akaera/thingbok/${caseId}`),
  ])
  await expect(page).toHaveURL(`/domur/akaera/thingbok/${caseId}`)

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreateCourtSession'),
    page.getByRole('button', { name: 'Bæta við þinghaldi' }).click(),
  ])

  // Session accordion expands and auto-initializes judge/location/dates.
  await expect(page.getByTestId('entries')).toBeVisible({ timeout: 15000 })
  await expect(page.getByTestId('confirm-court-record')).toBeVisible()

  // The rich text editor is TipTap, which renders a contenteditable
  // element - there is no iframe to reach into.
  await page
    .getByTestId('entries')
    .locator('[contenteditable="true"]')
    .fill('Afstaða, málflutningur, og bókun vegna úrskurðar')

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
    page
      .locator('label')
      .filter({ hasText: 'Úrskurður undir rekstri máls' })
      .click(),
  ])

  await expect(
    page.locator('input[id^="result_ruling_file-"]').first(),
  ).toBeVisible({ timeout: 10000 })

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
    page.locator('input[id^="result_ruling_file-"]').first().check(),
  ])

  await page.getByTestId('ruling').fill('Úrskurðarorð úr e2e prófi')
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
    page.getByTestId('ruling').press('Tab'),
  ])

  await Promise.all([
    verifyRequestCompletion(
      page,
      '/api/graphql',
      'UpdateCourtSessionAppealDecision',
    ),
    page
      .locator('label')
      .filter({ hasText: 'Ákærði unir úrskurðinum' })
      .click(),
  ])

  await Promise.all([
    verifyRequestCompletion(
      page,
      '/api/graphql',
      'UpdateCourtSessionAppealDecision',
    ),
    page
      .locator('label')
      .filter({ hasText: prosecutorAppealLabel })
      .first()
      .click(),
  ])

  await expect(page.getByTestId('confirm-court-record')).toBeEnabled({
    timeout: 15000,
  })
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCourtSession'),
    page.getByTestId('confirm-court-record').click(),
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
  await judgeCreatesOrderRulingSession(
    page,
    caseId,
    'Sækjandi kærir úrskurðinn',
  )
}

/**
 * Create an ORDER court session where the prosecutor takes the legal deadline
 * instead of appealing in court. Leaves the ruling order open for an
 * out-of-court appeal.
 */
export const judgeCreatesOrderSessionForOutOfCourtAppeal = async (
  page: Page,
  caseId: string,
) => {
  await judgeCreatesOrderRulingSession(
    page,
    caseId,
    'Sækjandi tekur sér lögboðinn frest',
  )
}

/**
 * Prosecutor sends an out-of-court appeal for a confirmed ruling order.
 * Returns the created appealCaseId.
 */
export const prosecutorAppealsRulingOrderOutOfCourt = async (
  page: Page,
  caseId: string,
): Promise<string> => {
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.goto(`/akaera/yfirlit/${caseId}`),
  ])
  await expect(page).toHaveURL(`/akaera/yfirlit/${caseId}`)

  await rulingOrderFileRowMenuButton(page).click()
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByText('Senda inn kæru').click(),
  ])

  await expect(page).toHaveURL(new RegExp(`/kaera/${caseId}\\?rulingFileId=.+`))

  await chooseDocument(
    page,
    async () => {
      await page
        .locator('button')
        .filter({ hasText: 'Velja skjöl til að hlaða upp' })
        .first()
        .click()
    },
    'TestKaera.pdf',
  )

  const createAppealCaseResponse = await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreateAppealCase'),
    verifyUpload(page),
    page.getByTestId('continueButton').click(),
  ]).then(([res]) => res)

  const appealCaseId = createAppealCaseResponse?.data?.createAppealCase?.id
  expect(appealCaseId).toBeTruthy()

  await page.getByTestId('modalSecondaryButton').click()

  return appealCaseId as string
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
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.goto(`/domur/akaera/yfirlit/${caseId}`),
  ]).then(([res]) => res)

  await expect(page).toHaveURL(`/domur/akaera/yfirlit/${caseId}`)

  const appealCaseId = caseResponse?.data?.case?.rulingOrderAppealCases?.[0]?.id
  expect(appealCaseId).toBeTruthy()

  await rulingOrderFileRowMenuButton(page).click()
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'TransitionAppealCase'),
    page.getByText('Senda til Landsréttar').click(),
  ])
  await page.getByTestId('modalPrimaryButton').click()

  return appealCaseId as string
}
