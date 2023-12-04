import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../support/urls'
import { judicialSystemSession } from '../../../support/session'

export function addTests() {
  test.use({ baseURL: urls.judicialSystemBaseUrl })

  test.describe('Custody Prosecutor', () => {
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
      context = await judicialSystemSession({
        browser,
      })
    })

    test.afterAll(async () => await context.close())

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
      await page
        .locator('input[name=policeCaseNumbers]')
        .fill('007-2023-000001')
      await page.getByRole('button', { name: 'Skrá númer' }).click()
      await page.getByRole('checkbox').first().check()
      await page.locator('input[name=accusedName]').fill('Jón Jónsson')
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
      await page.getByRole('button', { name: 'Stofna mál' }).click()
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
