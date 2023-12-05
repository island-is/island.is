import { BrowserContext, expect, test } from '@playwright/test'

import { JUDICIAL_SYSTEM_JUDGE_HOME_URL, urls } from '../../../support/urls'
import { judicialSystemSession } from '../../../support/session'

export function addTests() {
  test.use({ baseURL: urls.judicialSystemBaseUrl })

  test.describe('Custody Judge', () => {
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
      context = await judicialSystemSession(
        {
          browser,
        },
        JUDICIAL_SYSTEM_JUDGE_HOME_URL,
      )
    })

    test.afterAll(async () => await context.close())

    test('should submit decision in court case', async () => {
      const page = await context.newPage()

      // Case list
      page.goto('/krofur')
      await page
        .getByText('007-2023-000001Jón JónssonGæsluvarðhald')
        .getByText('Nýtt')
        .first()
        .click()

      // Reception and assignment
      await expect(page).toHaveURL(/.*\/domur\/mottaka\/.*/)
      await page.getByTestId('courtCaseNumber').fill('R-63/2023')
      await page.getByText('Veldu dómara/aðstoðarmann').click()
      await page.getByTestId('select-judge').getByText('Test Dómari').click()
      await page.getByTestId('continueButton').click()

      // Overview
      await expect(page).toHaveURL(/.*\/domur\/krafa\/.*/)
      await page.getByTestId('continueButton').isVisible()
      await page.getByTestId('continueButton').click()

      // Hearing arrangements
      await expect(page).toHaveURL(/.*\/domur\/fyrirtokutimi\/.*/)
      const date = new Date()
      const today = date.toLocaleDateString('is-IS')
      await page.locator('input[id=courtDate]').fill(today)
      await page.keyboard.press('Escape')
      await page.locator('input[id=courtDate-time]').fill('09:00')
      await page
        .locator('input[id=react-select-defenderName-input]')
        .fill('Saul Goodmann')
      await page.locator('#react-select-defenderName-option-0').click()
      await page
        .locator('input[name=defenderEmail]')
        .fill('jl-auto-defender@kolibri.is')
      await page.getByTestId('continueButton').click()
      await page.getByTestId('modalSecondaryButton').click()

      // Ruling
      await expect(page).toHaveURL(/.*\/domur\/urskurdur\/.*/)
      date.setDate(date.getDate() + 5)
      const custodyEndDate = date.toLocaleDateString('is-IS')
      await page.getByText('Krafa um gæsluvarðhald samþykkt').click()
      await page.locator('input[id=validToDate]').fill(custodyEndDate)
      await page.keyboard.press('Escape')
      await page.locator('input[id=validToDate-time]').fill('16:00')
      await page.getByTestId('continueButton').click()

      // Court record
      await expect(page).toHaveURL(/.*\/domur\/thingbok\/.*/)
      await page
        .locator('label')
        .filter({ hasText: 'Varnaraðili tekur sér lögboðinn frest' })
        .first()
        .click()
      await page
        .locator('label')
        .filter({ hasText: 'Sækjandi unir úrskurðinum' })
        .first()
        .click()
      await page.locator('input[id=courtEndTime]').fill(today)
      await page.keyboard.press('Escape')
      await page.locator('input[id=courtEndTime-time]').fill('10:00')
      await page.keyboard.press('Escape')
      await page.getByTestId('continueButton').click()

      // Confirmation
      await expect(page).toHaveURL(/.*\/domur\/stadfesta\/.*/)
      await page.getByTestId('continueButton').click()
      await page.getByTestId('modalPrimaryButton').click({ timeout: 9000 })
    })
  })
}
