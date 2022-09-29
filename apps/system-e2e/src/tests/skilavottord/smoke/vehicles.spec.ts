import { BrowserContext, expect, test } from '@playwright/test'
import { AuthUrl, getEnvironmentBaseUrl, urls } from '../../../support/utils'
import { session } from '../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe.skip('Service portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'vehicles.json',
      homeUrl: `${urls.islandisBaseUrl}/app/skilavottord/my-cars`,
      phoneNumber: '0103019',
      idsLoginOn: {
        nextAuth: {
          nextAuthRoot: `${urls.islandisBaseUrl}/app/skilavottord`,
        },
      },
      authUrl: getEnvironmentBaseUrl(AuthUrl.staging),
    })
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
