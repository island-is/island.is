import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/stjornbord/`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal access control', () => {
  let contextGranter: BrowserContext

  test.beforeAll(async ({ browser }) => {
    contextGranter = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      delegation: '65° Arctic ehf',
    })
  })

  test.afterAll(async () => {
    await contextGranter.close()
  })

  test('access undirskriftalsitar, access and edit a list', async ({
    browser,
  }) => {
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

    await test.step('access undirskriftalistar', async () => {
      // Act
      await granterPage
        .getByRole('button', { name: 'Opna Stjórnborðs valmynd' })
        .click()
      await granterPage
        .getByRole('menu', { name: 'Stjórnborðs valmynd' })
        .getByRole('link', { name: 'Undirskriftalistar' })
        .click()

      // Assert
      await expect(
        granterPage.getByRole('heading', { name: 'Undirskriftalistar' }),
      ).toBeVisible()
    })
    await test.step('access and edit a list', async () => {
      // Assert
      await expect(
        granterPage.locator('button:text("Liðnir listar")'),
      ).toBeVisible()

      //Act
      await granterPage.click('button:text("Liðnir listar")')
      await granterPage
        .getByRole('button', { name: 'Skoða lista' })
        .first()
        .click()
      const exampleDateInThePast = '13.05.2023'
      await granterPage
        .getByLabel('Tímabil til')
        .last()
        .fill(exampleDateInThePast)
      await granterPage.getByLabel('Um lista').click() // closes datepicker
      await granterPage.click('button:text("Uppfæra lista")')

      // Assert
      const dateValue = await granterPage
        .getByLabel('Tímabil til')
        .last()
        .inputValue()
      await expect(dateValue).toBe(exampleDateInThePast)
    })
  })
})
