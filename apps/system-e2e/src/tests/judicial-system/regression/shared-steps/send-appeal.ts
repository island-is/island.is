import { Page, expect } from '@playwright/test'
import { chooseDocument, verifyUpload } from '../../utils/helpers'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export const prosecutorAppealsCaseTest = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await Promise.all([
    page.getByRole('button', { name: 'Senda inn kæru' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])

  // Send appeal
  await expect(page).toHaveURL(`/kaera/${caseId}`)
  await chooseDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestKaera.pdf',
  )
  await chooseDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(3)
        .click()
    },
    'TestKaerugognSaekjanda.pdf',
  )
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyUpload(page),
  ])
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
  await expect(page).toHaveURL(`/kaera/greinargerd/${caseId}`)
  await chooseDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestGreinargerdSaekjanda.pdf',
  )
  await chooseDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(3)
        .click()
    },
    'TestGreinargerdargognSaekjanda.pdf',
  )
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyUpload(page),
  ])
  await page.getByTestId('modalSecondaryButton').click()
}

export const defenderAppealsCaseTest = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`/verjandi/krafa/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCase'),
  ])
  await expect(page).toHaveURL(`/verjandi/krafa/${caseId}`)

  // The appeal banner links to the limited-access appeal screen while the
  // appeal deadline is open
  await Promise.all([
    page.getByRole('button', { name: 'Senda inn kæru' }).click(),
    verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCase'),
  ])

  // Send appeal - only the appeal brief is required
  await expect(page).toHaveURL(`/verjandi/kaera/${caseId}`)
  await chooseDocument(
    page,
    async () => {
      await page
        .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
        .nth(1)
        .click()
    },
    'TestKaeraVerjanda.pdf',
  )
  await Promise.all([
    page.getByTestId('continueButton').click(),
    verifyUpload(page, true),
    verifyRequestCompletion(
      page,
      '/api/graphql',
      'LimitedAccessCreateAppealCase',
    ),
  ])
  await page.getByTestId('modalSecondaryButton').click()

  // Back on the overview the appeal state is visible to the defender
  await expect(page).toHaveURL(`/verjandi/krafa/${caseId}`)
  await expect(page.getByText('Úrskurður kærður')).toBeVisible()
}
