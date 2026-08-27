import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { getDaysFromNow, chooseDocument } from '../utils/helpers'
import {
  prosecutorCreatesIndictmentCase,
  prosecutorSendsIndictmentToCourt,
  judgeReceivesIndictmentThroughAdvocates,
} from './shared-steps/indictment-to-court-record'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Indictment tests', () => {
  let caseId = ''
  const accusedName = faker.name.findName()

  test('prosecutor should create a new indictment case', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesIndictmentCase(prosecutorPage, accusedName)
  })

  test('prosecutor should accept and send indictment case to court', async ({
    prosecutorPage,
  }) => {
    await prosecutorSendsIndictmentToCourt(prosecutorPage, caseId, accusedName)
  })

  test('judge should receive indictment case', async ({ judgePage }) => {
    const page = judgePage

    // Case list through subpoena, advocates and on to the court record
    await judgeReceivesIndictmentThroughAdvocates(page, caseId, accusedName)

    // Indictment court record
    await Promise.all([
      page.getByRole('button', { name: 'Bæta við þinghaldi' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCourtSession'),
    ])
    await page
      .getByTestId('entries')
      .frameLocator('iframe')
      .locator('body')
      .fill('Afstaða, málflutningur, og bókun')

    await page.locator('label').filter({ hasText: 'Dómur kveðinn upp' }).click()
    await page.getByTestId('ruling').fill('Dómsorð')

    await page.getByTestId('confirm-court-record').click()
    await page.getByTestId('continueButton').click()

    // Conclusion
    await expect(page).toHaveURL(`domur/akaera/stada-og-lyktir/${caseId}`)

    await page.locator('label').filter({ hasText: 'Lokið' }).click()
    await page.locator('label').filter({ hasText: 'Dómur' }).click()

    await chooseDocument(
      page,
      async () => {
        await page
          .getByRole('button', { name: 'Velja gögn til að hlaða upp' })
          .nth(1)
          .click()
      },
      'TestDomur.pdf',
    )

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case overview
    await expect(page).toHaveURL(`domur/akaera/samantekt/${caseId}`)
    await page.getByTestId('continueButton').click()

    await page.waitForSelector('input[type="checkbox"]', { state: 'visible' })
    await page
      .getByRole('checkbox', { name: 'Ég hef rýnt þetta dómskjal' })
      .check()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Completed case overview
    await expect(page).toHaveURL(`domur/akaera/lokid/${caseId}`)

    await page
      .locator('label')
      .filter({ hasText: 'Birta skal dómfellda dóminn' })
      .click()

    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalPrimaryButton').click()
  })

  test('public prosecutor office should assign a reviewer to an indictment', async ({
    publicProsecutorOfficePage,
  }) => {
    const page = publicProsecutorOfficePage
    const today = getDaysFromNow()

    // Case list for new cases
    await page.goto('/malalistar/ny-sakamal')
    await expect(page).toHaveURL('/malalistar/ny-sakamal')
    await page.getByText(accusedName).click()

    // Indictment overview

    // Note: this is not a standard UX path since all cases should be served and updated via external sources
    await page.locator('input[id=defendantServiceDate]').fill(today)
    await page.keyboard.press('Escape')

    await Promise.all([
      page.getByTestId('button-defendant-service-date').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateVerdict'),
    ])

    await page.getByText('Veldu saksóknara').click()
    await page
      .getByTestId('select-reviewer')
      .getByText('Test Ríkissaksóknari')
      .last()
      .click()

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])
    await page.getByTestId('modalSecondaryButton').click()

    // Case list for assigned cases
    await page.goto('/malalistar/sakamal-i-yfirlestri')
    await expect(page).toHaveURL('/malalistar/sakamal-i-yfirlestri')
    await expect(page.getByText(accusedName)).toHaveCount(1)
  })

  test('public prosecutor should receive and review indictment', async ({
    publicProsecutorPage,
  }) => {
    const page = publicProsecutorPage

    // Case list for cases in review
    await page.goto('/malalistar/sakamal-til-yfirlestrar')
    await expect(page).toHaveURL('/malalistar/sakamal-til-yfirlestrar')
    await page.getByText(accusedName).click()

    await page.getByText('Una héraðsdómi').click()
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])

    // Case list for reviewed cases
    await page.goto('/malalistar/yfirlesin-sakamal')
    await expect(page).toHaveURL('/malalistar/yfirlesin-sakamal')
    await expect(page.getByText(accusedName)).toHaveCount(1)
  })

  test('public prosecutor office should deliver indictment to prison', async ({
    publicProsecutorOfficePage,
  }) => {
    const page = publicProsecutorOfficePage

    // Case list for cases already reviewed
    await page.goto('/malalistar/yfirlesin-sakamal')
    await expect(page).toHaveURL('/malalistar/yfirlesin-sakamal')
    await page.getByText(accusedName).click()

    await page.getByRole('button', { name: 'Valmynd' }).click()
    await page.getByRole('menuitem', { name: 'Senda til fullnustu' }).click()

    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])

    // Case list for defendants sent to prison
    await page.goto('/malalistar/sakamal-i-fullnustu')
    await expect(page).toHaveURL('/malalistar/sakamal-i-fullnustu')
    await expect(page.getByText(accusedName)).toHaveCount(1)
  })

  test('prison admin should receive indictment case', async ({
    prisonAdminPage,
  }) => {
    const page = prisonAdminPage

    // Case list for cases sent to the prison administration
    await page.goto('/malalistar/sakamal-til-fullnustu')
    await expect(page).toHaveURL('/malalistar/sakamal-til-fullnustu')
    await page.getByText(accusedName).click()

    // Prison admin indictment overview
    await expect(page).toHaveURL(`fangelsi/akaera/yfirlit/${caseId}`)
    await expect(
      page.getByRole('heading', { name: 'Dómur til fullnustu' }),
    ).toBeVisible()
    await expect(page.getByText(accusedName).first()).toBeVisible()
  })
})
