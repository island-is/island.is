import { Page, expect } from '@playwright/test'
import { uploadDocument } from '../../utils/helpers'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export async function prosecutorAppealsCaseTest(page: Page, caseId: string) {
  await page.goto(`krafa/yfirlit/${caseId}`)
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await Promise.all([
    page.getByRole('button', { name: 'Senda inn kæru' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Send appeal
  await expect(page).toHaveURL(`/kaera/${caseId}`)
  await uploadDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestKaera.pdf',
  )
  await uploadDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(3)
        .click()
    },
    'TestKaerugognSaekjanda.pdf',
  )
  await page.getByTestId('continueButton').click()
  await Promise.all([
    page.getByTestId('modalSecondaryButton').click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Overview
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await Promise.all([
    page.getByRole('button', { name: 'Senda greinargerð' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Send statement
  await expect(page).toHaveURL(`/greinargerd/${caseId}`)
  await uploadDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestGreinargerdSaekjanda.pdf',
  )
  await uploadDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(3)
        .click()
    },
    'TestGreinargerdargognSaekjanda.pdf',
  )
  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalSecondaryButton').click()
}
