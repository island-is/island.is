import { expect } from '@playwright/test'
import faker from 'faker'
import { test } from '../utils/judicialSystemTest'
import {
  randomPoliceCaseNumber,
  randomCourtCaseNumber,
  randomAppealCaseNumber,
  createPdf,
} from '../utils/helpers'

import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'

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
    Promise.all([
      page.getByRole('button', { name: 'Stofna mál' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'CreateCase'),
    ]).then((values) => {
      const createCaseResult = values[1]
      caseId = createCaseResult.data.createCase.id
    })
    await expect(page).toHaveURL(/.*\/krafa\/fyrirtaka\/.*/)

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
    await expect(page).toHaveURL(/.*\/krafa\/domkrofur-og-lagagrundvollur\/.*/)

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
    await expect(page).toHaveURL(/.*\/krafa\/greinargerd\/.*/)

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
    await expect(page).toHaveURL(/.*\/krafa\/rannsoknargogn\/.*/)

    // Case files
    await page.locator('textarea[name=caseFilesComments]').click()
    await page.keyboard.type('Engin gögn fylgja')
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(/.*\/krafa\/stadfesta\/.*/)

    // Submit to court
    await page.getByRole('button', { name: 'Senda kröfu á héraðsdóm' }).click()
    await page.getByRole('button', { name: 'Loka glugga' }).click()
    await expect(page).toHaveURL(/.*\/krofur/)
  })

  test('court should submit decision in case', async ({ judgePage }) => {
    const page = judgePage
    await page.goto(`/domur/mottaka/${caseId}`)

    // Reception and assignment
    await expect(page).toHaveURL(/.*\/domur\/mottaka\/.*/)
    await page.getByTestId('courtCaseNumber').fill(randomCourtCaseNumber())
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.keyboard.press('Tab'),
    ])
    await page.getByText('Veldu dómara/aðstoðarmann').click()
    await page.getByTestId('select-judge').getByText('Test Dómari').click()
    await page.getByTestId('continueButton').click()

    // Overview
    await expect(page).toHaveURL(/.*\/domur\/krafa\/.*/)
    await page.getByTestId('continueButton').isVisible()
    await page.getByTestId('continueButton').click()

    // Hearing arrangements
    await expect(page).toHaveURL(/.*\/domur\/fyrirtokutimi\/.*/)
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
    await expect(page).toHaveURL(/.*\/domur\/urskurdur\/.*/)
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
    await expect(page).toHaveURL(/.*\/domur\/thingbok\/.*/)
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
    await expect(page).toHaveURL(/.*\/domur\/stadfesta\/.*/)
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'RequestRulingSignature'),
      page.getByTestId('continueButton').click(),
    ])
  })

  test('prosecutor should appeal case', async ({ prosecutorPage }) => {
    const page = prosecutorPage
    await page.goto(`krafa/yfirlit/${caseId}`)

    await expect(page).toHaveURL(/.*\/krafa\/yfirlit\/.*/)
    await page.getByRole('button', { name: 'Senda inn kæru' }).click()

    // Send appeal
    await expect(page).toHaveURL(/.*\/kaera\/.*/)
    const appealFileChooserPromise = page.waitForEvent('filechooser')
    await page
      .locator('section')
      .filter({
        hasText:
          'Kæra *Dragðu skjöl hingað til að hlaða uppTekið er við skjölum með endingu: .pdf',
      })
      .locator('button')
      .click()
    const appealPdfBuffer = await createPdf('Kæra sækjanda')
    const appealFileChooser = await appealFileChooserPromise

    await appealFileChooser.setFiles({
      name: 'TestKaera.pdf',
      mimeType: 'application/pdf',
      buffer: appealPdfBuffer,
    })

    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
      verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
    ])
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()

    // Overview
    await expect(page).toHaveURL(/.*\/krafa\/yfirlit\/.*/)
    await page.getByRole('button', { name: 'Senda greinargerð' }).click()

    // Send statement
    await expect(page).toHaveURL(/.*\/greinargerd\/.*/)
    const statementFileChooserPromise = page.waitForEvent('filechooser')
    await page
      .locator('section')
      .filter({
        hasText:
          'Greinargerð *Dragðu skjöl hingað til að hlaða uppTekið er við skjölum með ending',
      })
      .locator('button')
      .click()

    const statementPdfBuffer = await createPdf('Greinargerð sækjanda')
    const statementFileChooser = await statementFileChooserPromise

    await statementFileChooser.setFiles({
      name: 'TestGreinargerd.pdf',
      mimeType: 'application/pdf',
      buffer: statementPdfBuffer,
    })

    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
      verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
    ])
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalSecondaryButton').click()
  })

  test('judge should receive appealed case', async ({ judgePage }) => {
    const page = judgePage

    await page.goto(`krafa/yfirlit/${caseId}`)
    await page
      .getByRole('button', { name: 'Senda tilkynningu um móttöku' })
      .click()
    await page.getByTestId('modalPrimaryButton').click()
  })

  test('coa judge should submit decision in appeal case', async ({
    coaPage,
  }) => {
    const page = coaPage
    await page.goto(`/landsrettur/yfirlit/${caseId}`)

    // Overview
    await expect(page).toHaveURL(/.*\/landsrettur\/yfirlit\/.*/)
    await page.getByTestId('continueButton').click()

    // Appeal case reception
    await expect(page).toHaveURL(/.*\/landsrettur\/kaera\/.*/)
    await page.getByText('Mál nr. *').fill(randomAppealCaseNumber())

    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
      page.getByText('Mál nr. *').press('Tab'),
    ])
    await page
      .getByTestId('select-assistant')
      .getByTestId('icon-chevronDown')
      .click({ delay: 50 })
    await page.locator('#react-select-assistant-option-0').click()
    await page.getByTestId('icon-chevronDown').nth(2).click()
    await page.locator('#react-select-judge-option-0').click()
    await page.getByTestId('icon-chevronDown').nth(3).click()
    await page.locator('#react-select-judge-option-0').click()
    await page.getByTestId('icon-chevronDown').nth(4).click()
    await page.locator('#react-select-judge-option-0').click()
    await page.getByTestId('continueButton').click()
    await page.getByTestId('modalPrimaryButton').click()

    // Ruling
    await expect(page).toHaveURL(/.*\/landsrettur\/urskurdur\/.*/)
    await Promise.all([
      page.locator('label').filter({ hasText: 'Staðfesting' }).click(),
      verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    ])
    await page.getByPlaceholder('Hver eru úrskurðarorð Landsréttar?').click()
    await page
      .getByPlaceholder('Hver eru úrskurðarorð Landsréttar?')
      .fill('Test úrskurðarorð Landsréttar')
    await page
      .getByPlaceholder('Hver eru úrskurðarorð Landsréttar?')
      .press('Tab')

    const rulingFileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Velja gögn til að hlaða upp').click()

    const rulingPdfBuffer = await createPdf('Niðurstaða Landsréttar')
    const rulingFileChooser = await rulingFileChooserPromise

    await rulingFileChooser.setFiles({
      name: 'TestNidurstada.pdf',
      mimeType: 'application/pdf',
      buffer: rulingPdfBuffer,
    })

    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'CreatePresignedPost'),
      verifyRequestCompletion(page, '/api/graphql', 'CreateFile'),
    ])

    await page.getByTestId('continueButton').click()
    await expect(page).toHaveURL(/.*\/landsrettur\/samantekt\/.*/)
    await page.getByTestId('continueButton').click()
  })
})
