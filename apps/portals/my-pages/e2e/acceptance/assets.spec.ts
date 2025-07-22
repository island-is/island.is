import { BrowserContext, expect, test } from '@playwright/test'
import { setupXroadMocks } from './setup-xroad.mocks'

import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'
import { messages } from '@island.is/portals/my-pages/assets/messages'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Fasteignir', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-othekkt.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0104359',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('should display real estate asset overview', async () => {
    // Arrange
    const page = await context.newPage()

    await setupXroadMocks()
    await disableI18n(page)

    await page.goto(icelandicAndNoPopupUrl('/minarsidur/eignir/fasteignir'))

    // Act
    const headline = page.getByRole('heading', {
      name: 'Fasteignir',
    })

    const detailButton = page
      .locator(`[data-testid="action-card-cta"]`)
      .getByRole('button')
      .first()

    // Assert
    await expect(headline).toBeVisible({ timeout: 10000 })
    await expect(detailButton).toBeVisible()
  })

  test('should display real estate asset detail page', async () => {
    // Arrange
    const page = await context.newPage()

    await setupXroadMocks()
    await disableI18n(page)

    await page.goto(
      icelandicAndNoPopupUrl('/minarsidur/eignir/fasteignir/F12345'),
    )

    // Act
    const propertyNumber = page.getByText('RVK - F12345')

    // Assert
    await expect(propertyNumber).toBeVisible()

    await expect(page.locator('role=table').first()).toContainText(
      label(messages.legalOwners),
    )
  })
})
