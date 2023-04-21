import { expect, test as base, Page } from '@playwright/test'
import { disableI18n } from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { createApplication } from '../../../../support/application'

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
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Data protection complaint application', () => {
  applicationTest(
    'Should be able to start the application and be visible on overview, then delete the application and that its not visible on overview',
    async ({ applicationPage }) => {
      const page = applicationPage

      const numOfApplicationsAtStart = await createApplication(page)

      // Proceed with the application to reach the draft state
      await page.getByTestId('agree-to-data-providers').check()
      await page.getByTestId('proceed').click()
      await expect(page.getByText('Gervimaður Afríka')).toBeVisible()

      // Go to the overview page
      await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
      await page.getByText('Þínar umsóknir')

      // Count the number of visible applications after creation
      const numberOfApplicationsAfterCreationVisible = await page
        .getByTestId('application-card')
        .count()

      // Assert that the number of applications has increased by 1
      expect(numberOfApplicationsAfterCreationVisible).toBe(
        numOfApplicationsAtStart + 1,
      )

      // Click the delete button for the top application and confirm deletion
      await page.getByTestId('icon-trash').first().click()
      await page.getByRole('button', { name: 'Já, eyða' }).click()

      // playwright wait for applicationApplications to be refetched after removing an application
      await page.waitForResponse('**/api/graphql?op=ApplicationApplications')

      // Count the number of visible applications after deletion
      const numberOfApplicationsAfterDeletion = await page
        .getByTestId('application-card')
        .count()

      // If there are 0 applications left the user will be redirected to create a new application
      if (numberOfApplicationsAfterDeletion > 0) {
        // Assert that the number of applications has decreased by 1 to verify delete function
        expect(numberOfApplicationsAfterDeletion).toBe(
          numberOfApplicationsAfterCreationVisible - 1,
        )
      } else {
        // Assert that the user has been redirected to a new application as the last application was deleted
        await expect(applicationPage).toBeApplication()
      }
    },
  )
})

// applicationTest(
//   'Should be able to start the application, fill in the form and upload a document',
//   async ({ applicationPage }) => {
//     const page = applicationPage

//     // Start the application
//     const numOfApplicationsAtStart = await createApplication(page)
//
//     // Check the checkbox to agree to data providers and click proceed.
//     await page.getByTestId('agree-to-data-providers').check()
//     await page.getByTestId('proceed').click()
//
//     // Ensure the first question is visible and answer "No" and proceed
//     // through the questions until the "Upplýsingar um málsmeðferð" screen.
//     await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
//     await expect(
//       page.getByText(
//         'Er málið sem um ræðir til meðferðar hjá dómstólum eða öðrum stjórnvöldum?',
//       ),
//     ).toBeVisible()
//     await page.getByLabel('Nei').check()
//     await page.getByTestId('proceed').click()
//
//     await expect(
//       page.getByText(
//         'Ertu að kvarta yfir umfjöllun um þig eða aðra í fjölmiðlum?',
//       ),
//     ).toBeVisible()
//     await page.getByLabel('Nei').check()
//     await page.getByTestId('proceed').click()
//
//     await expect(
//       page.getByText(
//         'Ertu að kvarta yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt?',
//       ),
//     ).toBeVisible()
//     await page.getByLabel('Nei').check()
//     await page.getByTestId('proceed').click()
//
//     await expect(
//       page.getByText(
//         'Ertu að kvarta yfir einhverju sem var sagt eða skrifað um þig á netinu eða á öðrum opinberum vettvangi?\n',
//       ),
//     ).toBeVisible()
//     await page.getByLabel('Nei').check()
//     await page.getByTestId('proceed').click()
//
//     // Proceed through the questions until the "Upplýsingar um málsmeðferð" screen.
//     await expect(page.getByText('Upplýsingar um málsmeðferð')).toBeVisible()
//     await page.getByTestId('proceed').click()
//
//     // Select the "Í umboði fyrir aðra" option and proceed.
//     await expect(
//       page.getByText('Fyrir hvern ertu að senda inn kvörtun?'),
//     ).toBeVisible()
//     await page.getByLabel('Í umboði fyrir aðra').check()
//     await page.getByTestId('proceed').click()
//
//     // Fill in the email and phone number fields, and proceed.
//     await page.getByLabel('Netfang').last().fill('test@test.test')
//     await page.getByLabel('Símanúmer').last().fill('777-3019')
//     await page.getByTestId('proceed').click()
//
//     // Ensure the "Upplýsingar um umboð" heading is visible, upload a document and proceed
//     await expect(
//       page.getByRole('heading', { name: 'Upplýsingar um umboð\n' }),
//     ).toBeVisible()
//     const fileChooserPromise = page.waitForEvent('filechooser')
//     const uploadButton = page.getByRole('button', {
//       name: 'Velja umboðsskjöl til að hlaða upp',
//       exact: true,
//     })
//     await uploadButton.click()
//     const chooser = await fileChooserPromise
//     await chooser.setFiles('someFileThatDoesNotExist.txt')
//     await page.getByLabel('Fullt nafn').last().fill('test@test.test')
//     await page.getByLabel('Kennitala').last().fill('0101302719')
//     await page.getByTestId('proceed').click()
//
//     // Ensure the "Upplýsingar um fyrirtæki, stofnun eða einstakling sem
//     // kvartað er yfir" heading is visible and go back to the previous screen
//     await expect(
//       page.getByText(
//         'Upplýsingar um fyrirtæki, stofnun eða einstakling sem kvartað er yfir',
//       ),
//     ).toBeVisible()
//     await page.locator('button[data-testid="step-back"]:visible').click()
//
//     // Ensure the "file.rtf" is visible in the file upload field
//     await expect(
//       page.getByRole('button', {
//         name:
//           'Dragðu umboðsskjöl hingað til að hlaða upp Tekið er við skjölum með endingu: .pdf, .docx, .rtf Velja umboðsskjöl til að hlaða upp file.rtf Fjarlægja skrá',
//       }),
//     ).toBeVisible()
//   },
// )
