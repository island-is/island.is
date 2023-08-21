import { BrowserContext, expect, test } from '@playwright/test'

import { urls } from '../../../support/urls'
import { judicialSystemSession } from '../../../support/session'

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
    await expect(page.getByRole('table')).toHaveCount(2)
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Gæsluvarðhald' }).click()

    // New custody request
    await expect(page).toHaveURL('/krafa/ny/gaesluvardhald')
    await expect(
      page.getByRole('heading', { name: 'Gæsluvarðhald' }),
    ).toBeVisible()
    await page.locator('input[name=policeCaseNumbers]').fill('007-2023-000001')
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
    await page.getByRole('checkbox').last().check()
    await page.locator('input[name=leadInvestigator]').fill('Stjórinn')
    await page.getByRole('button', { name: 'Stofna mál' }).click()
    await expect(page).toHaveURL(/.*\/krafa\/fyrirtaka\/.*/)

    // Court date request
  })
})
