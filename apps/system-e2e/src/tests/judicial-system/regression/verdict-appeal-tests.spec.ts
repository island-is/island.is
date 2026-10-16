import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { getDaysFromNow } from '../utils/helpers'
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
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
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
        .getByRole('checkbox', { name: 'Ákærði óskar ekki eftir verjanda' })
        .check(),
    ])
    const confirmDefenderButton = page.getByRole('button', {
      name: 'Staðfesta val á verjanda',
    })
    await expect(confirmDefenderButton).toBeEnabled()
    await confirmDefenderButton.click()
    await Promise.all([
      page.getByTestId('modalPrimaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
    ])
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
