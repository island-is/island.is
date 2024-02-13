import { Page, expect } from '@playwright/test'
import { uploadDocument } from '../../utils/helpers'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export async function prosecutorAppealsCaseTest(page: Page, caseId: string) {
  await page.goto(`krafa/yfirlit/${caseId}`)

  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await page.getByRole('button', { name: 'Senda inn kæru' }).click()

  // Send appeal
  await Promise.all([
    expect(page).toHaveURL(`/kaera/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

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
  await page.getByTestId('modalSecondaryButton').click()

  // Overview
  await Promise.all([
    expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  await page.getByRole('button', { name: 'Senda greinargerð' }).click()

  // Send statement
  await Promise.all([
    expect(page).toHaveURL(`/greinargerd/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

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
