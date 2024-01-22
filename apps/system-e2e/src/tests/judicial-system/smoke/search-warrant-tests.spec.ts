import { expect } from '@playwright/test'
import faker from 'faker'
import subDays from 'date-fns/subDays'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { randomCourtCaseNumber, randomPoliceCaseNumber } from '../utils/helpers'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'
import { judgeReceivesAppealTest } from './shared-steps/receive-appeal'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Search warrant tests', () => {
  let caseId = ''

  test('prosecutor should submit a search warrant request to court', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    // Case list
    await page.goto('/krofur')
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
    await page.getByRole('checkbox').first().check()
    await page.locator('input[name=accusedName]').fill(faker.name.findName())
    await page.locator('input[name=accusedAddress]').fill('Einhversstaðar 1')
    await page.locator('#defendantGender').click()
    await page.locator('#react-select-defendantGender-option-0').click()
    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
    ]).then((values) => {
      const createCaseResult = values[1]
      caseId = createCaseResult.data.createCase.id
    })
    await expect(page).toHaveURL(`/krafa/rannsoknarheimild/fyrirtaka/${caseId}`)

    // Court date request
    const today = new Date().toLocaleDateString('is-IS')
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqCourtDate-time]').fill('15:00')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await page.getByRole('button', { name: 'Halda áfram með kröfu' }).click()

    await Promise.all([
      expect(page).toHaveURL(
        `/krafa/rannsoknarheimild/domkrofur-og-lagagrundvollur/${caseId}`,
      ),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])

    // Prosecutor demands
    await page.locator('textarea[name=lawsBroken]').click()
    await page.keyboard.type('Einhver lög voru brotin')
    await Promise.all([
      page.keyboard.press('Tab'),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])
    await page.locator('textarea[name=legalBasis]').click()
    await page.keyboard.type('Krafan byggir á lagaákvæðum')

    await Promise.all([
      page.keyboard.press('Tab'),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/greinargerd/${caseId}`,
    )

    // Prosecutor statement
    await page.locator('textarea[name=caseFacts]').click()
    await page.keyboard.type('Eitthvað gerðist')
    await page.locator('textarea[name=legalArguments]').click()
    await page.keyboard.type('Þetta er ekki löglegt')
    await page.locator('textarea[name=comments]').click()
    await page.keyboard.type('Sakborningur er hættulegur')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/rannsoknargogn/${caseId}`,
    )

    // Case files
    await page.locator('textarea[name=caseFilesComments]').click()
    await page.keyboard.type('Engin gögn fylgja')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(`/krafa/rannsoknarheimild/stadfesta/${caseId}`)

    // Submit to court
    await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
    await page.getByRole('button', { name: 'Loka glugga' }).click()
    await expect(page).toHaveURL('/krofur')
  })

  test('court should receive search warrant request and make a ruling', async ({
    judgePage,
  }) => {
    const page = judgePage
    const yesterday = subDays(new Date(), 1).toLocaleDateString('is-IS', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    // Reception and assignment
    await page.goto(`domur/rannsoknarheimild/mottaka/${caseId}`)
    await page.getByTestId('courtCaseNumber').click()
    await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
    await page
      .getByText('Veldu dómara/aðstoðarmann *Veldu héraðsdómara')
      .click()
    await page.getByTestId('select-judge').getByText('Test Dómari').click()
    await page.getByTestId('continueButton').click()

    // Overview
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/yfirlit/${caseId}`)
    await page.getByTestId('continueButton').click()

    // Hearing arrangements
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/fyrirtaka/${caseId}`)
    await page.getByText('Fulltrúar málsaðila boðaðir').click()
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()

    // Ruling
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/urskurdur/${caseId}`)
    await page.getByText('Krafa samþykkt').click()
    await page.getByTestId('continueButton').click()

    // Court Record
    await expect(page).toHaveURL(`/domur/rannsoknarheimild/thingbok/${caseId}`)
    await page.getByLabel('Dagsetning þingfestingar *').click()
    await page.locator('input[id=courtStartDate]').fill(yesterday)
    await page.keyboard.press('Escape')
    await page.getByTestId('courtStartDate-time').fill('12:00')
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
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
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
    await page.getByTestId('continueButton').click()

    await expect(page).toHaveURL(`/domur/rannsoknarheimild/stadfesta/${caseId}`)
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'RequestRulingSignature'),
      page.getByTestId('continueButton').click(),
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
