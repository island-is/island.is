import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

export async function switchDelegation(
  page: Page,
  delegationType: 'Prókúra' | 'Forsjá',
) {
  await page.locator('data-testid=user-menu >> visible=true').click()
  await page.locator('role=button[name="Skipta um notanda"]').click()

  const firstDelegation = page
    .locator(`role=button[name*="${delegationType}"]`)
    .first()
  await expect(firstDelegation).toBeVisible()

  const delegationName = await firstDelegation
    .locator('.identity-card--name')
    .textContent()

  expect(delegationName).toBeTruthy()

  await firstDelegation.click()
  await page.waitForURL(new RegExp(homeUrl), {
    waitUntil: 'domcontentloaded',
  })

  return delegationName
}

test.describe('Service portal', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-auth.json',
      homeUrl,
      phoneNumber: '0104359',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  // Smoke test: Innskráning umboð forsjáraðili
  test('can sign in as legal guardian', async () => {
    // Arrange
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/minarsidur'))

    // Act
    const delegationName = await switchDelegation(page, 'Forsjá')

    // Assert
    await expect(
      page.getByRole('heading', { name: delegationName ?? '' }),
    ).toBeVisible()
  })

  // Smoke test: Útskrá
  test('can sign out', async () => {
    // Arrange
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/minarsidur'))

    // Act
    await page.locator('data-testid=user-menu >> visible=true').click()
    await page.getByRole('button', { name: 'Útskrá', exact: true }).click()

    // Assert
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible({ timeout: 20000 })
  })
})

// Smoke test: Innskráning á ensku
test('Service portal can use english sign-in', async ({ browser }) => {
  // Arrange
  const context = await session({
    browser: browser,
    storageState: 'service-portal-auth-english.json',
    homeUrl,
    phoneNumber: '0104359',
    idsLoginOn: false,
  })
  const page = await context.newPage()
  await page.goto(icelandicAndNoPopupUrl('/minarsidur'))

  // Act
  /**
   * Not using accessible selector here because this test needs to work on both the new and current login page at the same time to handle the transition gracefully
   * TODO: use accessible selector when the new login pages is out
   */
  await page.getByText('English').click()

  // Assert
  await expect(
    page.getByRole('checkbox', { name: 'Remember Phone Number' }),
  ).toBeVisible()
})
