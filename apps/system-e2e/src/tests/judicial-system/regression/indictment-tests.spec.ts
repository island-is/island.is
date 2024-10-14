import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import {
  randomPoliceCaseNumber,
  getDaysFromNow,
  uploadDocument,
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

    // Case list
    await page.goto('/krofur')
    await page.getByRole('button', { name: 'Nýtt mál' }).click()
    await page.getByRole('menuitem', { name: 'Ákæra' }).click()
    await expect(page).toHaveURL('/akaera/ny')

    // New indictment case
    await page.getByTestId('policeCaseNumber0').click()
    await page.getByTestId('policeCaseNumber0').fill(randomPoliceCaseNumber())
    await page.getByText('Sakarefni *Veldu sakarefni').click()
    await page.locator('#react-select-case-type-option-0').click()
    await page.getByPlaceholder('Sláðu inn vettvang').click()
    await page.getByPlaceholder('Sláðu inn vettvang').fill('Reykjavík')
    await page.locator('input[id=arrestDate]').fill(today)
    await page.keyboard.press('Escape')
    await page
      .getByRole('checkbox', { name: 'Ákærði er ekki með íslenska kennitölu' })
      .check()
    await page.getByTestId('inputNationalId').click()
    await page.getByTestId('inputNationalId').fill('01.01.2000')
    await page.getByTestId('inputName').click()
    await page.getByTestId('inputName').fill(accusedName)
    await page.getByTestId('inputName').press('Tab')
    await page.getByTestId('accusedAddress').fill('Testgata 12')
    await page.locator('#defendantGender').click()
    await page.locator('#react-select-defendantGender-option-0').click()
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

    // Processing
    await Promise.all([
      expect(page).toHaveURL(`/akaera/malsmedferd/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
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

    // Case files
    await expect(page).toHaveURL(`/akaera/domskjol/${caseId}`)

    await uploadDocument(
      page,
      async () => {
        await page
          .getByText(
            'Ákæra *Dragðu gögn hingað til að hlaða uppVelja gögn til að hlaða upp',
          )
          .click()
      },
      'TestAkaera.pdf',
    )
    await uploadDocument(
      page,
      async () => {
        await page
          .getByText(
            'Sakavottorð *Dragðu gögn hingað til að hlaða uppVelja gögn til að hlaða upp',
          )
          .click()
      },
      'TestSakavottord.pdf',
    )

    await Promise.all([page.getByTestId('continueButton').click()])

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
    await page.goto('/krofur')
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
})
