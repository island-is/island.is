import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  getDaysFromNow,
  randomCourtCaseNumber,
  randomPoliceCaseNumber,
} from '../utils/helpers'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'
import { judgeReceivesAppealTest } from './shared-steps/receive-appeal'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Search warrant tests', () => {
  let caseId = ''
  const today = getDaysFromNow()
  const yesterday = getDaysFromNow(-1)

  test('prosecutor should submit a search warrant request to court', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    // Case list
    await page.goto('/malalistar')
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Rannsóknarheimild' }).click()
    await expect(page).toHaveURL('/krafa/ny/rannsoknarheimild')

    // New custody request
    await expect(
      page.getByRole('heading', { name: 'Rannsóknarheimild' }).first(),
    ).toBeVisible()
    await page
      .locator('input[name=policeCaseNumbers]')
      .fill(randomPoliceCaseNumber())
    await page.getByRole('button', { name: 'Skrá númer' }).click()
    await page.locator('#type').click()
    await page.locator('#react-select-type-option-0').click()
    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ]).then((values) => {
      const createCaseResult = values[1]
      caseId = createCaseResult.data.createCase.id
    })

    // Defendant information
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/varnaradili/${caseId}`,
    )
    await page.getByRole('checkbox').first().check()
    await page.locator('input[name=inputName]').fill(faker.name.findName())
    await page.locator('input[name=accusedAddress]').fill('Einhversstaðar 1')
    await page.locator('#defendantGender').click()
    await page.locator('#react-select-defendantGender-option-0').click()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Court date request
    await expect(page).toHaveURL(`/krafa/rannsoknarheimild/fyrirtaka/${caseId}`)
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqCourtDate-time]').fill('15:00')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram með kröfu' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Prosecutor demands
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/domkrofur-og-lagagrundvollur/${caseId}`,
    )
    await page.locator('textarea[name=lawsBroken]').click()
    await page.keyboard.type('Einhver lög voru brotin')
    await page.keyboard.press('Tab')
    await page.locator('textarea[name=legalBasis]').click()
    await page.keyboard.type('Krafan byggir á lagaákvæðum')
    await page.keyboard.press('Tab')
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Prosecutor statement
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/greinargerd/${caseId}`,
    )
    await page.locator('textarea[name=caseFacts]').click()
    await page.keyboard.type('Eitthvað gerðist')
    await page.locator('textarea[name=legalArguments]').click()
    await page.keyboard.type('Þetta er ekki löglegt')
    await page.locator('textarea[name=comments]').click()
    await page.keyboard.type('Sakborningur er hættulegur')
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Case files
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/rannsoknargogn/${caseId}`,
    )
    await page.locator('textarea[name=caseFilesComments]').click()
    await page.keyboard.type('Engin gögn fylgja')
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Submit to court
    await expect(page).toHaveURL(`/krafa/rannsoknarheimild/stadfesta/${caseId}`)
    await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
    await page.getByRole('button', { name: 'Loka glugga' }).click()
    await expect(page).toHaveURL('/malalistar')
  })

  test('court should receive search warrant request and make a ruling', async ({
    judgePage,
  }) => {
    const page = judgePage

    // Reception and assignment
    await Promise.all([
      page.goto(`domur/rannsoknarheimild/mottaka/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])
    await page.getByTestId('courtCaseNumber').click()
    await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
    await page
      .getByText('Veldu dómara/aðstoðarmann *Veldu héraðsdómara')
      .click()
    await page.getByTestId('select-judge').getByText('Test Dómari').click()
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Overview
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/yfirlit/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Hearing arrangements
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/fyrirtaka/${caseId}`)
    await page.getByText('Fulltrúar málsaðila boðaðir').click()
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalSecondaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Ruling
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/urskurdur/${caseId}`)
    await page.getByText('Krafa samþykkt').click()
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Court Record
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/thingbok/${caseId}`)
    await page.getByLabel('Dagsetning þingfestingar *').click()
    await page.locator('input[id=courtStartDate]').fill(yesterday)
    await page.keyboard.press('Escape')
    await page.getByTestId('courtStartDate-time').fill('12:00')
    await page.keyboard.press('Tab')
    await page
      .locator('label')
      .filter({ hasText: 'Varnaraðili unir úrskurðinum' })
      .click()
    await page
      .locator('label')
      .filter({ hasText: 'Sækjandi tekur sér lögboðinn frest' })
      .click()
    await page.locator('input[id=courtEndTime]').fill(yesterday)
    await page.keyboard.press('Escape')
    await page.getByTestId('courtEndTime-time').fill('15:00')
    await page.keyboard.press('Tab')
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await expect(page).toHaveURL(`/domur/rannsoknarheimild/stadfesta/${caseId}`)
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    ])
  })

  test('prosecutor should appeal case', async ({ prosecutorPage }) => {
    await prosecutorAppealsCaseTest(prosecutorPage, caseId)
  })

  test('judge should receive appealed case', async ({ judgePage }) => {
    await judgeReceivesAppealTest(judgePage, caseId)
  })

  test('coa judge should submit decision in search warrant appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId)
  })
})
