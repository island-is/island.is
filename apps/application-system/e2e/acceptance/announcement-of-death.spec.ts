import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
  disableObjectKey,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'

const homeUrl = '/umsoknir/andlatstilkynningar'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disableObjectKey(applicationPage, 'existingApplication')
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Announcement of Death', () => {
  applicationTest('test', async ({ applicationPage }) => {
    const page = applicationPage
    await expect(page).toBeApplication()

    // Custom continue button
    const submitButton = page.getByRole('button', { name: 'Halda áfram' })
    const nextButton = page.getByTestId('proceed')

    // Data Providers
    await page.getByTestId('agree-to-data-providers').click()
    await page.getByTestId('proceed').click()

    // Accept handling the announcement
    await page.locator('input[value=continue]').click()
    await submitButton.click()

    // Relations screen
    // TODO improve selectability in this screen
    await page.locator('text=Veldu tengsl').click()
    await page.locator('div:text("Systir")').click()
    await page.locator('input[name=applicantPhone]').fill('500-5000')
    await page.locator('input[name=applicantEmail]').fill('e@mail.com')
    await nextButton.click()

    // Other wills and prenup screen
    await page.locator('label[for=knowledgeOfOtherWills-1]').click()
    await nextButton.click()

    // Heirs -> add a new heir
    await page.getByText('Bæta við erfingja').click()
    await page.getByLabel('Kennitala').last().fill('010130-5069')
    await page.getByLabel('Tengsl').last().click()
    await page.locator('div:text("Systir")').last().click()
    await expect(page.getByLabel('Nafn').last()).not.toBeEmpty()
    await nextButton.click()

    // Assets
    const foreignAssets = page.getByLabel('Eignir erlendis')
    await foreignAssets.check()
    await foreignAssets.uncheck()
    await nextButton.click()

    // Recipients of documents
    const dropdowns = page.getByLabel('Enginn viðtakandi') //locator('label[for=certificateOfDeathAnnouncement]')
    for (const dropdown of await dropdowns.all()) {
      await dropdown.click()
      await dropdown.getByText('Gervimaður').first().click()
    }
    await nextButton.click()

    // Overview screen
    await page.getByLabel('Upplýsingar').fill('test test þæö')
    await page
      .getByRole('button', { name: 'Staðfesta andlátstilkynningu' })
      .click()

    // Confirmation screen
    await expect(
      page.getByRole('heading', { name: 'Tilkynning móttekin' }),
    ).toBeVisible()
  })
})
