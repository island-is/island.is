import { BrowserContext, expect, test } from '@playwright/test'
import { ProjectBasePath } from '@island.is/shared/constants'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Endorsements', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl: `${urls.islandisBaseUrl}${ProjectBasePath.ServicePortal}`,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should be able to access and see UI elements in minar-sidur for endorsements', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    // Navigate to the specified page
    await page.goto(
      icelandicAndNoPopupUrl(
        `${ProjectBasePath.ServicePortal}/min-gogn/listar`,
      ),
    )

    // Check for ui things
    await expect(
      page.locator('button:text("Stofna nýjan lista")'),
    ).toBeVisible()

    // check for tabs
    await expect(page.locator('button:text("Virkir listar")')).toBeVisible()
    await expect(page.locator('button:text("Liðnir listar")')).toBeVisible()
  })
})
