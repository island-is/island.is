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

const countApplicationsVisible = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded')
  return page.getByTestId('application-card').count()
}

applicationTest.describe('Data protection complaint application', () => {
  applicationTest(
    'Should be able to start the application and seet it added on the application overview',
    async ({ applicationPage }) => {
      const page = applicationPage
      let numOfApplicationsAtStart = 0
      let numberOfApplicationsAfterCreationVisible = 0

      await applicationTest.step('Create a new application', async () => {
        numOfApplicationsAtStart = await createApplication(page)
        console.log(numOfApplicationsAtStart, 'at start')
      })

      await applicationTest.step(
        'Proceed with the application to reach the draft state',
        async () => {
          await page.getByTestId('agree-to-data-providers').check()
          await page.getByTestId('proceed').click()
          await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
        },
      )

      await applicationTest.step(
        'Go to the overview page and check the number of applications after creation',
        async () => {
          await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
          await page.getByText('Þínar umsóknir')

          numberOfApplicationsAfterCreationVisible = await countApplicationsVisible(
            page,
          )
          console.log(
            numberOfApplicationsAfterCreationVisible,
            'after creation',
          )

          expect(numberOfApplicationsAfterCreationVisible).toBe(
            numOfApplicationsAtStart + 1,
          )
        },
      )
    },
  )
  applicationTest(
    'Should be able to delete an application and that its not visible on overview',
    async ({ applicationPage }) => {
      await applicationTest.step(
        'Delete an application and check the number of applications after deletion',
        async () => {
          const page = applicationPage
          const applicationAtStart = await createApplication(page)

          await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
          // await page.waitForLoadState('domcontentloaded')
          const visibleApplicationsAfterCreation = await countApplicationsVisible(
            page,
          )
          await page.getByTestId('icon-trash').first().click()
          await page.getByRole('button', { name: 'Já, eyða' }).click()
          await page.waitForResponse(
            '**/api/graphql?op=ApplicationApplications',
          )
          if (visibleApplicationsAfterCreation - 1 > 0) {
            const numberOfApplicationsAfterDeletion = await countApplicationsVisible(
              page,
            )
            expect(numberOfApplicationsAfterDeletion).toBe(applicationAtStart)
          } else {
            await page.getByTestId('agree-to-data-providers')
            await expect(applicationPage).toBeApplication()
          }
        },
      )
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
