import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../support/api-tools'

export const randomPoliceCaseNumber = () => {
  return `007-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`
}

// The app validates R-/S- case numbers as 1-5 digits and appeal case
// numbers as 1-4 digits, so these draw from the full allowed space to
// minimize collisions with cases left behind by previous runs.
export const randomCourtCaseNumber = (prefix?: string) => {
  return `${prefix ?? 'R'}-${Math.floor(
    Math.random() * 100000,
  )}/${new Date().getFullYear()}`
}

export const randomIndictmentCourtCaseNumber = () => {
  return randomCourtCaseNumber('S')
}

export const randomAppealCaseNumber = () => {
  return `${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`
}

export const getDaysFromNow = (days = 0) => {
  const day = 24 * 60 * 60 * 1000
  const daysAdded = day * days

  return new Date(new Date().getTime() + daysAdded).toLocaleDateString('is-IS')
}

// The defender login fixture uses national id 0909090909, which does not
// exist in the LMFÍ lawyer registry backing the defender comboboxes. The
// registry response is intercepted and the test defender prepended so the
// real selection UI (and its mutations) can be driven end to end.
export const testDefender = {
  name: 'Test Verjandi',
  practice: 'Réttarvörslugátt',
  email: 'verjandi@dummy.dd',
  phoneNr: '1111111',
  nationalId: '0909090909',
  isLitigator: true,
}

export const injectTestDefenderIntoLawyerRegistry = async (page: Page) => {
  await page.route('**/api/defender/lawyerRegistry*', async (route) => {
    const response = await route.fetch()
    let lawyers: unknown[] = []
    if (response.ok()) {
      try {
        lawyers = await response.json()
      } catch {
        lawyers = []
      }
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([testDefender, ...lawyers]),
    })
  })
}

// Selects the test defender in an InputAdvocate lawyer combobox. Assumes
// injectTestDefenderIntoLawyerRegistry has been called on the page.
export const selectTestDefender = async (page: Page) => {
  await page.locator('#advocateName').click()
  await page.keyboard.type(testDefender.name)
  await page
    .locator('[id^="react-select-advocateName-option"]')
    .filter({ hasText: testDefender.name })
    .first()
    .click()
  // Selecting a lawyer auto-fills email and phone from the registry entry.
  await expect(page.getByTestId('defenderEmail')).toHaveValue(
    testDefender.email,
  )
}

const createFakePdf = (title: string) => {
  return {
    name: title,
    mimeType: 'application/pdf',
    buffer: Buffer.from(
      "%PDF-1.2 \n9 0 obj\n<<\n>>\nstream\nBT/ 32 Tf(  TESTING   )' ET\nendstream\nendobj\n4 0 obj\n<<\n/Type /Page\n/Parent 5 0 R\n/Contents 9 0 R\n>>\nendobj\n5 0 obj\n<<\n/Kids [4 0 R ]\n/Count 1\n/Type /Pages\n/MediaBox [ 0 0 175 50 ]\n>>\nendobj\n3 0 obj\n<<\n/Pages 5 0 R\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n/Root 3 0 R\n>>\n%%EOF",
    ),
  }
}

export const chooseDocument = async (
  page: Page,
  clickButton: () => Promise<void>,
  fileName: string,
) => {
  const fileChooserPromise = page.waitForEvent('filechooser')
  await clickButton()

  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(createFakePdf(fileName))
}

export const verifyUpload = async (page: Page, isLimitedAccess = false) => {
  await Promise.all([
    verifyRequestCompletion(
      page,
      '/api/graphql',
      isLimitedAccess
        ? 'LimitedAccessCreatePresignedPost'
        : 'CreatePresignedPost',
    ),
    verifyRequestCompletion(
      page,
      '/api/graphql',
      isLimitedAccess ? 'LimitedAccessCreateFile' : 'CreateFile',
    ),
  ])
}

export const uploadDocument = async (
  page: Page,
  clickButton: () => Promise<void>,
  fileName: string,
  isLimitedAccess = false,
) => {
  return Promise.all([
    chooseDocument(page, clickButton, fileName),
    verifyUpload(page, isLimitedAccess),
  ])
}
