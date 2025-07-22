import { BrowserContext, test, expect } from '@island.is/testing/e2e'
import format from 'date-fns/format'
import { urls, session } from '@island.is/testing/e2e'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Driving School Confirmation', () => {
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: `/umsoknir/okuskoli`,
      phoneNumber: '0107789',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('Student registration should complete', async () => {
    const page = await context.newPage()
    const nameField = page.locator('input[name="student.name"]')
    const forwardsButton = page.locator('button[data-testid="proceed"]')
    const dataProviders = page.locator(
      'input[data-testid="agree-to-data-providers"]',
    )
    const nationalIdField = page.locator('input[name="student.nationalId"]')
    const nameInfo = page.locator('[data-testid="student-name"]')
    const schoolSelector = (n: number) =>
      page.locator(`input[name="confirmation.school"][value="${n}"]`)
    const submitButton = page.locator('button[type="submit"]')
    const newButton = page.locator('button>[data-testid="icon-arrowForward"]')
    const dateField = page.locator('label[for="confirmation.date"]')
    const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))

    // Start application
    await page.goto('/umsoknir/okuskoli')
    await expect(page).toBeApplication()
    await dataProviders.click()
    await forwardsButton.click()

    // Enter student info
    await nationalIdField.click()
    await nationalIdField.fill('010130-5069')
    await nationalIdField.press('Tab')
    // Wait for non-empty name
    await expect(nameField).not.toBeEmpty()
    await expect(nameField).toHaveValue('Gervimaður Bandaríkin')
    await forwardsButton.click()

    // Change date, school, and submit
    await expect(nameInfo).toHaveText('Gervimaður Bandaríkin')
    // Schools 1 & 2 suddenly disappeared :(
    await schoolSelector(3).click()
    await dateField.fill(format(monthAgo, 'dd.MM.yyyy'))
    await submitButton.click()

    // Start anew
    const oldURL = page.url()
    await newButton.click()
    const newURL = page.url()
    await expect(newURL).not.toBe(oldURL)
    await page.close()
  })

  test('Student without a Driving Licence Book should only get error', async () => {
    const page = await context.newPage()
    const nameField = page.locator('input[name="student.name"]')
    const datePicker = page.locator('[data-testid="datepicker"]')
    const errorMessage = page.locator('[data-testid="alertMessage"]')
    const forwardsButton = page.locator('button[data-testid="proceed"]')
    const backwardsButton = page.locator(
      'button[data-testid="step-back"]:visible',
    )
    const dataProviders = page.locator(
      'input[data-testid="agree-to-data-providers"]',
    )
    const nationalIdField = page.locator('input[name="student.nationalId"]')

    // Start application
    await page.goto('/umsoknir/okuskoli')
    await expect(page).toBeApplication()
    await dataProviders.click()
    await forwardsButton.click()

    // Enter authorized student
    await nationalIdField.click()
    await nationalIdField.fill('010130-5069')
    await nationalIdField.press('Tab')
    // Wait for non-empty name
    await expect(nameField).not.toBeEmpty()
    await expect(nameField).toHaveValue('Gervimaður Bandaríkin')
    await forwardsButton.click()

    // Verify page is OK, then go back
    await expect(datePicker).toBeVisible()
    await expect(errorMessage).not.toBeVisible()
    await backwardsButton.click()

    // Enter details for unauthorized student
    await nationalIdField.click()
    await nationalIdField.press('Control+a')
    await nationalIdField.fill('010130-2989')
    await nationalIdField.press('Tab')
    await expect(nameField).toHaveValue('Gervimaður Ameríku ') // Trailing space 😭
    await forwardsButton.click()

    // Make sure only error message
    await expect(errorMessage).toBeVisible()
    await expect(datePicker).not.toBeVisible()
  })
})
