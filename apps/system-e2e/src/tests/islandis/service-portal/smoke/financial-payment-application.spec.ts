import { test, BrowserContext, expect } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { m } from '@island.is/service-portal/finance/messages'
import { disableI18n } from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })
test.describe('Fjármál overview', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Finance payment application', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Application button is visible', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/greidsluaetlanir')

      // Act
      const applicationButton = page.locator(
        `role=button[name="${label(m.scheduleApplication)}"]`,
      )

      // Assert
      await expect(applicationButton).toBeVisible()
    })

    await test.step('Application opens', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/greidsluaetlanir')

      // Act
      const applicationButton = page.locator(
        `role=button[name="${label(m.scheduleApplication)}"]`,
      )

      const pagePromise = context.waitForEvent('page')
      applicationButton.click()
      const newPage = await pagePromise
      await newPage.waitForLoadState()

      // Assert
      expect(newPage.url()).toContain('umsoknir/greidsluaaetlun')
    })

    await test.step('Table contains data', async () => {
      // Arrange
      await page.goto('/minarsidur/fjarmal/greidsluaetlanir')

      // Assert
      await expect(page.locator('role=table')).toContainText(
        label(m.createdDate),
      )
      await expect(page.locator('role=table')).toContainText(
        label(m.financeStatusValid),
      )

      // "Skattar og gjöld" comes from the api - not translateable
      await expect(page.locator('role=table')).toContainText('Skattar og gjöld')
    })
  })
})

test.describe.skip('Fjármál', () => {
  for (const { testCase } of [
    { testCase: 'Fjármál Greiðslukvittanir - sjá pdf' },
    { testCase: 'Fjármál Launagreidendakröfur - birtist' },
    { testCase: 'Fjármál Útsvar sveitafélaga - birtist ???' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
