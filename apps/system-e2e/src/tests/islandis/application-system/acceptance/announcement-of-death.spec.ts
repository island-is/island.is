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
    await disableObjectKey(applicationPage, 'existing')
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
  // Custom continue button
  const submitButton = 'button[type=submit]'
  const nextButton = 'button[data-testid=proceed]'

  applicationTest('test', async ({ applicationPage }) => {
    const page = applicationPage
    await expect(page).toBeApplication()

    await page.locator('data-testid=agree-to-data-providers').click()
    await page.locator(submitButton).click()

    await expect(
      page.locator('label[for=approveExternalData]'),
    ).not.toBeVisible()
    await expect(
      page.locator('h2:text("Fyrri umsóknir um andlátstilkynningu")'),
    ).not.toBeVisible()

    // Accept handling the announcement
    await page.locator('input[value=continue]').click()
    await page.locator(submitButton).click()

    // Relations screen
    // TODO improve selectability in this screen
    await page.locator('text=Veldu tengsl').click()
    await page.locator('div:text("Systir")').click()
    await page.locator('input[name=applicantPhone]').fill('500-5000')
    await page.locator('input[name=applicantEmail]').fill('e@mail.com')
    await page.locator(nextButton).click()

    // Other wills and prenup screen
    await page.locator('label[for=knowledgeOfOtherWills-1]').click()
    await page.locator(nextButton).click()

    // Heirs -> add a new heir
    await page.locator('text=Bæta við erfingja').click()
    await page.getByRole('textbox', { name: 'nationalId' }).fill('010130-5069')
    await page.locator('input[name=nationalId]').fill('010130-5069')
    await page.locator('input[name=relation"]').click()
    await page.locator('div:text("Systir")').click()
    await page.locator(nextButton).click()

    // Assets
    await page.locator('input[name=otherProperties]').first().check()
    await page.locator('input[name=otherProperties]').first().uncheck()
    await page.locator('p + div > [role=button]').click()
    await page.locator(nextButton).click()

    // Recipients of documents
    await page.locator('label[for=certificateOfDeathAnnouncement]').click()
    await page.locator('#react-select').first().click()
    await page.locator('label[for=authorizationForFuneralExpenses]').click()
    await page.locator('#react-select').first().click()
    await page
      .locator('[data-testid=select-financesDataCollectionPermission]')
      .click()
    await page.locator('#react-select').first().click()
    await page.locator(nextButton).click()

    // Overview screen
    await page.locator('textarea[name=additionalInfo]').fill('test test þæö')
    await page.locator('text=Staðfesta andlátstilkynningu').click()
    await page.locator(submitButton).fill('test test þæö')

    // Confirmation screen
    await page.locator('h2:has-text("Tilkynning móttekin")').dblclick()
  })
})
