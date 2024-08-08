import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { randomPoliceCaseNumber, getDaysFromNow } from '../utils/helpers'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Indictment tests', () => {
  let caseId = ''

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
    await page.getByTestId('nationalId').click()
    await page.getByTestId('nationalId').fill('01.01.2000')
    await page.getByTestId('accusedName').click()
    await page.getByTestId('accusedName').fill(faker.name.findName())
    await page.getByTestId('accusedName').press('Tab')
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

    // Case files
    await expect(page).toHaveURL(`/akaera/malsgogn/${caseId}`)
  })
})
