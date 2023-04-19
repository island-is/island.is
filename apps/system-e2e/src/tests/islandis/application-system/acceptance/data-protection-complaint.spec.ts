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
import { urls } from '../../../../support/urls'

const homeUrl = '/umsoknir/kvortun-til-personuverndar'

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
    // await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    // await disableDelegations(applicationPage)
    await applicationPage.goto(homeUrl)
    // await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Data protection complaint application', () => {
  // async function countApplications(response: Response) {
  //   const response = await page.waitForResponse(
  //     '**/api/graphql?op=ApplicationApplications',
  //   )
  //   const responseData = await response.json()
  //   return responseData.data.applicationApplications.length || 0
  // }

  applicationTest.describe('Data protection complaint application', () => {
    applicationTest(
      'Should be able to start the application and be visible on overview, then delete the application and that its not visible on overview',
      async ({ applicationPage }) => {
        const page = applicationPage

        // Wait for the applications to load on the overview and count the number of applications
        const responsePromise = page.waitForResponse(
          '**/api/graphql?op=ApplicationApplications',
        )
        const response = await responsePromise
        const responseData = await response.json()
        const applicationsAtStart =
          responseData.data.applicationApplications.length || 0

        // if there is an application the overview wont redirect to a new application and we need
        // to click the button to create a new application
        if (applicationsAtStart > 0) {
          await page.getByTestId('create-new-application').click()
        }

        // Proceed with the application to reach the draft state
        await page.getByTestId('agree-to-data-providers').check()
        await page.getByTestId('proceed').click()
        await expect(page.getByText('Gervimaður Afríka')).toBeVisible()

        // Wait for the application to be created and check that the number of applications has increased by 1
        const responsePromiseEnd = page.waitForResponse(
          '**/api/graphql?op=ApplicationApplications',
        )

        // Go to the overview page
        await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
        await page.getByText('Þínar umsóknir')

        // Wait for the applications to load on the overview and count the number of visible applications
        const numberOfApplicationsAfterCreationVisible = await page
          .getByText('Kvörtun til Persónuverndar')
          .count()

        // Assert that the number of applications has increased by 1
        expect(numberOfApplicationsAfterCreationVisible).toBe(
          applicationsAtStart + 1,
        )

        // Click the delete button for the top application and confirm deletion
        await page.getByTestId('icon-trash').first().click()
        await page.getByRole('button', { name: 'Já, eyða' }).click()

        // playwright wait for applicationApplications to be refetched after removing an application
        await page.waitForResponse('**/api/graphql?op=ApplicationApplications')

        // Count the number of visible applications after deletion
        const numberOfApplicationsAfterDeletion = await page
          .getByText('Kvörtun til Persónuverndar')
          .count()

        await page.pause()

        // Assert that the number of applications has decreased by 1
        expect(numberOfApplicationsAfterDeletion).toBe(
          numberOfApplicationsAfterCreationVisible - 1,
        )
      },
    )
  })

  applicationTest(
    'Should be able to start the application, fill in the form and upload a document',
    async ({ applicationPage }) => {
      const page = applicationPage

      // Check the checkbox to agree to data providers and click proceed.
      await page.getByTestId('agree-to-data-providers').check()
      await page.getByTestId('proceed').click()

      // Ensure the first question is visible and answer "No" and proceed
      // through the questions until the "Upplýsingar um málsmeðferð" screen.
      await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
      await expect(
        page.getByText(
          'Er málið sem um ræðir til meðferðar hjá dómstólum eða öðrum stjórnvöldum?',
        ),
      ).toBeVisible()
      await page.getByLabel('Nei').check()
      await page.getByTestId('proceed').click()

      await expect(
        page.getByText(
          'Ertu að kvarta yfir umfjöllun um þig eða aðra í fjölmiðlum?',
        ),
      ).toBeVisible()
      await page.getByLabel('Nei').check()
      await page.getByTestId('proceed').click()

      await expect(
        page.getByText(
          'Ertu að kvarta yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt?',
        ),
      ).toBeVisible()
      await page.getByLabel('Nei').check()
      await page.getByTestId('proceed').click()

      await expect(
        page.getByText(
          'Ertu að kvarta yfir einhverju sem var sagt eða skrifað um þig á netinu eða á öðrum opinberum vettvangi?\n',
        ),
      ).toBeVisible()
      await page.getByLabel('Nei').check()
      await page.getByTestId('proceed').click()

      // Proceed through the questions until the "Upplýsingar um málsmeðferð" screen.
      await expect(page.getByText('Upplýsingar um málsmeðferð')).toBeVisible()
      await page.getByTestId('proceed').click()

      // Select the "Í umboði fyrir aðra" option and proceed.
      await expect(
        page.getByText('Fyrir hvern ertu að senda inn kvörtun?'),
      ).toBeVisible()
      await page.getByLabel('Í umboði fyrir aðra').check()
      await page.getByTestId('proceed').click()

      // Fill in the email and phone number fields, and proceed.
      await page.getByLabel('Netfang').last().fill('test@test.test')
      await page.getByLabel('Símanúmer').last().fill('777-3019')
      await page.getByTestId('proceed').click()

      // Ensure the "Upplýsingar um umboð" heading is visible, upload a document and proceed
      await expect(
        page.getByRole('heading', { name: 'Upplýsingar um umboð\n' }),
      ).toBeVisible()
      const fileChooserPromise = page.waitForEvent('filechooser')
      const uploadButton = page.getByRole('button', {
        name: 'Velja umboðsskjöl til að hlaða upp',
        exact: true,
      })
      await uploadButton.click()
      const chooser = await fileChooserPromise
      await chooser.setFiles(
        '/Users/thorvardurorneinarsson/repos/sendiradid/island.is/apps/system-e2e/src/tests/islandis/application-system/acceptance/assets/file.rtf',
      )
      await page.getByLabel('Fullt nafn').last().fill('test@test.test')
      await page.getByLabel('Kennitala').last().fill('0101302719')
      await page.getByTestId('proceed').click()

      // Ensure the "Upplýsingar um fyrirtæki, stofnun eða einstakling sem
      // kvartað er yfir" heading is visible and go back to the previous screen
      await expect(
        page.getByText(
          'Upplýsingar um fyrirtæki, stofnun eða einstakling sem kvartað er yfir',
        ),
      ).toBeVisible()
      await page.locator('button[data-testid="step-back"]:visible').click()

      // Ensure the "file.rtf" is visible in the file upload field
      await expect(
        page.getByRole('button', {
          name:
            'Dragðu umboðsskjöl hingað til að hlaða upp Tekið er við skjölum með endingu: .pdf, .docx, .rtf Velja umboðsskjöl til að hlaða upp file.rtf Fjarlægja skrá',
        }),
      ).toBeVisible()

      // deleteMockPdf()
    },
  )
})
