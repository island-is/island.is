import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { mockApi } from '../../../../support/api-tools'
import { regex as uuidRegex } from 'uuidv4'
import {
  disableI18n,
  disablePreviousApplications,
  disableDelegations,
  disableObjectKey,
} from '../../../../support/disablers'

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

    await disablePreviousApplications(page)
    await disableDelegations(page)
    await disableI18n(page)

    await expect(page.locator('role=heading[name=Gagnaöflun]')).toBeVisible()
    expect(new URL(page.url()).pathname.split('/').pop()).toMatch(uuidRegex.v4)
    await page.locator('input[name="approveExternalData"]').click()
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('[data-testid="alertMessage"]')).not.toBeVisible()
    await expect(page.locator('text=Símanúmer')).toBeVisible()
    const phoneLocator = page.locator('input[name="phone"]')
    await phoneLocator.selectText()
    await page.keyboard.press('Backspace')
    await phoneLocator.type('7654321')
    const emailLocator = page.locator('input[name="email"]')
    await emailLocator.selectText()
    await page.keyboard.press('Backspace')
    await emailLocator.type('secret@island.is')
    await page.locator('button[type="submit"]').click()
  })
})
