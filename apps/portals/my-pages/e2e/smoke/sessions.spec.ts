import { test, expect, BrowserContext } from '@playwright/test'
import { format } from 'kennitala'

import {
  env,
  icelandicAndNoPopupUrl,
  urls,
  session,
} from '@island.is/testing/e2e'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
const sessionHistoryUrl = icelandicAndNoPopupUrl(
  '/minarsidur/adgangsstyring/notkun',
)

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal, in session history', () => {
  let context: BrowserContext
  const testCompanyName =
    env === 'staging' ? 'Prófunarfélag GG og HEB' : 'ARTIC ehf.'

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('can view list of sessions', async () => {
    // Arrange
    const page = await context.newPage()

    // Act
    await page.goto(sessionHistoryUrl, {
      waitUntil: 'networkidle',
    })
    await expect(page.getByRole('heading', { name: 'Notkun' })).toBeVisible()
    const sessionsRows = page.locator('table > tbody > tr')

    // Assert
    expect(sessionsRows.count()).toBeGreaterThan(0)
  })

  test('can filter list of session by national id', async () => {
    // Arrange
    const filterSubjectNationalId =
      // eslint-disable-next-line local-rules/disallow-kennitalas
      env === 'staging' ? '6609170200' : '5005101370'
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(sessionHistoryUrl))

    // Act
    await page
      .getByRole('textbox', { name: 'Leita eftir kennitölu' })
      .fill(filterSubjectNationalId)
    const sessionsRows = page.getByRole('cell', {
      name: format(filterSubjectNationalId),
    })

    // Assert
    expect(sessionsRows.count()).toBeGreaterThan(0)
  })

  test('can view list of sessions as company', async () => {
    // Arrange
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl(homeUrl))
    await page
      .getByRole('button', { name: 'Útskráning og aðgangsstillingar' })
      .click()
    await page.getByRole('button', { name: 'Skipta um notanda' }).click()
    await page.getByRole('button', { name: testCompanyName }).click()

    // Act
    await page.goto(icelandicAndNoPopupUrl(sessionHistoryUrl), {
      waitUntil: 'networkidle',
    })
    const sessionsRows = page.getByRole('row')

    // Assert
    expect(sessionsRows.count()).toBeGreaterThan(0)
  })
})
