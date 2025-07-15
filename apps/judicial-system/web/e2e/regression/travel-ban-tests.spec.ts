import { expect } from '@island.is/testing/e2e'
import { urls, verifyRequestCompletion } from '@island.is/testing/e2e'

import { getDaysFromNow, randomCourtCaseNumber } from '../utils/helpers'
import { test } from '../utils/judicialSystemTest'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'
import { judgeReceivesAppealTest } from './shared-steps/receive-appeal'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'

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
      .fill('123-1231-23123')
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
    await page.getByRole('button', { name: 'Loka glugga' }).click()
    await expect(page).toHaveURL('/malalistar')
  })

  test('court should submit decision on travel ban case', async ({
    judgePage,
  }) => {
    const page = judgePage
    await Promise.all([
      page.goto(`/domur/mottaka/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Reception and assignment
    await expect(page).toHaveURL(`/domur/mottaka/${caseId}`)
    await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
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

    // Overview
    await expect(page).toHaveURL(`/domur/krafa/${caseId}`)
    await page.getByTestId('continueButton').isVisible()
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Hearing arrangements
    await expect(page).toHaveURL(`/domur/fyrirtokutimi/${caseId}`)
    await page.locator('input[id=courtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=courtDate-time]').fill('09:00')
    await page.keyboard.press('Tab')
    await page.getByTestId('continueButton').click()
    await Promise.all([
      page.getByTestId('modalSecondaryButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Ruling
    await expect(page).toHaveURL(`/domur/urskurdur/${caseId}`)
    await page.getByText('Krafa um farbann samþykkt').click()
    await page.locator('input[id=validToDate]').fill(travelBanEndDate)
    await page.keyboard.press('Escape')
    await page.locator('input[id=validToDate-time]').fill('16:00')
    await page.keyboard.press('Tab')
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Court record
    await expect(page).toHaveURL(`/domur/thingbok/${caseId}`)
    await page.getByText('Varnaraðili tekur sér lögboðinn frest').click()
    await page.getByText('Sækjandi tekur sér lögboðinn frest').click()
    await page.locator('input[id=courtEndTime]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=courtEndTime-time]').fill('10:00')
    await page.keyboard.press('Tab')
    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])

    // Confirmation
    await expect(page).toHaveURL(`/domur/stadfesta/${caseId}`)
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

  test('coa judge should submit decision in appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId)
  })
})
