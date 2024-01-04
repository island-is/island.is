import { BrowserContext, expect, test } from '@playwright/test'
import path from 'path'

import {
  JUDICIAL_SYSTEM_COA_JUDGE_HOME_URL,
  urls,
} from '../../../../support/urls'
import { judicialSystemSession } from '../../../../support/session'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export function completeAppealRuling(
  courtCaseNumber: string,
  policeCaseNumber: string,
  appealCaseNumber: string,
) {
  test.use({ baseURL: urls.judicialSystemBaseUrl })

  test.describe('Custody COA Judge', () => {
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
      context = await judicialSystemSession({
        browser,
        homeUrl: JUDICIAL_SYSTEM_COA_JUDGE_HOME_URL,
      })
    })

    test.afterAll(async () => await context.close())

    test('should submit decision in appeal case', async () => {
      const page = await context.newPage()
      // Case list
      page.goto('/landsrettur/krofur/')

      await page
        .getByRole('cell', { name: `${courtCaseNumber} ${policeCaseNumber}` })
        .first()
        .click()

      // Overview
      await expect(page).toHaveURL(/.*\/landsrettur\/yfirlit\/.*/)
      await page.getByTestId('continueButton').click()

      // // Appeal case reception
      await expect(page).toHaveURL(/.*\/landsrettur\/kaera\/.*/)
      await page.getByText('Mál nr. *').fill(appealCaseNumber)
      await page.getByText('Mál nr. *').press('Tab')
      await page
        .getByTestId('select-assistant')
        .getByTestId('icon-chevronDown')
        .click({ delay: 50 })
      await page.locator('#react-select-assistant-option-0').click()
      await page.getByTestId('icon-chevronDown').nth(2).click()
      await page.locator('#react-select-judge-option-0').click()
      await page.getByTestId('icon-chevronDown').nth(3).click()
      await page.locator('#react-select-judge-option-0').click()
      await page.getByTestId('icon-chevronDown').nth(4).click()
      await page.locator('#react-select-judge-option-0').click()
      await page.getByTestId('continueButton').click()
      await page.getByTestId('modalPrimaryButton').click()

      // Ruling
      await expect(page).toHaveURL(/.*\/landsrettur\/urskurdur\/.*/)
      await Promise.all([
        await page.locator('label').filter({ hasText: 'Staðfesting' }).click(),
        verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      ])
      await page.getByPlaceholder('Hver eru úrskurðarorð Landsréttar?').click()
      await page
        .getByPlaceholder('Hver eru úrskurðarorð Landsréttar?')
        .fill('Test úrskurðarorð Landsréttar')
      await page
        .getByPlaceholder('Hver eru úrskurðarorð Landsréttar?')
        .press('Tab')

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Velja gögn til að hlaða upp').click({ delay: 100 })
      const fileChooser = await fileChooserPromise
      await page.waitForTimeout(1000)
      await fileChooser.setFiles(path.join(__dirname, 'TestAppeal.pdf'))
      await Promise.all([
        verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
        verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
      ])

      await page.getByTestId('continueButton').click()
      await expect(page).toHaveURL(/.*\/landsrettur\/samantekt\/.*/)
      await page.getByTestId('continueButton').click()
    })
  })
}
