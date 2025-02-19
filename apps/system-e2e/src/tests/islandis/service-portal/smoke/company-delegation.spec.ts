import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { label } from '../../../../support/i18n'
import { coreDelegationsMessages } from '@island.is/application/core/messages'
import { m } from '@island.is/portals/shared-modules/delegations/messages'
import { m as coreMessages } from '@island.is/portals/my-pages/core/messages'
import { mCompany } from '@island.is/portals/my-pages/information/messages'
import { disableI18n } from '../../../../support/disablers'
import { switchDelegation } from './auth.spec'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
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

  // Smoke test: Innskráning umboð fyrirtæki
  test('can sign in as company', async () => {
    // Arrange
    const page = await context.newPage()
    const { findByRole } = helpers(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur'))

    // Act
    const companyName = await switchDelegation(page, 'Prókúra')

    // Assert
    const dashboard = page.getByTestId('service-portal-dashboard')
    await expect(findByRole('heading', companyName ?? '')).toBeVisible()
    await expect(dashboard).toBeVisible()
    await expect(await dashboard.locator('a').count()).toBeLessThan(10)
  })

  test('can view company data', async () => {
    // Arrange
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur'))

    // Act
    await page.locator('data-testid=user-menu >> visible=true').click()
    await page
      .locator(
        `role=button[name="${label(
          coreDelegationsMessages.delegationErrorButton,
        )}"]`,
      )
      .click()
    const firstCompany = page
      .locator(
        `role=button[name*="${label(m.delegationTypeProcurationHolder)}"]`,
      )
      .first()
    await expect(firstCompany).toBeVisible()
    await firstCompany.click()
    await page.waitForURL(new RegExp(homeUrl), {
      waitUntil: 'domcontentloaded',
    })

    const link = page
      .getByRole('link', { name: label(coreMessages.companyTitle) })
      .first()
    await link.click()

    const headlineText = page.getByText(label(mCompany.subtitle)).first()
    const dataText = page.getByText('Einkahlutafélag').first()

    // Assert
    await expect(headlineText).toBeVisible()
    await expect(dataText).toBeVisible()
  })
})
