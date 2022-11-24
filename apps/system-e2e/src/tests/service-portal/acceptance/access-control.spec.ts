import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import { helpers } from '../../../support/locator-helpers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal, in access control', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('can remove, create and use custom delegations', async ({ browser }) => {
    const page = await context.newPage()

    await test.step('Remove delegations', async () => {
      // Arrange
      await page.goto('/minarsidur/adgangsstyring/umbod')
      await expect(
        page.locator(
          '[data-testid="access-card"], [data-testid="delegations-empty-state"]',
        ),
      ).not.toHaveCount(0)

      // Act
      const delegations = page
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Ameríku' })
      const deleteButton = delegations.first().locator('role=button[name=Eyða]')
      const confirmButton = page.locator(
        '[data-dialog-ref="access-delete-modal"] >> role=button[name*=Eyða]',
      )
      const count = await delegations.count()

      for (let i = 0; i < count; ++i) {
        await deleteButton.click()
        await confirmButton.click()
        await confirmButton.waitFor({ state: 'hidden' })
      }

      // Assert
      expect(delegations).toHaveCount(0)
    })

    await test.step('Create delegation', async () => {
      // Arrange
      const page = await context.newPage()
      await page.goto('/minarsidur/adgangsstyring/umbod')

      // Act
      await page.locator('role=button[name="Nýtt umboð"]').click()
      await page.locator('role=textbox[name*="Kennitala"]').click()
      // eslint-disable-next-line local-rules/disallow-kennitalas
      await page.locator('role=textbox[name*="Kennitala"]').fill('010130-2989')

      await page.locator('data-testid=proceed').click()

      const access = page.locator('input[type=checkbox][id*=scope]')
      await expect(access).not.toHaveCount(0)
      const accessCount = await access.count()
      for (let i = 0; i < accessCount; i++) {
        await access.nth(i).setChecked(true)
      }
      await page.locator('data-testid=proceed >> visible=true').click()
      await page.locator('role=button[name=Staðfesta]').click()

      // Assert
      const delegation = page
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Ameríku' })
      await expect(delegation).toBeVisible()
    })

    await test.step('Sign in with new custom delegation', async () => {
      // Arrange
      const context2 = await session({
        browser,
        storageState: 'service-portal-amerika.json',
        homeUrl,
        phoneNumber: '0102989',
        idsLoginOn: true,
      })
      const page = await context2.newPage()
      const { findByRole } = helpers(page)
      await page.goto('/minarsidur')

      // Act
      await page.locator('data-testid=user-menu >> visible=true').click()
      await page.locator('role=button[name="Skipta um notanda"]').click()
      await page.locator('role=button[name*="Gervimaður Færeyjar"]').click()
      await page.waitForURL(homeUrl, {
        waitUntil: 'domcontentloaded',
      })

      // Assert
      await expect(findByRole('heading', 'Gervimaður Færeyjar')).toBeVisible()

      await context2.close()
    })
  })
})
