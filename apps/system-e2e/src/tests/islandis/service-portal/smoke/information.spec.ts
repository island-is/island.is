import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { m } from '@island.is/portals/my-pages/core/messages'
import { spmm } from '@island.is/portals/my-pages/information/messages'
import { disableI18n } from '../../../../support/disablers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Mínar upplýsingar', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-othekkt.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0104359',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('should display user information overveiw', async () => {
    // Arrange
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/min-gogn/yfirlit'))

    // Act
    const element = page.getByText(label(m.natreg)).first()

    // Assert
    await expect(
      page.getByRole('heading', { name: label(m.myInfo) }),
    ).toBeVisible()
    await expect(element).toBeVisible()
  })

  test('should display user detail information', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(
      icelandicAndNoPopupUrl('/minarsidur/min-gogn/yfirlit/minar-upplysingar'),
    )

    // Act
    const title1 = page.getByText(label(m.myRegistration))
    const title2 = page.getByText(label(m.baseInfo))
    const link = page
      .getByRole('link', { name: label(spmm.changeInNationalReg) })
      .first()

    // Assert
    await expect(title1).toBeVisible()
    await expect(title2).toBeVisible()
    await expect(link).toBeVisible()
  })

  test.skip('should display child information', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/min-gogn/yfirlit'))
    await page.waitForLoadState('networkidle')

    // Act
    const babyButton = page
      .locator(`role=button[name="${label(spmm.seeInfo)}"]`)
      .last()

    await babyButton.click()

    const registrationButton = page
      .locator(`role=button[name="${label(spmm.childRegisterModalButton)}"]`)
      .first()

    // Assert
    await expect(page).toHaveURL(
      /.*minarsidur\/min-gogn\/yfirlit\/barn\/\d{10}$/,
    )
    await expect(registrationButton).toBeVisible()
  })
})
