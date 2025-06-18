import { test, BrowserContext, expect } from '@playwright/test'
import { sleep } from '../../../../support/utils'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { messages } from '@island.is/portals/my-pages/documents/messages'
import { m } from '@island.is/portals/my-pages/core/messages'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Pósthólf overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-bandarikin.json',
      homeUrl,
      phoneNumber: '0105069',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Can filter inbox items', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Filter by searchbox', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/postholf'))

      const inputField = page.getByRole('textbox', {
        name: label(m.searchLabel),
      })
      await inputField.click()
      await inputField.type('greiðslukvittun', { delay: 100 })
      await inputField.press('Enter')

      const btnClearFilter = page.getByRole('button', {
        name: label(messages.clearFilters),
      })

      await sleep(500)

      const docFoundText = page.getByTestId('doc-found-text')

      // Assert
      await expect(docFoundText).toContainText(label(messages.found))
      await expect(btnClearFilter).toBeVisible()
    })

    await test.step('Filter by filter-button', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/postholf'))

      // Act
      await page
        .getByRole('button', { name: label(m.openFilter) })
        .first()
        .click()
      await page
        .getByRole('button', { name: label(messages.institutionLabel) })
        .first()
        .click()
      await page.mouse.wheel(0, 50)

      // "institution" comes from the api - not translateable
      const institution = 'Ríkislögreglustjórinn'
      await page.getByLabel(institution).click()

      // Assert
      await expect(page.getByRole('main')).toContainText(label(messages.found))
      await expect(
        page
          .getByRole('button', { name: institution })
          .locator(`[data-testid="icon-close"]`),
      ).toBeVisible()
    })
  })
})
