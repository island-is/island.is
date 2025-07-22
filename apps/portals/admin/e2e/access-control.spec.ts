import { BrowserContext, expect, test } from '@playwright/test'
import { urls, session } from '@island.is/testing/e2e'

const homeUrl = `${urls.islandisBaseUrl}/stjornbord/`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal access control', () => {
  let contextGranter: BrowserContext

  test.beforeAll(async ({ browser }) => {
    contextGranter = await session({
      browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await contextGranter.close()
  })

  // Smoke test: Sjá yfirlit með Loftbrú og Aðganggstýringu þegar prókúruhafi
  // Smoke test: Fara inn í Aðgangsstýringu með fellivali í haus
  // Smoke test: Eyða umboði fyrir Loftbrú admin
  // Smoke test: Veita umboð fyrir Loftbrú admin
  // Smoke test: Vera sendur beint á Loftbrú þegar umboðshafi
  test('can manage delegations', async ({ browser }) => {
    // Arrange
    const granterPage = await contextGranter.newPage()

    await test.step('Open admin and see overview', async () => {
      // Act
      await granterPage.goto(homeUrl)

      // Assert
      await expect(
        granterPage.getByRole('heading', { name: 'Stjórnborð Ísland.is' }),
      ).toBeVisible()
      await expect(
        granterPage.getByRole('button', { name: 'Opna Stjórnborðs valmynd' }),
      ).toBeVisible()
    })

    await test.step('Switch to access control', async () => {
      // Act
      await granterPage
        .getByRole('button', { name: 'Opna Stjórnborðs valmynd' })
        .click()
      await granterPage
        .getByRole('menu', { name: 'Stjórnborðs valmynd' })
        .getByRole('link', { name: 'Aðgangsstýring' })
        .click()

      // Assert
      await expect(
        granterPage.getByRole('heading', { name: 'Aðgangsstýring' }),
      ).toBeVisible()
      await expect(
        granterPage.locator(
          '[data-testid="access-card"], [data-testid="delegations-empty-state"]',
        ),
      ).not.toHaveCount(0, { timeout: 20000 })
    })

    await test.step('Remove delegation', async () => {
      const delegations = granterPage
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Afríka' })
      const deleteButton = delegations.first().locator('role=button[name=Eyða]')
      const confirmButton = granterPage.locator(
        '[data-dialog-ref="access-delete-modal"] >> role=button[name*=Eyða]',
      )
      const count = await delegations.count()

      for (let i = 0; i < count; ++i) {
        await deleteButton.click()
        await confirmButton.click()
        await confirmButton.waitFor({ state: 'hidden' })
      }

      // Assert
      await expect(delegations).toHaveCount(0)
    })

    await test.step('Create admin delegation as company', async () => {
      // Act
      await granterPage.getByRole('button', { name: 'Skrá nýtt umboð' }).click()
      // eslint-disable-next-line local-rules/disallow-kennitalas
      await granterPage
        .getByRole('textbox', { name: 'Kennitala' })
        .fill('010130-3019')

      await granterPage.locator('data-testid=proceed').click()
      await granterPage.getByLabel('Loftbrú').setChecked(true)

      await granterPage.locator('data-testid=proceed >> visible=true').click()
      await granterPage.locator('role=button[name=Staðfesta]').click()

      // Assert
      const delegation = granterPage
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Afríka' })
      await expect(delegation).toBeVisible()
    })

    await test.step('Verify delegation and automatic redirect', async () => {
      // Arrange
      const contextReceiver = await session({
        browser,
        homeUrl,
        phoneNumber: '0103019',
      })
      const receiverPage = await contextReceiver.newPage()
      await receiverPage.goto(homeUrl)

      // Act
      await expect(
        receiverPage.getByRole('heading', { name: 'Yfirlit' }),
      ).toBeVisible()
      expect(receiverPage.url()).toBe(`${homeUrl}loftbru`)
    })
  })
})
