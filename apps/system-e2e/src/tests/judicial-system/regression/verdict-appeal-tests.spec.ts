import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { chooseDocument, getDaysFromNow } from '../utils/helpers'
import { test } from '../utils/judicialSystemTest'
import {
  judgeCompletesIndictmentWithVerdict,
  publicProsecutorOfficeAssignsReviewer,
} from './shared-steps/complete-indictment'
import {
  prosecutorCreatesIndictmentCase,
  prosecutorSendsIndictmentToCourt,
} from './shared-steps/indictment-to-court-record'

test.use({ baseURL: urls.judicialSystemBaseUrl })

// A verdict appeal at the court of appeals, from the verdict in the district
// court through the prosecution's appeal of it to the court of appeals'
// own steps.
test.describe.serial('Verdict appeal tests', () => {
  let caseId = ''
  // The status step's address, appeal id and all, as the court of appeals
  // arrives at it; the booking test below opens it directly.
  let statusStepUrl = ''
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

  test('judge should complete the indictment case with a verdict', async ({
    judgePage,
  }) => {
    await judgeCompletesIndictmentWithVerdict(judgePage, caseId, accusedName)
  })

  test('public prosecutor office should assign a reviewer to the indictment', async ({
    publicProsecutorOfficePage,
  }) => {
    await publicProsecutorOfficeAssignsReviewer(
      publicProsecutorOfficePage,
      accusedName,
    )
  })

  // The reviewer's decision to appeal is what creates the verdict appeal.
  test('public prosecutor should appeal the verdict', async ({
    publicProsecutorPage,
  }) => {
    const page = publicProsecutorPage

    // Case list for cases in review
    await page.goto('/malalistar/sakamal-til-yfirlestrar')
    await expect(page).toHaveURL('/malalistar/sakamal-til-yfirlestrar')
    await page.getByText(accusedName).click()

    await page.getByText('Áfrýja héraðsdómi til Landsréttar').click()
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendants'),
    ])
  })

  test('court of appeals should reach the status step of the verdict appeal', async ({
    coaPage,
  }) => {
    const page = coaPage

    // Verdict appeal overview
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
      page.goto(`/landsrettur/afryjun/yfirlit/${caseId}`),
    ])
    await expect(page).toHaveURL(
      new RegExp(`/landsrettur/afryjun/yfirlit/${caseId}(\\?.*)?$`),
    )
    // The defender page refetches the case as it opens. Acting before that
    // settles lets the refetch overwrite the answer given below.
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
      page.getByTestId('continueButton').click(),
    ])

    // Defender: the defendant waived counsel in the district court, and the
    // court of appeals records its own answer to the question.
    await expect(page).toHaveURL(
      new RegExp(`/landsrettur/afryjun/verjandi/${caseId}(\\?.*)?$`),
    )
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
      page
        .getByRole('checkbox', {
          name: 'Ákærði óskar ekki eftir að sér sé skipaður verjandi',
        })
        .check(),
    ])
    const confirmDefenderButton = page.getByRole('button', {
      name: 'Staðfesta val',
      exact: true,
    })
    await expect(confirmDefenderButton).toBeEnabled()
    await confirmDefenderButton.click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])
    await page.getByTestId('continueButton').click()

    // Statement deadlines: the court gives the defendant a deadline, confirms
    // it, and is offered an extension once it is saved.
    await expect(page).toHaveURL(
      new RegExp(
        `/landsrettur/afryjun/greinargerdarfrestir/${caseId}(\\?.*)?$`,
      ),
    )
    await expect(
      page.getByRole('heading', { name: 'Greinargerðarfrestir', level: 1 }),
    ).toBeVisible()
    const defendantCard = page.getByRole('region', { name: accusedName })
    await defendantCard.getByLabel('Frestur til').fill(getDaysFromNow(7))
    await page.keyboard.press('Escape')
    await defendantCard.getByRole('button', { name: 'Senda frest' }).click()
    await expect(
      page.getByRole('dialog', { name: 'Viltu senda út greinargerðarfrest?' }),
    ).toBeVisible()
    await Promise.all([
      verifyRequestCompletion(
        page,
        '/api/graphql',
        'SetAppealStatementDeadline',
      ),
      page.getByTestId('confirmStatementDeadlineButton').click(),
    ])
    await expect(
      defendantCard.getByRole('button', { name: 'Framlengja frest' }),
    ).toBeVisible()

    // The court files the defendant's statement itself, from the card's
    // menu: it uploads the statement and lands back on the list, where the
    // defendant now stands as filed, with the date locked and no menu left.
    await defendantCard
      .getByRole('button', { name: `Valmynd fyrir ${accusedName}` })
      .click()
    await page.getByRole('button', { name: 'Hlaða upp greinargerð' }).click()
    await expect(page).toHaveURL(
      new RegExp(`/landsrettur/afryjun/greinargerd/${caseId}(\\?.*)?$`),
    )
    await expect(
      page.getByRole('heading', { name: 'Hlaða upp greinargerð', level: 1 }),
    ).toBeVisible()
    await expect(page.getByText(`Ákærði ${accusedName}`)).toBeVisible()
    await chooseDocument(
      page,
      async () => {
        await page
          .getByRole('button', { name: 'Velja skjöl til að hlaða upp' })
          .first()
          .click()
      },
      'TestGreinargerdVerjanda.pdf',
    )
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'CreateDefendantFile'),
      verifyRequestCompletion(page, '/api/graphql', 'FileAppealStatement'),
      page.getByTestId('continueButton').click(),
    ])
    await expect(page).toHaveURL(
      new RegExp(
        `/landsrettur/afryjun/greinargerdarfrestir/${caseId}(\\?.*)?$`,
      ),
    )
    await expect(
      defendantCard.getByText('Ákærði - Greinargerð skilað'),
    ).toBeVisible()
    await expect(defendantCard.getByLabel('Frestur til')).toBeDisabled()
    await expect(
      defendantCard.getByRole('button', {
        name: `Valmynd fyrir ${accusedName}`,
      }),
    ).toHaveCount(0)
    await page.getByTestId('continueButton').click()

    // Status
    await expect(page).toHaveURL(
      new RegExp(`/landsrettur/afryjun/stada-og-lyktir/${caseId}(\\?.*)?$`),
    )
    await expect(
      page.getByRole('heading', { name: 'Staða og lyktir' }),
    ).toBeVisible()
    await expect(
      page.getByLabel('Boða til þinghalds', { exact: true }),
    ).toBeVisible()
    statusStepUrl = page.url()
  })

  // The one thing the status step does so far: the court calls a session,
  // confirms it, and lands on the summary with the session booked.
  test('court of appeals should book a court session and reach the summary', async ({
    coaPage,
  }) => {
    const page = coaPage
    const nextWeek = getDaysFromNow(7)

    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
      page.goto(statusStepUrl),
    ])
    await page.getByLabel('Boða til þinghalds', { exact: true }).check()

    // Click the select control rather than the placeholder: react-select lays
    // the input container over the placeholder in the same grid cell.
    await page
      .locator('.island-select__control')
      .filter({ hasText: 'Veldu tegund þinghalds' })
      .click()
    await page.getByRole('option', { name: 'Aðalmeðferð' }).click()
    await page.locator('input[id=appeal-court-session-date]').fill(nextWeek)
    await page.keyboard.press('Escape')
    await page.getByTestId('appeal-court-session-date-time').fill('10:00')
    await page.getByLabel('Dómsalur').fill('201')
    await page.getByLabel('Dómsalur').press('Tab')

    await page.getByTestId('continueButton').click()
    await expect(
      page.getByRole('dialog', { name: 'Boða til þinghalds?' }),
    ).toBeVisible()
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'CreateAppealCourtSession'),
      page.getByTestId('confirmSessionButton').click(),
    ])

    // Summary
    await expect(page).toHaveURL(
      new RegExp(`/landsrettur/afryjun/samantekt/${caseId}(\\?.*)?$`),
    )
    await expect(page.getByRole('heading', { name: 'Samantekt' })).toBeVisible()

    // Back on the status step the booked session is listed, and the status
    // is read back from it.
    await page.getByTestId('previousButton').click()
    await expect(page).toHaveURL(
      new RegExp(`/landsrettur/afryjun/stada-og-lyktir/${caseId}(\\?.*)?$`),
    )
    await expect(
      page.getByLabel('Boða til þinghalds', { exact: true }),
    ).toBeChecked()
    await expect(page.getByText('Aðalmeðferð', { exact: true })).toBeVisible()
    await expect(page.getByText(/kl\. 10:00 · Dómsalur 201/)).toBeVisible()
  })
})
