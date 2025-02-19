import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { m } from '@island.is/portals/my-pages/core/messages'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - University graduation', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-finnland.json',
      homeUrl,
      phoneNumber: '0102209',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Has graduation data', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step(
      'Overview cards are displayed and cards can navigate to detail',
      async () => {
        // Arrange
        await page.goto(
          icelandicAndNoPopupUrl('/minarsidur/menntun/haskoli/brautskraning'),
        )
        await page.waitForLoadState('networkidle')

        const viewDetailsButton = page
          .locator(`role=button[name="${label(m.view)}"]`)
          .last()

        // Act
        await viewDetailsButton.click()

        const title1 = page.getByRole('heading', {
          name: label(m.educationGraduation),
        })
        const schoolName = page.getByText('Háskóli Íslands')

        // Assert
        await expect(page).toHaveURL(
          /.*minarsidur\/menntun\/haskoli\/brautskraning\/[0-9]+/,
        )

        // Assert
        await expect(title1).toBeVisible()
        await expect(schoolName).toBeVisible()
      },
    )
  })
})
