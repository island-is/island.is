import { Page, expect } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import { createFakePdf } from '../../utils/helpers'

export async function prosecutorAppealsCaseTest(page: Page, caseId: string) {
  await page.goto(`krafa/yfirlit/${caseId}`)

  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await page.getByRole('button', { name: 'Senda inn kæru' }).click()

  // Send appeal
  await expect(page).toHaveURL(`/kaera/${caseId}`)
  const appealFileChooserPromise = page.waitForEvent('filechooser')
  await page
    .locator('section')
    .filter({
      hasText:
        'Kæra *Dragðu skjöl hingað til að hlaða uppTekið er við skjölum með endingu: .pdf',
    })
    .locator('button')
    .first()
    .click()

  const appealFileChooser = await appealFileChooserPromise
  await page.waitForTimeout(1000)

  await appealFileChooser.setFiles(await createFakePdf('TestKaera.pdf'))
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
    verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
  ])

  const appealCaseFileChooserPromise = page.waitForEvent('filechooser')
  await page
    .locator('section')
    .filter({
      hasText:
        'GögnEf ný gögn eiga að fylgja kærunni er hægt að hlaða þeim upp hér að neðan. At',
    })
    .locator('button')
    .first()
    .click()
  const appealCaseFileChooser = await appealCaseFileChooserPromise
  await page.waitForTimeout(1000)

  await appealCaseFileChooser.setFiles(
    await createFakePdf('TestKaerugognSaekjanda.pdf'),
  )
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
    verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
  ])

  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalSecondaryButton').click()

  // Overview
  await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
  await page.getByRole('button', { name: 'Senda greinargerð' }).click()

  // Send statement
  await expect(page).toHaveURL(`/greinargerd/${caseId}`)
  const statementFileChooserPromise = page.waitForEvent('filechooser')
  await page
    .locator('section')
    .filter({
      hasText:
        'Greinargerð *Dragðu skjöl hingað til að hlaða uppTekið er við skjölum með ending',
    })
    .locator('button')
    .click()
  const statementFileChooser = await statementFileChooserPromise
  await page.waitForTimeout(1000)
  await statementFileChooser.setFiles(
    await createFakePdf('TestGreinargerdSaekjanda.pdf'),
  )
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
    verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
  ])

  const statementCaseFileChooserPromise = page.waitForEvent('filechooser')
  await page
    .locator('section')
    .filter({
      hasText:
        'GögnEf ný gögn eiga að fylgja greinargerðinni er hægt að hlaða þeim upp hér að n',
    })
    .locator('button')
    .click()

  const statementCaseFileChooser = await statementCaseFileChooserPromise
  await page.waitForTimeout(1000)

  await statementCaseFileChooser.setFiles(
    await createFakePdf('TestGreinargerdargognSaekjanda.pdf'),
  )
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
    verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
  ])

  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalSecondaryButton').click()
}
