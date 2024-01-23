import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  randomPoliceCaseNumber,
  randomCourtCaseNumber,
  getDaysFromNow,
  createFakePdf,
} from '../utils/helpers'
import { judgeReceivesAppealTest } from './shared-steps/receive-appeal'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Custody tests', () => {
  let caseId = ''
  let extendedCaseId = ''
  const today = getDaysFromNow()
  const tomorrow = getDaysFromNow(2)

  test('prosecutor should submit a custody request to court', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    await page.route('**/api/graphql', (route, request) => {
      const requestJSON = request.postDataJSON()

      if (requestJSON.operationName === 'CreateCase') {
        const modifiedData = requestJSON

        modifiedData.variables.input = {
          ...modifiedData.variables.input,
          defenderNationalId: '0909090909',
        }
        route.continue({
          method: 'POST',
          postData: JSON.stringify(modifiedData),
        })
      } else {
        route.continue()
      }
    })

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
    await page.locator('input[id=defender-access-ready-for-court]').click()

    await page.locator('input[name=leadInvestigator]').fill('Stjórinn')
    await expect(
      page.getByRole('button', { name: 'Óskir um fyrirtöku' }),
    ).toBeVisible()

    await Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
    ]).then((values) => {
      const createCaseResult = values[1]
      caseId = createCaseResult.data.createCase.id
    })

    // Court date request
    await expect(page).toHaveURL(`/krafa/fyrirtaka/${caseId}`)
    await page.locator('input[id=arrestDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=arrestDate-time]').fill('00:00')
    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqCourtDate-time]').fill('15:00')
    await expect(
      page.getByRole('button', { name: 'Dómkröfur og lagagrundvöllur' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await page.getByRole('button', { name: 'Halda áfram með kröfu' }).click()

    // Prosecutor demands
    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${caseId}`,
    )
    await page.locator('input[id=reqValidToDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqValidToDate-time]').fill('16:00')
    await page.waitForResponse((response) => {
      return response.request().url().includes('/graphql')
    })
    await page.locator('textarea[name=lawsBroken]').click({ delay: 50 })
    await page.keyboard.type('Einhver lög voru brotin', { delay: 50 })
    await page.getByTestId('checkbox').first().click()
    await expect(
      page.getByRole('button', { name: 'Greinargerð' }),
    ).toBeVisible()
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
    await expect(
      page.getByRole('button', { name: 'Rannsóknargögn' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Halda áfram' }).click()

    // Case files
    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${caseId}`)
    await page.locator('textarea[name=caseFilesComments]').click()
    await page.keyboard.type('Engin gögn fylgja')
    await expect(page.getByRole('button', { name: 'Samantekt' })).toBeVisible()
    await page.getByRole('button', { name: 'Halda áfram' }).click()

    // Submit to court
    await expect(page).toHaveURL(`/krafa/stadfesta/${caseId}`)
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
    await prosecutorAppealsCaseTest(prosecutorPage, caseId)
  })

  test('judge should receive appealed case', async ({ judgePage }) => {
    await judgeReceivesAppealTest(judgePage, caseId)
  })

  test('defender should be able to send a statement and does not see prosecutor case files', async ({
    defenderPage,
  }) => {
    const page = defenderPage
    await page.goto(`/verjandi/krafa/${caseId}`)

    await expect(page.getByText('TestKaerugognSaekjanda.pdf')).toHaveCount(0)
    await expect(
      page.getByText('TestGreinargerdargognSaekjanda.pdf'),
    ).toHaveCount(0)

    await page.getByRole('button', { name: 'Senda greinargerð' }).click()

    const statementFileChooserPromise = page.waitForEvent('filechooser')
    await page
      .locator('section')
      .filter({
        hasText:
          'Greinargerð *Dragðu skjöl hingað til að hlaða uppTekið er við skjölum með ending',
      })
      .locator('button')
      .click()

    const statementFileChooser = await statementFileChooserPromise
    await page.waitForTimeout(1000)
    await statementFileChooser.setFiles(
      await createFakePdf('TestGreinargerdVerjanda.pdf'),
    )
    await Promise.all([
      verifyRequestCompletion(
        page,
        '/api/graphql',
        'LimitedAccessCreatePresignedPost',
      ),
      verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCreateFile'),
    ])

    const statementCaseFileChooserPromise = page.waitForEvent('filechooser')
    await page
      .locator('section')
      .filter({
        hasText:
          'GögnEf ný gögn eiga að fylgja greinargerðinni er hægt að hlaða þeim upp hér að n',
      })
      .locator('button')
      .click()

    const statementCaseFileChooser = await statementCaseFileChooserPromise

    await statementCaseFileChooser.setFiles(
      await createFakePdf('TestGreinargerdVerjandaGogn.pdf'),
    )
    await Promise.all([
      verifyRequestCompletion(
        page,
        '/api/graphql',
        'LimitedAccessCreatePresignedPost',
      ),
      verifyRequestCompletion(page, '/api/graphql', 'LimitedAccessCreateFile'),
    ])

    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()
  })

  test('coa judge should submit decision in appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId)
  })

  test('prosecutor asks for extension', async ({ prosecutorPage }) => {
    const page = prosecutorPage
    await page.goto(`/krafa/yfirlit/${caseId}`)
    await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)

    await Promise.all([
      page.getByTestId('continueButton').click(),
      verifyRequestCompletion(page, '/api/graphql', 'ExtendCase'),
    ]).then((values) => {
      const extendCaseResult = values[1]
      extendedCaseId = extendCaseResult.data.extendCase.id
    })

    // Defendant
    await expect(page).toHaveURL(`/krafa/sakborningur/${extendedCaseId}`)
    await page.locator('input[name=defender-access-no]').click()
    await page.getByTestId('continueButton').click()

    // Court date request
    await expect(page).toHaveURL(`/krafa/fyrirtaka/${extendedCaseId}`)

    await page.locator('input[id=reqCourtDate]').fill(today)
    await page.keyboard.press('Escape')
    await page.getByTestId('reqCourtDate-time').click()
    await page.getByTestId('reqCourtDate-time').fill('10:00')

    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()

    // Prosecutor demands
    await expect(page).toHaveURL(
      `/krafa/domkrofur-og-lagagrundvollur/${extendedCaseId}`,
    )

    await page.locator('input[id=reqValidToDate]').fill(tomorrow)
    await page.keyboard.press('Escape')
    await page.locator('input[id=reqValidToDate-time]').fill('16:00')
    await page.waitForResponse((response) => {
      return response.request().url().includes('/graphql')
    })
    await page.getByTestId('continueButton').click()

    // Prosecutor statement
    await expect(page).toHaveURL(`/krafa/greinargerd/${extendedCaseId}`)
    await page.getByTestId('continueButton').click()

    // Case files
    await expect(page).toHaveURL(`/krafa/rannsoknargogn/${extendedCaseId}`)
    await page.getByTestId('continueButton').click()

    // Submit to court
    await expect(page).toHaveURL(`/krafa/stadfesta/${extendedCaseId}`)

    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()
  })
})
