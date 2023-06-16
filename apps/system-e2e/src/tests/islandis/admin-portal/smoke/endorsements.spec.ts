import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { sleep } from '../../../../support/utils'

const homeUrl = `${urls.islandisBaseUrl}/stjornbord`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal (Endorsements)', () => {
  let contextGranter: BrowserContext

  test.beforeAll(async ({ browser }) => {
    contextGranter = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      delegation: '65° ARTIC ehf.',
    })
  })

  test.beforeEach(async ({ context, page }) => {
    context.addCookies(await contextGranter.cookies())
    await page.goto(icelandicAndNoPopupUrl(homeUrl + '/listar'))

    // const state = await context.storageState()
    // state.cookies = await contextGranter.cookies()
    // state.origins = (await contextGranter.storageState()).origins

    // context.addCookies(await contextGranter.cookies())
  })

  test.afterAll(async () => {
    await contextGranter.close()
  })

  test('Open admin and see overview', async ({ page }) => {
    await page.goto(icelandicAndNoPopupUrl(homeUrl))

    // Assert
    await expect(
      page.getByRole('heading', { name: 'Stjórnborð Ísland.is' }),
    ).toBeVisible()
  })

  test('Open old endorsement list', async ({ page }) => {
    await page.getByTestId('active-module-name').click()
    await page.getByRole('link', { name: 'Undirskriftalistar' }).click()

    await page.getByRole('tab', { name: 'Liðnir listar' }).click()
    await page.getByText('Skoða lista').first().click()
    await expect(page.getByLabel('Heiti lista')).toBeVisible()
    await expect(page.getByText('Yfirlit undirskrifta')).toBeVisible()
  })

  test('Update old endorsement list', async ({ page }) => {
    await sleep(500)
    await page.getByRole('button', { name: 'Uppfæra lista' }).click()
    await expect(
      page.getByRole('alert').filter({ hasText: 'Tókst að uppfæra lista' }),
    ).toBeVisible()
  })

  test('See locked lists are present', async ({ page }) => {
    await page.getByRole('button', { name: 'Til baka' }).click()
    await page.getByRole('tab', { name: 'Læstir listar' }).click()
    await expect(page.getByText('Skoða lista')).toHaveCountGreaterThan(1)
  })

  test('Go back to overview', async ({ page }) => {
    await page.getByTestId('active-module-name').click()
    await page
      .getByRole('menu', { name: 'Stjórnborðs valmynd' })
      .getByRole('link', { name: 'Yfirlit' })
      .click()
    await expect(
      page.getByRole('heading', { name: 'Stjórnborð Ísland.is' }),
    ).toBeVisible()
  })

  test('access endorsement lists', async ({ page }) => {
    // Act
    await page.getByRole('button', { name: 'Opna Stjórnborðs valmynd' }).click()
    await page
      .getByRole('menu', { name: 'Stjórnborðs valmynd' })
      .getByRole('link', { name: 'Undirskriftalistar' })
      .click()

    // Assert
    await expect(
      page.getByRole('heading', { name: 'Undirskriftalistar' }),
    ).toBeVisible()
  })
  test('access and edit a list', async ({ page }) => {
    // Assert
    await expect(page.getByRole('tab', { name: 'Liðnir listar' })).toBeVisible()

    //Act
    await page.getByRole('button', { name: 'Skoða lista' }).first().click()
    const currentEndDate = await page
      .getByLabel('Tímabil til')
      .last()
      .inputValue()
    const exampleDateInThePast = '13.05.2023'
    await page.getByLabel('Tímabil til').last().fill(exampleDateInThePast)
    await page.keyboard.press('Enter')
    await page.click('button:text("Uppfæra lista")')

    // Assert
    let dateValue = await page.getByLabel('Tímabil til').last().inputValue()
    await expect(dateValue).toBe(exampleDateInThePast)

    // And lets end by setting the date back to what it was
    await page.getByLabel('Tímabil til').last().fill(currentEndDate)
    await page.keyboard.press('Enter')
    await page.click('button:text("Uppfæra lista")')

    // Assert
    dateValue = await page.getByLabel('Tímabil til').last().inputValue()
    await expect(dateValue).toBe(currentEndDate)
  })
})
