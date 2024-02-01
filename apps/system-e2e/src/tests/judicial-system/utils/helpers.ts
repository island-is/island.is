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
    buffer: Buffer.from(new ArrayBuffer(0)),
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
