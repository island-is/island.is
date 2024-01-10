import { expect } from '@playwright/test'
import faker from 'faker'
import { test } from '../utils/judicialSystemTest'
import { randomPoliceCaseNumber } from '../utils/helpers'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'

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
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/domkrofur-og-lagagrundvollur/${caseId}`,
    )

    // Prosecutor demands
    await page.locator('textarea[name=lawsBroken]').click({ delay: 50 })
    await page.keyboard.type('Einhver lög voru brotin', { delay: 50 })
    await page.locator('textarea[name=legalBasis]').click({ delay: 50 })
    await page.keyboard.type('Krafan byggir á lagaákvæðum', { delay: 50 })
    await page.getByRole('button', { name: 'Halda áfram' }).click()
    await expect(page).toHaveURL(
      `/krafa/rannsoknarheimild/greinargerd/${caseId}`,
    )

    // Prosecutor statement
    await page.locator('textarea[name=caseFacts]').click({ delay: 50 })
    await page.keyboard.type('Eitthvað gerðist', { delay: 50 })
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
})
