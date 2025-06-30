import { test, BrowserContext, expect } from '@playwright/test'
import {
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
} from '@island.is/testing/e2e'
import { m } from '@island.is/portals/my-pages/core/messages'
const timeout = 15000

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('MS - Fjármál overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-bretland.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0104929',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Finance status', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Filter returns any data', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/fjarmal/stada'))
      // Assert
      await expect(
        page
          .locator(`role=button[name="${label(m.financeBreakdown)}"]`)
          .first(),
        {},
      ).toBeVisible({ timeout })
    })
  })

  test('Finance transactions', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Data is returned', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/fjarmal/faerslur'))

      const inputField = page.getByRole('textbox', {
        name: label(m.searchPlaceholder),
      })
      await inputField.click()

      // "Sakavottorð" comes from the api - not translateable
      await inputField.fill('Sakavottorð')

      // Assert
      await expect(
        page
          .locator(`role=button[name="${label(m.financeBreakdown)}"]`)
          .first(),
      ).toBeVisible({ timeout })

      await expect(page.locator('role=table')).toContainText('Sakavottorð')
      await expect(page.locator('role=table')).not.toContainText('Vegabréf')
    })
  })

  test('Finance bills', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Data is filtered', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl(
          '/minarsidur/fjarmal/greidslusedlar-og-greidslukvittanir',
        ),
      )

      // Act
      const filterButton = page
        .locator(`role=button[name="${label(m.openFilter)}"]`)
        .first()
      await filterButton.click()

      const inputField = page.getByPlaceholder(label(m.datepickLabel)).first()
      await inputField.click()
      await inputField.fill('')
      await inputField.fill('15.01.2023')

      const filterInput = page.getByRole('textbox', {
        name: label(m.searchPlaceholder),
      })
      await filterInput.click()
      await filterInput.fill('27.01.2023')

      // Assert
      await expect(page.locator('role=table')).toContainText('27.01.2023', {
        timeout,
      })
      await expect(page.locator('role=table')).not.toContainText('10.01.2023')
    })
  })

  test('Finance Launagreidendakröfur', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Can filter table and find a claim', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('/minarsidur/fjarmal/laungreidendakrofur'),
      )

      // Act
      const filterButton = page
        .locator(`role=button[name="${label(m.openFilter)}"]`)
        .first()
      await filterButton.click()

      const inputField = page.getByPlaceholder(label(m.datepickLabel)).first()
      await inputField.click()
      await inputField.fill('')
      await inputField.fill('15.10.2021')

      // Assert
      await expect(page.locator('role=table')).toContainText('15.10.2021', {
        timeout,
      })

      // "Launagreiðandakröfur" comes from the api - not translateable
      await expect(page.locator('role=table')).toContainText(
        'Launagreiðandakröfur',
      )
      await expect(page.locator('role=table')).not.toContainText('11.04.2023')
    })
  })
})
