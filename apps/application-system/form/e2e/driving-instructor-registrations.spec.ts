import { test as base, Page } from '@playwright/test'
import { expect } from '@island.is/testing/e2e'

import { session, proceed } from '@island.is/testing/e2e'

const homeUrl = '/umsoknir/okutimar'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()

    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication('okutimar')
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Driving Instructor Registrations', () => {
  applicationTest(
    'should be able to only register minutes for valid student',
    async ({ applicationPage }) => {
      const page = applicationPage
      // Data providers
      await page.getByTestId('agree-to-data-providers').click()
      await proceed(page)

      // Student selection
      await page.getByRole('cell', { name: '010130-5069' }).dblclick()
      await page
        .getByRole('cell', { name: 'Skrá' })
        .getByRole('button', { name: 'Skrá' })
        .first()
        .click()

      // Register 45 minute driving
      await page.locator('label').filter({ hasText: '45' }).click()
      await page.getByPlaceholder('Veldu dagsetningu').click()
      await page.getByPlaceholder('Veldu dagsetningu').press('Enter')
      await page.getByRole('button', { name: 'Vista' }).click()

      // Change most recent registration to many minutes last month
      // Change minutes
      await page.waitForTimeout(5000)
      await page
        .getByRole('row')
        .getByRole('button', { name: 'Breyta' })
        .first()
        .click()
      const manualMinutes = page.getByText('Slá inn mínútur')
      await manualMinutes.click()
      await manualMinutes.fill('999')
      // Change date
      await page.getByPlaceholder('Veldu dagsetningu').click()
      await page.getByRole('button', { name: 'Previous month' }).click()
      await page.getByRole('option', { name: 'Choose' }).first().click()
      await page.getByRole('button', { name: 'Breyta' }).first().click()
      await expect(page.getByRole('cell', { name: '999' })).toBeVisible()
      // Cleanup
      await page.getByRole('button', { name: 'Breyta' }).first().click()
      await page.getByRole('button', { name: 'Eyða skráningu' }).click()

      // Attempt to go back and register for forbidden student
      await page.getByRole('button', { name: 'Til baka' }).click()
      await page.getByText('Skrá tíma á aðra ökunema en mína').click()
      await page.getByLabel('Kennitala ökunema').click()
      // Self is invalid
      await page.getByLabel('Kennitala ökunema').fill('010130-7789 ')
      await page.getByRole('button', { name: 'Skrá ökutima' }).click()
      await expect(page.getByTestId('inputErrorMessage')).toBeVisible()
    },
  )
})
