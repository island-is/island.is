import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { switchUser } from '../../../../support/login'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur/`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal, in access control', () => {
  let contextGranter: BrowserContext
  let contextReceiver: BrowserContext

  test.beforeAll(async ({ browser }) => {
    ;[contextGranter, contextReceiver] = await Promise.all([
      session({
        browser: browser,
        storageState: 'service-portal-faereyjar.json',
        homeUrl,
        phoneNumber: '0102399',
        idsLoginOn: true,
      }),
      session({
        browser,
        storageState: 'service-portal-amerika.json',
        homeUrl,
        phoneNumber: '0102989',
        idsLoginOn: true,
      }),
    ])
  })

  test.afterAll(async () => {
    await contextGranter.close()
    await contextReceiver.close()
  })

  // Smoke test: Aðgangsstýring - eyða umboði
  // Smoke test: Aðgangsstýring - kanna að bara ákv. umboð sjáist
  // Smoke test: Aðgangsstýring - kanna að notandi missi umboð þegar það er tekið af honum
  // Smoke test: Aðgangsstýring - Veita öll umboð
  // Smoke test: Aðgangstýring - kanna að öll umboð sjáist
  // Smoke test: Aðgangstýring - Gefa umboð sem einstaklingur
  // Smoke test: Innskráning umboð gefið af öðrum
  test('can remove, create and use custom delegations', async () => {
    // Arrange
    const granterPage = await contextGranter.newPage()
    await granterPage.goto(
      icelandicAndNoPopupUrl('/minarsidur/adgangsstyring/umbod'),
    )
    await expect(
      granterPage.locator(
        '[data-testid="access-card"], [data-testid="delegations-empty-state"]',
      ),
    ).not.toHaveCount(0, { timeout: 20000 })

    const receiverPage = await contextReceiver.newPage()
    await receiverPage.goto(icelandicAndNoPopupUrl('/minarsidur/'))

    await test.step('Remove delegations', async () => {
      // Act
      const delegations = granterPage
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Ameríku' })
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

    await test.step('Verify removed delegation', async () => {
      // Act
      await switchUser(receiverPage, homeUrl)
      await expect(
        receiverPage.locator('role=button[name*="Gervimaður Ameríku"]'),
      ).toBeVisible()
      await expect(
        receiverPage.locator('role=button[name*="Gervimaður Færeyjar"]'),
      ).not.toBeVisible()
      await receiverPage
        .locator('role=button[name*="Gervimaður Ameríku"]')
        .click()
      await receiverPage.waitForURL(new RegExp(homeUrl), {
        waitUntil: 'domcontentloaded',
      })
    })

    await test.step('Create delegation', async () => {
      // Act
      await granterPage.locator('role=button[name="Skrá nýtt umboð"]').click()
      // eslint-disable-next-line local-rules/disallow-kennitalas
      await granterPage
        .getByRole('textbox', { name: 'Kennitala' })
        .fill('010130-2989')

      await granterPage.locator('data-testid=proceed').click()

      const access = granterPage.locator('input[type=checkbox][id*=scope]')
      await expect(access).not.toHaveCount(0)
      const accessCount = await access.count()
      for (let i = 0; i < accessCount; i++) {
        await access.nth(i).setChecked(true)
      }
      await granterPage.locator('data-testid=proceed >> visible=true').click()
      await granterPage.locator('role=button[name=Staðfesta]').click()

      // Assert
      const delegation = granterPage
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Ameríku' })
      await expect(delegation).toBeVisible()
    })

    await test.step('Verify new delegation', async () => {
      // Act
      await switchUser(receiverPage, homeUrl, 'Gervimaður Færeyjar')
      await expect(
        receiverPage.getByRole('heading', { name: 'Gervimaður Færeyjar' }),
      ).toBeVisible()

      // Assert
      await receiverPage.getByRole('link', { name: 'Pósthólf' }).first().click()
      await expect(
        receiverPage.getByRole('heading', { name: 'Pósthólf' }),
      ).toBeVisible()

      await receiverPage.getByRole('link', { name: 'Ökutæki' }).click()
      await expect(
        receiverPage.getByRole('heading', { name: 'Ökutæki' }),
      ).toBeVisible()
    })

    await test.step('Edit delegation', async () => {
      // Assert
      await granterPage
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Ameríku' })
        .locator('role=button[name=Breyta]')
        .click()

      const access = granterPage.locator('input[type=checkbox][id*=scope]')
      await expect(access).not.toHaveCount(0)
      const accessCount = await access.count()
      for (let i = 0; i < accessCount; i++) {
        await access.nth(i).setChecked(false)
      }
      await granterPage.getByLabel('Pósthólf').setChecked(true)
      await granterPage.locator('data-testid=proceed >> visible=true').click()
      await granterPage.locator('role=button[name=Staðfesta]').click()

      // Assert
      const updatedDelegation = granterPage
        .locator('data-testid=access-card')
        .filter({ hasText: 'Gervimaður Ameríku' })
      await expect(updatedDelegation).toBeVisible()
    })

    await test.step('Verify edited delegation', async () => {
      // Act
      await switchUser(receiverPage, homeUrl, 'Gervimaður Færeyjar')
      await expect(
        receiverPage.getByRole('heading', { name: 'Gervimaður Færeyjar' }),
      ).toBeVisible()

      // Assert
      await receiverPage.getByRole('link', { name: 'Pósthólf' }).click()
      await expect(
        receiverPage.getByRole('heading', { name: 'Pósthólf' }),
      ).toBeVisible()

      await receiverPage.getByRole('link', { name: 'Ökutæki' }).click()
      await expect(
        receiverPage.getByRole('heading', { name: 'Umboð vantar' }),
      ).toBeVisible()
    })
  })
})
