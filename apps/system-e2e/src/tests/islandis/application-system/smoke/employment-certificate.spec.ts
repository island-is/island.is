import { BrowserContext, expect, Page, test } from '@playwright/test'
import { coreMessages } from '@island.is/application/core'
import { employmentCertificateMessages as m } from '@island.is/application/templates/fjs/employment-certificate'
import { disableDelegations, disableI18n } from '../../../../support/disablers'
import { label } from '../../../../support/i18n'
import { session } from '../../../../support/session'

const homeUrl = '/umsoknir/starfsvottord'

// Fjársýsla ríkisins' test data: Gervimaður Ameríka has an employment history,
// Gervimaður Afríka has none.
const withHistory = '0102989'
const withoutHistory = '0103019'

// Never submit here: every submit creates a real case and a mailbox document
// at Fjársýsla ríkisins.
const startApplication = async (context: BrowserContext): Promise<Page> => {
  const page = await context.newPage()
  await disableI18n(page)
  await disableDelegations(page)
  await page.goto(homeUrl)

  // A person with earlier applications lands on the overview first.
  const dataCollection = page.getByRole('heading', {
    name: label(m.prerequisites.title),
    exact: true,
  })
  const newApplication = page.getByTestId('create-new-application')
  await expect(dataCollection.or(newApplication)).toBeVisible()
  if (await newApplication.isVisible()) {
    await newApplication.click()
  }
  await expect(dataCollection).toBeVisible()
  await page.getByLabel(label(m.prerequisites.checkboxLabel)).check()
  await page
    .getByRole('button', { name: label(m.prerequisites.submitButton) })
    .click()

  return page
}

test.describe('Employment certificate', () => {
  test.describe('with an employment history', () => {
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
      context = await session({
        browser,
        homeUrl,
        phoneNumber: withHistory,
        idsLoginOn: true,
      })
    })

    test.afterAll(async () => {
      await context.close()
    })

    test('shows the history with every institution ticked', async () => {
      const page = await startApplication(context)

      await expect(
        page.getByRole('heading', {
          name: label(m.personalInformation.title),
          exact: true,
        }),
      ).toBeVisible()
      await page
        .getByRole('button', { name: label(coreMessages.buttonNext) })
        .click()

      await expect(
        page.getByRole('heading', {
          name: label(m.employmentHistory.title),
          exact: true,
        }),
      ).toBeVisible()
      const table = page.getByRole('table', {
        name: label(m.employmentHistory.tableCaption),
      })
      await expect(table).toBeVisible()
      const institutions = table.getByRole('checkbox')
      expect(await institutions.count()).toBeGreaterThan(0)
      for (const institution of await institutions.all()) {
        await expect(institution).toBeChecked()
      }
      await expect(
        page.getByRole('button', { name: label(m.application.submitButton) }),
      ).toBeEnabled()

      await page.close()
    })
  })

  test.describe('without an employment history', () => {
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
      context = await session({
        browser,
        homeUrl,
        phoneNumber: withoutHistory,
        idsLoginOn: true,
      })
    })

    test.afterAll(async () => {
      await context.close()
    })

    test('stops at data collection', async () => {
      const page = await startApplication(context)

      await expect(page.getByText(label(m.errors.noHistoryTitle))).toBeVisible()
      await expect(
        page.getByRole('heading', {
          name: label(m.personalInformation.title),
          exact: true,
        }),
      ).toBeHidden()

      await page.close()
    })
  })
})
