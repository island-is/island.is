import { BrowserContext, expect, test } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  disableI18n,
} from '@island.is/testing/e2e'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Endorsements', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
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

    const timeout = 10000

    await page.goto(icelandicAndNoPopupUrl('/minarsidur/min-gogn/listar'))

    await Promise.all([
      expect(
        page.getByRole('button', { name: 'Stofna nýjan lista' }),
      ).toBeVisible({ timeout }),
      expect(
        page.getByRole('link', { name: 'Almennir undirskriftalistar' }),
      ).toBeVisible({ timeout }),
      expect(page.getByRole('tab', { name: 'Virkir listar' })).toBeVisible({
        timeout,
      }),
      expect(page.getByRole('tab', { name: 'Liðnir listar' })).toBeVisible({
        timeout,
      }),
    ])
  })
})
