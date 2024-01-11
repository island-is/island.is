import { expect } from '@playwright/test'
import faker from 'faker'

import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { randomPoliceCaseNumber, randomCourtCaseNumber } from '../utils/helpers'

import { receiveAppealTest } from './shared-steps/receive-appeal'
import { appealCaseTest } from './shared-steps/send-appeal'
import { coaJudgeCompletesCaseTest } from './shared-steps/complete-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Custody tests', () => {
  let caseId = ''

  test('prosecutor should submit a custody request to court', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    // Case list
    await page.goto('/krofur')
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Gæsluvarðhald' }).click()
    await expect(page).toHaveURL('/krafa/ny/gaesluvardhald')

    // New custody request
    await expect(
      page.getByRole('heading', { name: 'Gæsluvarðhald' }),
    ).toBeVisible()
    await page
      .locator('input[name=policeCaseNumbers]')
      .fill(randomPoliceCaseNumber())
    await page.getByRole('button', { name: 'Skrá númer' }).click()
    await page.getByRole('checkbox').first().check()
    await page.locator('input[name=accusedName]').fill(faker.name.findName())
    await page.locator('input[name=accusedAddress]').fill('Einhversstaðar 1')
    await page.locator('#defendantGender').click()
    await page.locator('#react-select-defendantGender-option-0').click()
    await page
      .locator('input[id=react-select-defenderName-input]')
      .fill('Saul Goodman')
    await page.locator('#react-select-defenderName-option-0').click()
    await page
      .locator('input[name=defenderEmail]')
      .fill('jl-auto-defender@kolibri.is')
    await page.locator('input[name=defender-access-no]').click()
    await page.locator('input[name=leadInvestigator]').fill('Stjórinn')
    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
    ]).then((values) => {
      const createCaseResult = values[1]
      caseId = createCaseResult.data.createCase.id
    })
    await expect(page).toHaveURL(`/krafa/fyrirtaka/${caseId}`)

    // Court date request
    const today = new Date().toLocaleDateString('is-IS')
    await page.locator('input[id=arrestDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=arrestDate-time]').fill('00:00')
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqCourtDate-time]').fill('15:00')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await page.getByRole('button', { name: 'Halda áfram með kröfu' }).click()
    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${caseId}`,
    )

    // Prosecutor demands
    await page.locator('input[id=reqValidToDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqValidToDate-time]').fill('16:00')
    await page.waitForResponse((response) => {
      return response.request().url().includes('/graphql')
    })
    await page.locator('textarea[name=lawsBroken]').click({ delay: 50 })
    await page.keyboard.type('Einhver lög voru brotin', { delay: 50 })
    await page.getByTestId('checkbox').first().click()
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(`/krafa/greinargerd/${caseId}`)

    // Prosecutor statement
    await page.waitForResponse((response) => {
      return response.request().url().includes('/graphql')
    })
    await page.locator('textarea[name=caseFacts]').click({ delay: 50 })
    await page.keyboard.type('Eitthvað gerðist', { delay: 50 })
    await page.locator('textarea[name=legalArguments]').click()
    await page.keyboard.type('Þetta er ekki löglegt')
    await page.locator('textarea[name=comments]').click()
    await page.keyboard.type('Sakborningur er hættulegur')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${caseId}`)

    // Case files
    await page.locator('textarea[name=caseFilesComments]').click()
    await page.keyboard.type('Engin gögn fylgja')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(`/krafa/stadfesta/${caseId}`)

    // Submit to court
    await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
    await page.getByRole('button', { name: 'Loka glugga' }).click()
    await expect(page).toHaveURL('/krofur')
  })

  test('court should submit decision in case', async ({ judgePage }) => {
    const page = judgePage
    await page.goto(`/domur/mottaka/${caseId}`)

    // Reception and assignment
    await expect(page).toHaveURL(`/domur/mottaka/${caseId}`)
    await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
    await page.getByText('Veldu dómara/aðstoðarmann').click()
    await page.getByTestId('select-judge').getByText('Test Dómari').click()
    await page.getByTestId('continueButton').click()

    // Overview
    await expect(page).toHaveURL(`/domur/krafa/${caseId}`)
    await page.getByTestId('continueButton').isVisible()
    await page.getByTestId('continueButton').click()

    // Hearing arrangements
    await expect(page).toHaveURL(`/domur/fyrirtokutimi/${caseId}`)
    const date = new Date()
    const today = date.toLocaleDateString('is-IS')
    await page.locator('input[id=courtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=courtDate-time]').fill('09:00')
    await page.keyboard.press('Tab')
    await page
      .locator('input[id=react-select-defenderName-input]')
      .fill('Saul Goodmann')
    await page.locator('#react-select-defenderName-option-0').click()
    await page
      .locator('input[name=defenderEmail]')
      .fill('jl-auto-defender@kolibri.is')
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()

    // Ruling
    await expect(page).toHaveURL(`/domur/urskurdur/${caseId}`)
    date.setDate(date.getDate() + 5)
    const custodyEndDate = date.toLocaleDateString('is-IS')
    await page.getByText('Krafa um gæsluvarðhald samþykkt').click()
    await page.locator('input[id=validToDate]').fill(custodyEndDate)
    await page.keyboard.press('Escape')
    await page.locator('input[id=validToDate-time]').fill('16:00')
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
    await page.getByTestId('continueButton').click()

    // Court record
    await expect(page).toHaveURL(`/domur/thingbok/${caseId}`)
    await page.getByText('Varnaraðili tekur sér lögboðinn frest').click()
    await page.getByText('Sækjandi tekur sér lögboðinn frest').click()
    await page.locator('input[id=courtEndTime]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=courtEndTime-time]').fill('10:00')
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
    await page.getByTestId('continueButton').click()

    // Confirmation
    await expect(page).toHaveURL(`/domur/stadfesta/${caseId}`)
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'RequestRulingSignature'),
      page.getByTestId('continueButton').click(),
    ])
  })

  test('prosecutor should appeal case', async ({ prosecutorPage }) => {
    await appealCaseTest(prosecutorPage, caseId)
  })

  test('judge should receive appealed case', async ({ judgePage }) => {
    await receiveAppealTest(judgePage, caseId)
  })

  test('coa judge should submit decision in appeal case', async ({
    coaPage,
  }) => {
    await coaJudgeCompletesCaseTest(coaPage, caseId)
  })
})
