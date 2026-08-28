import { expect } from '@playwright/test'
import { urls } from '../../../support/urls'
import { test } from '../utils/judicialSystemTest'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { getDaysFromNow, randomPoliceCaseNumber } from '../utils/helpers'
import { judgeSubmitsDecision } from './shared-steps/court-decision'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'
import { judgeReceivesAppealTest } from './shared-steps/receive-appeal'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Travel ban tests', () => {
  let caseId = ''
  const today = getDaysFromNow()
  const requestedTravelBanEndDate = getDaysFromNow(3)
  const travelBanEndDate = getDaysFromNow(2)

  test('prosecutor should be able to create a travel ban request', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    await page.goto('/malalistar')
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Farbann' }).click()
    await expect(page).toHaveURL('/krafa/ny/farbann')

    await page
      .getByRole('textbox', {
        name: 'Sláðu inn málsnúmer úr lögreglukerfi (LÖKE)',
      })
      .fill(randomPoliceCaseNumber())
    await page.getByRole('button', { name: 'Skrá númer' }).click()
    await page
      .getByRole('checkbox', {
        name: 'Varnaraðili er ekki með íslenska kennitölu',
      })
      .check()
    await page
      .getByRole('textbox', { name: 'Fæðingardagur' })
      .fill('12.12.2000')
    await page
      .getByRole('textbox', { name: 'Fullt nafn' })
      .fill('Glanni Glæpur')
    await page
      .getByRole('textbox', { name: 'Lögheimili/dvalarstaður' })
      .fill('Latibær')
    await page.locator('#defendantGender').click()
    await page.locator('#react-select-defendantGender-option-0').click()
    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
    ]).then((values) => {
      const createCaseResult = values[1]
      caseId = createCaseResult.data.createCase.id
    })

    await expect(page).toHaveURL(`/krafa/fyrirtaka/${caseId}`)
    await page.locator('input[id=arrestDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=arrestDate-time]').fill('12:12')
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqCourtDate-time]').fill('12:12')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram með kröfu' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${caseId}`,
    )
    await page
      .locator('input[id=reqValidToDate]')
      .fill(requestedTravelBanEndDate)
    await page.keyboard.press('Escape')
    await page.locator('textarea[name=lawsBroken]').click()
    await page.keyboard.type('Einhver lög voru brotin')
    await page.getByTestId('checkbox').first().click()
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await expect(page).toHaveURL(`/krafa/greinargerd/${caseId}`)
    await page.locator('textarea[name=caseFacts]').click()
    await page.keyboard.type('Málsatvik')
    await page.getByRole('textbox', { name: 'Lagarök' }).click()
    await page.keyboard.type('Lagarök')
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${caseId}`)
    await Promise.all([
      page.getByRole('button', { name: 'Halda áfram' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    await expect(page).toHaveURL(`/krafa/stadfesta/${caseId}`)
    await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
    await page.getByTestId('modalSecondaryButton').click()
    await expect(page).toHaveURL('/malalistar')
  })

  test('court should submit decision on travel ban case', async ({
    judgePage,
  }) => {
    await judgeSubmitsDecision(judgePage, caseId, {
      acceptRulingText: 'Krafa um farbann samþykkt',
      validToDate: travelBanEndDate,
    })
  })

  test('prosecutor should appeal case', async ({ prosecutorPage }) => {
    await prosecutorAppealsCaseTest(prosecutorPage, caseId)
  })

  test('judge should receive appealed case', async ({ judgePage }) => {
    await judgeReceivesAppealTest(judgePage, caseId)
  })

  test('coa judge should submit decision in appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId)
  })
})
