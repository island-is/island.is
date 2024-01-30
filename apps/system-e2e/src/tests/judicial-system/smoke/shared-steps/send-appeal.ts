import { Page, expect } from '@playwright/test'
import { uploadDocument } from '../../utils/helpers'

export async function prosecutorAppealsCaseTest(page: Page, caseId: string) {
  await page.goto(`krafa/yfirlit/${caseId}`)

  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await page.getByRole('button', { name: 'Senda inn kæru' }).click()

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
  await page.getByTestId('modalSecondaryButton').click()

  // Overview
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await page.getByRole('button', { name: 'Senda greinargerð' }).click()

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
