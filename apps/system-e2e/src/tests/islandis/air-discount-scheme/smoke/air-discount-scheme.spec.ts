import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { graphqlSpy } from '../../../../support/api-tools'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.adsBaseUrl })

test.describe('Air discount scheme', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'loftbru.json',
      homeUrl: `${urls.adsBaseUrl}/min-rettindi`,
      idsLoginOn: {
        nextAuth: {
          nextAuthRoot: urls.adsBaseUrl,
        },
      },
      phoneNumber: '0103019',
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should return discounts response array', async () => {
    const page = await context.newPage()
    const { extractor } = await graphqlSpy(
      page,
      '/api/graphql**',
      'DiscountsQuery',
    )
    await page.goto('/min-rettindi')
    await expect
      .poll(
        extractor((op) => op.response.data.discounts[0].discountCode),
        {
          message: 'Did not find discount code',
          timeout: 10000,
        },
      )
      .toHaveLength('X211T12F'.length)
  })

  test("should have user's name in the api response", async () => {
    const page = await context.newPage()
    const { extractor } = await graphqlSpy(
      page,
      '/api/graphql**',
      'DiscountsQuery',
    )
    await page.goto('/min-rettindi')

    await expect
      .poll(
        extractor((op) => op.response.data.discounts[0].user.name),
        {
          message: 'Did not find discount code',
          timeout: 10000,
        },
      )
      .toBe('Gervimaður Afríka')
  })

  test('should have user with valid discount code', async () => {
    const page = await context.newPage()
    const { data } = await graphqlSpy(page, '/api/graphql**', 'DiscountsQuery')
    await page.goto('/min-rettindi')
    await expect
      .poll(
        () => data((op) => op.response.data.discounts[0].user.name).length,
        {
          message: 'Did not find user name',
          timeout: 10000,
        },
      )
      .toBeGreaterThan(4)
    const myRightsRegion = page.locator('role=region[name="Mín réttindi"]')
    await expect(myRightsRegion).toBeVisible()
    await expect(myRightsRegion).toContainText(
      data((op) => op.response.data.discounts[0].user.name),
    )
    await expect(myRightsRegion).toContainText(
      data((op) => op.response.data.discounts[0].discountCode),
    )

    await myRightsRegion.locator('role=button').first().click()

    await expect(
      page.locator('role=alert', { hasText: 'Afritun tókst' }),
    ).toBeVisible()
  })
})
