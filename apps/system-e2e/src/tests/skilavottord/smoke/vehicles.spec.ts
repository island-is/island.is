import { BrowserContext, expect, test } from '@playwright/test'
import { AuthUrl, getEnvironmentBaseUrl, urls } from '../../../support/utils'
import { session } from '../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session(
      context,
      browser,
      'vehicles.json',
      `${urls.islandisBaseUrl}/app/skilavottord/my-cars`,
      `${urls.islandisBaseUrl}/app/skilavottord`,
      true,
      true,
      '0103019',
      getEnvironmentBaseUrl(AuthUrl.staging),
    )
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('should render list', async () => {
    const page = await context.newPage()
    await page.goto('/app/skilavottord/my-cars')
    await expect(page.locator('text=Úrvinnsla ökutækis')).toBeTruthy()
    await expect(page.locator('text=Þín ökutæki')).toBeTruthy()
    // await expect(page.locator('text=Þín ökutæki')).toBeTruthy()

    // cy.contains('Úrvinnsla ökutækis')
    // cy.contains('Þín ökutæki')
    // cy.get('p:contains(Óendurvinnanlegt)').should('have.length.gt', 1)
    // cy.contains('Förguð ökutæki')
    // cy.get('button:contains(Endurunnin)').should('have.length.gt', 1)
  })
})
