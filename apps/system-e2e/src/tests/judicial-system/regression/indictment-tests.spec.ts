import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  randomPoliceCaseNumber,
  getDaysFromNow,
  randomIndictmentCourtCaseNumber,
  chooseDocument,
} from '../utils/helpers'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Indictment tests', () => {
  let caseId = ''
  const accusedName = faker.name.findName()

  test('prosecutor should create a new indictment case', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage
    const today = getDaysFromNow()

    const policeCaseNumber = randomPoliceCaseNumber()

    // Case list groups
    await page.goto('/malalistar')
    await expect(page).toHaveURL('/malalistar')
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Ákæra' }).click()
    await expect(page).toHaveURL('/akaera/ny')

    // New indictment case
    await page.getByTestId('policeCaseNumber0').click()
    await page.getByTestId('policeCaseNumber0').fill(policeCaseNumber)

    await page.getByText('Sakarefni *Veldu sakarefni').click()
    await page.getByRole('option', { name: 'Umferðarlagabrot' }).click()
    await page.getByPlaceholder('Sláðu inn vettvang').click()
    await page.getByPlaceholder('Sláðu inn vettvang').fill('Reykjavík')
    await page
      .locator(`input[id=crime-scene-date-${policeCaseNumber}]`)
      .fill(today)
    await page.keyboard.press('Escape')
    await page.getByTestId('inputNationalId').fill('000000-0000')
    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase').then(
        (res) => (caseId = res.data.createCase.id),
      ),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Police case files (Málsgögn)
    await expect(page).toHaveURL(`/akaera/malsgogn/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case file
    await expect(page).toHaveURL(`/akaera/skjalaskra/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case files
    await expect(page).toHaveURL(`/akaera/domskjol/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Processing
    await Promise.all([
      expect(page).toHaveURL(`/akaera/malsmedferd/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])

    await Promise.all([
      page.getByText('Játar sök').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])

    await Promise.all([
      page.getByText('Nei').last().click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Indictment

    await page.getByPlaceholder('AB123').fill('AB123')

    await Promise.all([
      page.keyboard.press('Tab'),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateIndictmentCount'),
    ])

    await Promise.all([
      page.getByText('Brot *Veldu brot').click(),
      page.getByRole('option', { name: 'Sviptingarakstur' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateIndictmentCount'),
    ])

    await Promise.all([
      page.getByLabel('Krefjast sviptingarKrefjast').check(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Overview
    await expect(page).toHaveURL(`/akaera/stadfesta/${caseId}`)

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    ])
    await page.getByTestId('modalPrimaryButton').click()
  })

  test('prosecutor should accept and send indictment case to court', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    // Case list
    await page.goto('/malalistar/sakamal-sem-bida-stadfestingar')
    await expect(page).toHaveURL('/malalistar/sakamal-sem-bida-stadfestingar')
    await page.getByText(accusedName).click()

    // Indictment case
    await expect(page).toHaveURL(`/akaera/stadfesta/${caseId}`)

    await page.getByText('Staðfesta ákæru og senda á dómstól').click()
    await page.getByTestId('continueButton').click()

    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    ])
  })

  test('judge should receive indictment case', async ({ judgePage }) => {
    const page = judgePage
    const nextWeek = getDaysFromNow(7)

    // Case list
    await page.goto('/malalistar/sakamal-sem-bida-uthlutunar')
    await expect(page).toHaveURL('/malalistar/sakamal-sem-bida-uthlutunar')
    await page.getByText(accusedName).click()

    // Indictment Overview
    await expect(page).toHaveURL(`domur/akaera/yfirlit/${caseId}`)

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Reception and assignment
    await expect(page).toHaveURL(`domur/akaera/mottaka/${caseId}`)

    await page
      .getByTestId('courtCaseNumber')
      .fill(randomIndictmentCourtCaseNumber())
    await page.keyboard.press('Tab')

    await page.getByText('Veldu dómara/aðstoðarmann').click()
    await page
      .getByTestId('select-judge')
      .getByText('Test Dómari')
      .last()
      .click()

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Subpoena
    await expect(page).toHaveURL(`domur/akaera/fyrirkall/${caseId}`)

    await page
      .locator('label')
      .filter({ hasText: 'Útivistarfyrirkall' })
      .click()

    await page.locator('input[id=courtDate]').fill(nextWeek)
    await page.keyboard.press('Escape')

    await page.getByTestId('courtDate-time').fill('11:00')
    await page.getByTestId('courtroom').press('Tab')

    await page.getByTestId('courtroom').fill('12')
    await page.getByTestId('courtroom').press('Tab')

    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalPrimaryButton').click()

    // Advocates and civil claimants
    await expect(page).toHaveURL(`domur/akaera/malflytjendur/${caseId}`)

    await page
      .locator('label')
      .filter({ hasText: 'Ákærði óskar ekki eftir að sé' })
      .click()
    await page.getByRole('button', { name: 'Staðfesta val' }).click()
    await page.getByTestId('modalPrimaryButton').click()

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Indictment court record
    await expect(page).toHaveURL(`domur/akaera/thingbok/${caseId}`)
    await page.getByTestId('entries').fill('Afstaða, málflutningur, og bókun')

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

    await page.getByTestId('button-send-case-to-prison-admin').click()
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
})
