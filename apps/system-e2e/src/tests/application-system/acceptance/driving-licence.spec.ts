import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Driving licence', () => {
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'driving-licence.json',
      homeUrl: `/umsoknir/okuskoli`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('test', async () => {
    const page = await context.newPage()

    // Go to http://localhost:4242/umsoknir/okuskoli
    await page.goto('/umsoknir/okuskoli')
    await expect(page).toBeApplication()

    // Click label:has-text("Ég hef kynnt mér ofangreintÉg hef kynnt mér ofangreint")
    await page.locator('role=checkbox[include-hidden]').click()

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    // Click input[name="student\.nationalId"]
    await page.locator('input[name="student\\.nationalId"]').click()

    // Fill input[name="student\.nationalId"]
    await page.locator('input[name="student\\.nationalId"]').fill('010130-5069')

    // Press Tab
    await page.locator('input[name="student\\.nationalId"]').press('Tab')

    // Wait for non-empty name
    await expect(page.locator('role=entry[name="Nafn"]')).toHaveValue(
      'Gervimaður Bandaríkin',
    )

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    // Click text=Til baka
    await page.locator('text=Til baka').click()
    await expect(page).toBeApplication()

    // Click input[name="student\.nationalId"]
    await page.locator('input[name="student\\.nationalId"]').click()

    // Press a with modifiers
    await page.locator('input[name="student\\.nationalId"]').press('Control+a')

    // Fill input[name="student\.nationalId"]
    await page
      .locator('input[name="student\\.nationalId"]')
      .fill('010130-2989 ')

    // Press Tab
    await page.locator('input[name="student\\.nationalId"]').press('Tab')

    // Press Enter
    await page.locator('input[name="student\\.name"]').press('Enter')
    await expect(page).toBeApplication()

    // Click [data-testid="alertMessage"] div:has-text("ERRRRRR: Tókst ekki að sækja upplýsingar um ökunema. Vinsamlegast reynið aftur s") >> nth=3
    await page
      .locator(
        '[data-testid="alertMessage"] div:has-text("ERRRRRR: Tókst ekki að sækja upplýsingar um ökunema. Vinsamlegast reynið aftur s")',
      )
      .nth(3)
      .click()

    // Click div:nth-child(4) > div > div > div
    await page.locator('div:nth-child(4) > div > div > div').click()

    // Double click div:nth-child(4) > div > div > div
    await page.locator('div:nth-child(4) > div > div > div').dblclick()
  })
})
