import { expect, test as base, Page } from '@playwright/test'
import {
  createMockPdf,
  deleteMockPdf,
  sleep,
} from '../../../../../src/support/utils'
import {
  disableI18n,
  disablePreviousApplications,
  disableObjectKey,
  disableDelegations,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'

const homeUrl = '/umsoknir/rekstrarleyfi'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    // await disableObjectKey(applicationPage, 'existingApplication')
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    // await disableDelegations(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Operating Licence', () => {
  applicationTest(
    'Should be able to apply for larger accommodation',
    async ({ applicationPage }) => {
      const page = applicationPage
      page.goto(`${homeUrl}?delegationChecked=true`)

      // Fake data
      await expect(page.getByText('Umsókn um rekstrarleyfi')).toBeVisible()
      if (
        (await page.getByRole('heading', { name: 'Gervigögn' }).all()).length >
        0
      ) {
        await page.getByLabel('Já').check()
        await page.getByLabel('Skuldlaus').check()
        await page.getByLabel('Ekki á sakaskrá').check()
        await page.getByTestId('proceed').click()
      }

      // Introduction
      await page.getByTestId('proceed').click()

      // Data providers
      await page.getByTestId('agree-to-data-providers').check()
      await page.getByTestId('proceed').click()

      // Operation type
      await page.getByLabel('Gististaður').check()
      await page.getByLabel('Flokkur II').first().check()
      await page.getByLabel('Stærra gistiheimili').check()
      await page.getByTestId('proceed').click()

      // Accommodation info
      await page.getByLabel('Heiti veitinga-/ gististaðar').fill('Cool Place')
      await page.getByLabel('Virðisaukaskattsnúmer').fill('123456 ')
      await page.getByTestId('proceed').click()

      // Asset info
      await page.getByLabel('Fasteignanúmer').fill('2128077')
      await page.getByLabel('Heimilisfang').click()
      await page.getByText('Rýmisnúmer úr fasteignaskrá').click()
      await page.getByTestId('proceed').click()

      // Additional checks
      await page.getByLabel('Ég óska eftir leyfi til bráðabirgða').check()
      await page.getByLabel('Ég lýsi því yfir að skuldastaða').check()
      await page.getByLabel('Annað').fill('This is something else... ÞÆÖ 🤷')
      await page.getByTestId('proceed').click()

      // Extra documents
      await expect(
        page.getByRole('heading', { name: 'Fylgiskjöl' }),
      ).toBeVisible()
      createMockPdf()
      for (const uploadButton of await page
        .getByRole('button', {
          name: 'Velja skjöl til að hlaða upp',
          exact: true,
        })
        .all()) {
        const fileChooserPromise = page.waitForEvent('filechooser')
        await uploadButton.click()
        const chooser = await fileChooserPromise
        await chooser.setFiles('./mockPdf.pdf')
      }
      deleteMockPdf()
      await sleep(1000)
      await expect(page.getByText('Ógilt gildi.')).not.toBeVisible()
      await page.getByTestId('proceed').click()

      // Overview
      await page.getByTestId('proceed').click()

      // Payment overview
      await page.getByRole('button', { name: 'Greiða' }).click()

      // Payment portal
      await page.getByText('Mastercard').click()
      await page.getByRole('button', { name: 'Greiða' }).click()
      // 3D secure
      await page.getByRole('button', { name: 'Submit 3D data' }).click()
      await page.getByRole('button', { name: 'Áfram' }).click()

      // Payment verification
      await expect(
        page.getByRole('heading', {
          name: 'Umsókn þín um rekstrarleyfi hefur verið móttekin.',
        }),
      ).toBeVisible({ timeout: 120000 })
    },
  )
})
