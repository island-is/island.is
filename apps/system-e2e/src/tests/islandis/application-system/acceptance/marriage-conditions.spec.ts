import { expect, test as base, Page } from '@playwright/test'
import { sleep } from '../../../../../src/support/utils'
import {
  disableI18n,
  disablePreviousApplications,
  disableObjectKey,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'

const homeUrl = '/umsoknir/hjonavigsla'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0107789',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    // await disableObjectKey(applicationPage, 'existingApplication')
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Marriage Conditions', () => {
  applicationTest(
    'Should be able to check conditions up to payment',
    async ({ applicationPage }) => {
      const page = applicationPage

      // Fake data
      await expect(page.locator('form')).toBeVisible()
      if (
        (await page.getByRole('heading', { name: 'Gervigögn' }).all()).length >
        0
      ) {
        await page.getByLabel('Já').check()
        const maritalStatusDropdown = page.getByTestId(
          'select-fakeData.maritalStatus',
        )
        await maritalStatusDropdown.getByText('Hjúskaparstaða').click()
        await maritalStatusDropdown
          .locator('[id="react-select-fakeData\\.maritalStatus-option-0"]')
          .click()
        await page.getByTestId('proceed').click()
      }

      // Introduction
      await page.getByTestId('proceed').click()

      // Data providers
      await page.getByTestId('agree-to-data-providers').check()
      await page.getByTestId('proceed').click()

      // Spouse information
      await page.getByLabel('Kennitala *').fill('010130-3019')
      await page.getByLabel('Símanúmer').last().fill('777-3019')
      await page.getByLabel('Netfang').last().fill('test@test.test')
      await sleep(500)
      await page.getByTestId('proceed').click()

      // Spose overview
      await page.getByTestId('proceed').click()

      // Planned marriage
      // Date
      await page
        .getByRole('region', { name: 'Liggur hjónavígsludagur fyrir?' })
        .getByText('Já')
        .click()
      // await page.getByText('Áætlaður hjónavígsludagur').click()
      await page.getByText('Áætlaður hjónavígsludagur').click()
      await page.getByRole('option', { name: 'Choose' }).first().click()
      // Place
      const placeRegion = page.getByRole('region', {
        name: 'Hvar er hjónavígsla áformuð?',
      })
      await placeRegion.getByText('Ekki ákveðið').click()
      await placeRegion.getByText('Trú- eða lífsskoðunarfélagi').click()
      const societyDropdown = page.getByTestId('select-ceremony.place.society')
      await societyDropdown.click()
      await societyDropdown
        .locator('[id="react-select-ceremony\\.place\\.society-option-0"]')
        .click()

      await placeRegion.getByText('Embætti sýslumanns').click()
      const officeDropdown = page.getByTestId('select-ceremony.place.office')
      await officeDropdown.click()
      await officeDropdown.getByText('Sýslumaðurinn').last().click()
      await page.getByTestId('proceed').click()

      // Witnesses
      // Witness 1
      const witness1NationalId = page.getByLabel('Kennitala').first()
      await witness1NationalId.fill('010130-2399')
      await page.getByLabel('Símanúmer').first().fill('777-5069')
      await page.getByLabel('Netfang').first().fill('test@test.test')
      // Witness 2
      const witness2NationalId = page.getByLabel('Kennitala').last()
      await witness2NationalId.fill('010130-2399')
      await page.getByLabel('Símanúmer').last().fill('777-2399')
      await page.getByLabel('Netfang').last().fill('test@test.test')
      await sleep(500)
      await page.getByTestId('proceed').click()

      // Final overview
      await expect(
        page.getByRole('heading', { name: 'Yfirlit yfir veittar upplýsingar' }),
      ).toBeVisible()
      await page.getByTestId('proceed').click()

      // Payment overview
      await page.getByRole('button', { name: 'Áfram í greiðslu' }).click()
    },
  )
})
