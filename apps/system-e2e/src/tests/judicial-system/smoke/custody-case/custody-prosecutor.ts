import { BrowserContext, expect, test } from '@playwright/test'
import path from 'path'

import { urls } from '../../../../support/urls'
import { judicialSystemSession } from '../../../../support/session'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export async function createNewCustodyCase(
  accusedName: string,
  policeCaseNumber: string,
) {
  test.use({ baseURL: urls.judicialSystemBaseUrl })
  test.describe('Custody Prosecutor', () => {
    let context: BrowserContext
    test.beforeAll(async ({ browser }) => {
      context = await judicialSystemSession({
        browser,
      })
    })

    test.afterAll(async () => {
      await context.close()
    })

    test('should submit a custody request to court', async () => {
      const page = await context.newPage()

      // Case list
      page.goto('/krofur')
      await page.getByRole('button', { name: 'Nýtt mál' }).click()
      await page.getByRole('menuitem', { name: 'Gæsluvarðhald' }).click()
      await expect(page).toHaveURL('/krafa/ny/gaesluvardhald')

      // New custody request
      await expect(
        page.getByRole('heading', { name: 'Gæsluvarðhald' }),
      ).toBeVisible()
      await page.locator('input[name=policeCaseNumbers]').fill(policeCaseNumber)
      await page.getByRole('button', { name: 'Skrá númer' }).click()
      await page.getByRole('checkbox').first().check()
      await page.locator('input[name=accusedName]').fill(accusedName)
      await page.locator('input[name=accusedAddress]').fill('Einhversstaðar 1')
      await page.locator('#defendantGender').click()
      await page.locator('#react-select-defendantGender-option-0').click()
      await page
        .locator('input[id=react-select-defenderName-input]')
        .fill('Saul Goodman')
      await page.locator('#react-select-defenderName-option-0').click()
      await page
        .locator('input[name=defenderEmail]')
        .fill('jl-auto-defender@kolibri.is')
      await page.locator('input[name=defender-access-no]').click()
      await page.locator('input[name=leadInvestigator]').fill('Stjórinn')

      Promise.all([
        page.getByRole('button', { name: 'Stofna mál' }).click(),
        verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
      ])

      await expect(page).toHaveURL(/.*\/krafa\/fyrirtaka\/.*/)

      // Court date request
      const today = new Date().toLocaleDateString('is-IS')
      await page.locator('input[id=arrestDate]').fill(today)
      await page.keyboard.press('Escape')
      await page.locator('input[id=arrestDate-time]').fill('00:00')
      await page.locator('input[id=reqCourtDate]').fill(today)
      await page.keyboard.press('Escape')
      await page.locator('input[id=reqCourtDate-time]').fill('15:00')
      await page.getByRole('button', { name: 'Halda áfram' }).click()
      await page.getByRole('button', { name: 'Halda áfram með kröfu' }).click()
      await expect(page).toHaveURL(
        /.*\/krafa\/domkrofur-og-lagagrundvollur\/.*/,
      )

      // Prosecutor demands
      await page.locator('input[id=reqValidToDate]').fill(today)
      await page.keyboard.press('Escape')
      await page.locator('input[id=reqValidToDate-time]').fill('16:00')
      await page.waitForResponse((response) => {
        return response.request().url().includes('/graphql')
      })
      await page.locator('textarea[name=lawsBroken]').click({ delay: 50 })
      await page.keyboard.type('Einhver lög voru brotin', { delay: 50 })
      await page.getByTestId('checkbox').first().click()
      await page.getByRole('button', { name: 'Halda áfram' }).click()
      await expect(page).toHaveURL(/.*\/krafa\/greinargerd\/.*/)

      // Prosecutor statement
      await page.waitForResponse((response) => {
        return response.request().url().includes('/graphql')
      })
      await page.locator('textarea[name=caseFacts]').click({ delay: 50 })
      await page.keyboard.type('Eitthvað gerðist', { delay: 50 })
      await page.locator('textarea[name=legalArguments]').click()
      await page.keyboard.type('Þetta er ekki löglegt')
      await page.locator('textarea[name=comments]').click()
      await page.keyboard.type('Sakborningur er hættulegur')
      await page.getByRole('button', { name: 'Halda áfram' }).click()
      await expect(page).toHaveURL(/.*\/krafa\/rannsoknargogn\/.*/)

      // Case files
      await page.locator('textarea[name=caseFilesComments]').click()
      await page.keyboard.type('Engin gögn fylgja')
      await page.getByRole('button', { name: 'Halda áfram' }).click()
      await expect(page).toHaveURL(/.*\/krafa\/stadfesta\/.*/)

      // Submit to court
      await page
        .getByRole('button', { name: 'Senda kröfu á héraðsdóm' })
        .click()
      await page.getByRole('button', { name: 'Loka glugga' }).click()
      await expect(page).toHaveURL(/.*\/krofur/)
    })
  })
}

export function appealCase(
  accusedName: string,
  policeCaseNumber: string,
  courtCaseNumber: string,
) {
  test.use({ baseURL: urls.judicialSystemBaseUrl })

  test.describe('Custody Prosecutor', () => {
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
      context = await judicialSystemSession({
        browser,
      })
    })

    test.afterAll(async () => await context.close())

    test('should appeal case', async () => {
      const page = await context.newPage()
      await page.goto('/krofur')

      await page
        .getByRole('row', {
          name: `${courtCaseNumber} ${policeCaseNumber} ${accusedName} Gæsluvarðhald`,
        })
        .getByRole('cell', { name: `${courtCaseNumber} ${policeCaseNumber}` })
        .locator('span')
        .first()
        .click()

      await expect(page).toHaveURL(/.*\/krafa\/yfirlit\/.*/)
      await page.getByRole('button', { name: 'Senda inn kæru' }).click()

      // Send appeal
      await expect(page).toHaveURL(/.*\/kaera\/.*/)
      const fileChooserPromise = page.waitForEvent('filechooser')
      await page
        .locator('section')
        .filter({
          hasText:
            'Kæra *Dragðu skjöl hingað til að hlaða uppTekið er við skjölum með endingu: .pdf',
        })
        .locator('button')
        .click()
      const fileChooser = await fileChooserPromise
      await page.waitForTimeout(100)
      await fileChooser.setFiles(path.join(__dirname, 'TestAppeal.pdf'))

      await Promise.all([
        verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
        verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
      ])
      await page.getByTestId('continueButton').click()
      await page.getByTestId('modalSecondaryButton').click()

      // Overview
      await expect(page).toHaveURL(/.*\/krafa\/yfirlit\/.*/)
      await page.getByRole('button', { name: 'Senda greinargerð' }).click()

      // Send statement
      await expect(page).toHaveURL(/.*\/greinargerd\/.*/)
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
      await page.waitForTimeout(100)
      await statementFileChooser.setFiles(
        path.join(__dirname, 'TestAppeal.pdf'),
      )
      await Promise.all([
        verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
        verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
      ])
      await page.getByTestId('continueButton').click()
      await page.getByTestId('modalSecondaryButton').click()
    })
  })
}
