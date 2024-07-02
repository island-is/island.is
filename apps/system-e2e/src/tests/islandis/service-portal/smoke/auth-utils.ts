import { expect, Page, test } from '@playwright/test'
import { urls } from '../../../../support/urls'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

export const switchDelegation = async (
  page: Page,
  delegationType: 'Prókúra' | 'Forsjá',
) => {
  await page.locator('data-testid=user-menu >> visible=true').click()
  await page.locator('role=button[name="Skipta um notanda"]').click()

  const firstDelegation = page
    .locator(`role=button[name*="${delegationType}"]`)
    .first()
  await expect(firstDelegation).toBeVisible()

  const delegationName = await firstDelegation
    .locator('.identity-card--name')
    .textContent()
  expect(delegationName).toBeTruthy()

  await firstDelegation.click()
  await page.waitForURL(new RegExp(homeUrl), {
    waitUntil: 'domcontentloaded',
  })

  return delegationName
}
