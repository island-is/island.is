import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '@island.is/testing/e2e'
import { session } from '@island.is/testing/e2e'
import {
  disableI18n,
  disablePreviousApplications,
  disableDelegations,
  proceed,
} from '@island.is/testing/e2e'
import { regex as uuidRegex } from 'uuidv4'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('P-sign', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: `/umsoknir/p-merki`,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('should be able to create application', async () => {
    const page = await context.newPage()
    await page.goto('/umsoknir/p-merki?delegationChecked=true')
    await expect(page).toBeApplication('p-merki')

    await disablePreviousApplications(page)
    await disableDelegations(page)
    await disableI18n(page)

    await expect(page.locator('role=heading[name=Gagnaöflun]')).toBeVisible()
    expect(new URL(page.url()).pathname.split('/').pop()).toMatch(uuidRegex.v4)
    await page.locator('input[name="approveExternalData"]').click()
    await proceed(page)
    await expect(page.locator('[data-testid="alertMessage"]')).not.toBeVisible()
    await expect(page.locator('text=Símanúmer')).toBeVisible()
    const phoneLocator = page.locator('input[name="phone"]')
    await phoneLocator.selectText()
    await page.keyboard.press('Backspace')
    await phoneLocator.fill('7654321')
    const emailLocator = page.locator('input[name="email"]')
    await emailLocator.selectText()
    await page.keyboard.press('Backspace')
    await emailLocator.fill('secret@island.is')
    await proceed(page)
  })
})
