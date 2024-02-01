import { Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../support/api-tools'

export function randomPoliceCaseNumber() {
  return `007-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`
}

export function randomCourtCaseNumber() {
  return `R-${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

export function randomAppealCaseNumber() {
  return `${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

export function getDaysFromNow(days = 0) {
  const day = 24 * 60 * 60 * 1000
  const daysAdded = day * days

  return new Date(new Date().getTime() + daysAdded).toLocaleDateString('is-IS')
}

async function createFakePdf(title: string) {
  return {
    name: title,
    mimeType: 'application/pdf',
    buffer: Buffer.from(
      "%PDF-1.2 \n9 0 obj\n<<\n>>\nstream\nBT/ 32 Tf(  TESTING   )' ET\nendstream\nendobj\n4 0 obj\n<<\n/Type /Page\n/Parent 5 0 R\n/Contents 9 0 R\n>>\nendobj\n5 0 obj\n<<\n/Kids [4 0 R ]\n/Count 1\n/Type /Pages\n/MediaBox [ 0 0 175 50 ]\n>>\nendobj\n3 0 obj\n<<\n/Pages 5 0 R\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n/Root 3 0 R\n>>\n%%EOF",
    ),
  }
}

export async function uploadDocument(
  page: Page,
  clickButton: () => Promise<void>,
  fileName: string,
  isLimitedAccess = false,
) {
  const fileChooserPromise = page.waitForEvent('filechooser')
  await clickButton()

  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(await createFakePdf(fileName))

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
