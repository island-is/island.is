import { expect, Page } from '@playwright/test'

import { urls } from '../../../support/urls'
import { test } from '../utils/judicialSystemTest'

test.use({ baseURL: urls.judicialSystemBaseUrl })

// Mirrors the CaseTable query the list page sends - only the fields the
// checks below read.
interface TableRow {
  actionOnRowClick: string
  cells: { sortValue?: string | null }[]
}

const tableRows = (page: Page) => page.locator('tbody tr')
const openRowButtons = (page: Page) =>
  page.getByRole('button', { name: /^Opna mál/ })
const sortButtons = (page: Page) =>
  page.getByRole('button', { name: /^Raða eftir dálki/ })

// Visits a case list and returns the rows the backend answered with, so the
// checks can compare what the table renders against what it was given.
//
// The dashboard's counter cards send the same CaseTable query, one per list,
// and their answers can still be arriving as the navigation starts. Matching
// on the frame's url at the time of the answer keeps those out: a card's
// answer lands while the frame is still on the dashboard, the table's own
// answer only after the frame has moved to the list.
const loadCaseList = async (page: Page, href: string): Promise<TableRow[]> => {
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/graphql') &&
        resp.request().postDataJSON()?.operationName === 'CaseTable' &&
        new URL(resp.frame().url()).pathname === href,
      { timeout: 15000 },
    ),
    page.goto(href),
  ])

  const body = await response.json()
  if (body.errors?.length) {
    throw new Error(
      `GraphQL operation CaseTable for ${href} returned errors: ${body.errors[0].message}`,
    )
  }

  return body.data.caseTable.rows
}

// The dashboard links to every list the role may open. The first one with
// cases in it is where the checks run - which list that is depends on the
// data in the environment, not on the role.
const findCaseListWithRows = async (page: Page) => {
  await page.goto('/malalistar')
  await expect(page).toHaveURL('/malalistar')

  const links = page.locator('a[href^="/malalistar/"]')
  await expect(links.first()).toBeVisible()
  const hrefs = await links.evaluateAll((anchors) =>
    anchors.map((a) => a.getAttribute('href') ?? ''),
  )

  for (const href of hrefs) {
    const rows = await loadCaseList(page, href)

    if (rows.length > 0) {
      return { href, rows, listCount: hrefs.length }
    }
  }

  return { href: undefined, rows: [], listCount: hrefs.length }
}

// A row is sorted by the column's sortValue, not by what it displays, so the
// column to sort by is picked from the response: the first one where two rows
// differ, so that ascending and descending cannot start with the same row.
const findSortableColumn = (rows: TableRow[]) => {
  const columnCount = rows[0]?.cells.length ?? 0

  for (let column = 0; column < columnCount; column++) {
    const values = new Set(rows.map((r) => r.cells[column]?.sortValue ?? ''))

    if (values.size > 1) {
      return column
    }
  }

  return undefined
}

const smokeTestCaseLists = async (page: Page, caseScreen: RegExp) => {
  const { href, rows, listCount } = await findCaseListWithRows(page)

  // Every list answered, but all of them empty. That is a fact about the data
  // in this environment, not about the lists, so the role is skipped rather
  // than failed - visibly, so a run that never checked a role says so.
  test.skip(
    href === undefined,
    `none of the ${listCount} case lists this role can open has any cases`,
  )
  if (href === undefined) {
    return
  }

  // Rows render: one table row per row the backend returned.
  await expect(tableRows(page)).toHaveCount(rows.length)
  await expect(openRowButtons(page)).toHaveCount(rows.length)

  // A row opens the right screen for the role. Cancelled cases open a modal
  // instead of a case, so the first row that opens a case is the one clicked.
  // Nothing has been sorted yet, so the table shows the rows in the order the
  // backend returned them.
  const openable = rows.findIndex(
    (r) => r.actionOnRowClick !== 'COMPLETE_CANCELLED_CASE',
  )
  expect(
    openable,
    'the list has no row that opens a case',
  ).toBeGreaterThanOrEqual(0)
  await tableRows(page).nth(openable).click()
  await expect(page).toHaveURL(caseScreen)

  // Sorting: reload the list and sort by a column that can change the order.
  await loadCaseList(page, href)
  await expect(tableRows(page)).toHaveCount(rows.length)

  const column = findSortableColumn(rows)
  const header = sortButtons(page).nth(column ?? 0)

  await header.click()
  await expect(page.locator('th[aria-sort="ascending"]')).toHaveCount(1)
  await expect(tableRows(page)).toHaveCount(rows.length)
  const ascending = await tableRows(page).allInnerTexts()

  await header.click()
  await expect(page.locator('th[aria-sort="descending"]')).toHaveCount(1)
  await expect(tableRows(page)).toHaveCount(rows.length)
  const descending = await tableRows(page).allInnerTexts()

  // Same rows either way round...
  expect([...descending].sort()).toEqual([...ascending].sort())

  // ...and a different one on top when the column has anything to sort by.
  if (column !== undefined) {
    expect(descending[0]).not.toEqual(ascending[0])
  }
}

test.describe('Case lists', () => {
  test('prosecutor sees, sorts and opens cases', async ({ prosecutorPage }) => {
    await smokeTestCaseLists(prosecutorPage, /\/(krafa|akaera)\/[a-z-]+\//)
  })

  test('district court judge sees, sorts and opens cases', async ({
    judgePage,
  }) => {
    await smokeTestCaseLists(judgePage, /\/(domur|krafa)\/[a-z-]+\//)
  })

  test('court of appeals judge sees, sorts and opens cases', async ({
    coaPage,
  }) => {
    await smokeTestCaseLists(coaPage, /\/landsrettur\/[a-z-]+\//)
  })

  test('defender sees, sorts and opens cases', async ({ defenderPage }) => {
    await smokeTestCaseLists(defenderPage, /\/verjandi\/[a-z-]+\//)
  })

  test('public prosecutor office staff sees, sorts and opens cases', async ({
    publicProsecutorOfficePage,
  }) => {
    await smokeTestCaseLists(
      publicProsecutorOfficePage,
      /\/rikissaksoknari\/[a-z-]+\//,
    )
  })

  test('public prosecutor sees, sorts and opens cases', async ({
    publicProsecutorPage,
  }) => {
    await smokeTestCaseLists(
      publicProsecutorPage,
      /\/(krafa|akaera)\/[a-z-]+\//,
    )
  })
})
