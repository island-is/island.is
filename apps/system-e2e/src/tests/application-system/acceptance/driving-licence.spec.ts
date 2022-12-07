import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'

test.describe('Parental leave', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'parental-leave.json',
      homeUrl: `${urls.islandisBaseUrl}/umsoknir/okuskoli`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('test', async ({ page }) => {
    const page = await context.newPage()
    await page.goto('/umsoknir/okuskoli')

    // Click [placeholder="\30 00-0000"]
    await page.locator('[placeholder="\\30 00-0000"]').click()

    // Fill [placeholder="\30 00-0000"]
    await page.locator('[placeholder="\\30 00-0000"]').fill('010-2399')

    // Press Enter
    await page.locator('[placeholder="\\30 00-0000"]').press('Enter')
    await expect(page).toHaveURL(
      'http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc',
    )

    // Go to http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc
    await page.goto(
      'http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc',
    )

    // Click label:has-text("Ég hef kynnt mér ofangreintÉg hef kynnt mér ofangreint")
    await page
      .locator(
        'label:has-text("Ég hef kynnt mér ofangreintÉg hef kynnt mér ofangreint")',
      )
      .click()

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL(
      'http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc',
    )

    // Click input[name="student\.nationalId"]
    await page.locator('input[name="student\\.nationalId"]').click()

    // Fill input[name="student\.nationalId"]
    await page
      .locator('input[name="student\\.nationalId"]')
      .fill('010130-5069 ')

    // Press Tab
    await page.locator('input[name="student\\.nationalId"]').press('Tab')

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL(
      'http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc',
    )

    // Click text=Til baka
    await page.locator('text=Til baka').click()
    await expect(page).toHaveURL(
      'http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc',
    )

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
    await expect(page).toHaveURL(
      'http://localhost:4242/umsoknir/okuskoli/5b967f2e-3502-46f9-841e-0b5798a767cc',
    )

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
