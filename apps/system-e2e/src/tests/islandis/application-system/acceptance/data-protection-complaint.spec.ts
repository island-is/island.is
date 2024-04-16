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
    'Should be able to start the application and see it added on the application overview',
    async ({ applicationPage }) => {
      const page = applicationPage
      let numOfApplicationsAtStart = 0
      let numberOfApplicationsAfterCreationVisible = 0

      const agreeToDataProvidersTestId = 'agree-to-data-providers'
      const proceedTestId = 'proceed'
      const gervimadurAfricaText = 'Gervimaður Afríka'
      const overviewPageText = 'Þínar umsóknir'

      await applicationTest.step('Create a new application', async () => {
        numOfApplicationsAtStart = await createApplication(page)
      })

      await applicationTest.step(
        'Proceed with the application to reach the draft state',
        async () => {
          await page.getByTestId(agreeToDataProvidersTestId).check()
          await page.getByTestId(proceedTestId).click()
          await expect(page.getByText(gervimadurAfricaText)).toBeVisible()
        },
      )

      await applicationTest.step(
        'Go to the overview page and check the number of applications after creation',
        async () => {
          await page.goto(`${homeUrl}`, { waitUntil: 'load' })
          page.getByText(overviewPageText)

          numberOfApplicationsAfterCreationVisible =
            await countApplicationsVisible(page)

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
      const iconTrashTestId = 'icon-trash'
      const deleteConfirmationText = 'Já, eyða'
      const agreeToDataProvidersTestId = 'agree-to-data-providers'

      await applicationTest.step(
        'Delete an application and check the number of applications after deletion',
        async () => {
          const page = applicationPage
          const applicationAtStart = await createApplication(page)

          await page.goto(`${homeUrl}`, { waitUntil: 'load' })
          const visibleApplicationsAfterCreation =
            await countApplicationsVisible(page)
          await page.getByTestId(iconTrashTestId).first().click()
          await page
            .getByRole('button', { name: deleteConfirmationText })
            .click()
          await page.waitForResponse(
            '**/api/graphql?op=ApplicationApplications',
          )
          if (visibleApplicationsAfterCreation - 1 > 0) {
            const numberOfApplicationsAfterDeletion =
              await countApplicationsVisible(page)
            expect(numberOfApplicationsAfterDeletion).toBe(applicationAtStart)
          } else {
            await expect(
              page.getByTestId(agreeToDataProvidersTestId).first(),
            ).toBeVisible()
            await expect(applicationPage).toBeApplication()
          }
        },
      )
    },
  )
  // skip this test until devops solves the issue with uploading a file
  applicationTest.skip(
    'Should be able to start the application, fill in the form and upload a document',
    async ({ applicationPage }) => {
      const page = applicationPage
      const agreeToDataProvidersTestId = 'agree-to-data-providers'
      const proceedTestId = 'proceed'
      const noOptionLabel = 'Nei'
      const emailLabel = 'Netfang'
      const phoneNumberLabel = 'Símanúmer'

      const fullNameLabel = 'Fullt nafn'
      const nationalIdLabel = 'Kennitala'
      const uploadButtonName = 'Velja umboðsskjöl til að hlaða upp'
      const stepBackTestId = 'step-back'
      const firstCheckboxText =
        'Er málið sem um ræðir til meðferðar hjá dómstólum eða öðrum stjórnvöldum?'
      const secondCheckBoxText =
        'Ertu að kvarta yfir umfjöllun um þig eða aðra í fjölmiðlum?'
      const thirdCheckBoxText =
        'Ertu að kvarta yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt?'
      const fourthCheckBoxText =
        'Ertu að kvarta yfir einhverju sem var sagt eða skrifað um þig á netinu eða á öðrum opinberum vettvangi?'
      const infoAboutCaseText =
        'Ítarlegri upplýsingar um málsmeðferð hjá Persónuvernd má nálgast í {link}.'
      const forWhomText = 'Fyrir hvern ertu að senda inn kvörtun?'
      const inPowerOfText = 'Upplýsingar um umboð'
      const inPowerOfSomeoneElse = 'Í umboði fyrir aðra'
      const informationAboutCompanyText =
        'Upplýsingar um fyrirtæki, stofnun eða einstakling sem kvartað er yfir'

      await applicationTest.step('Start the application', async () => {
        await createApplication(page)
      })

      await applicationTest.step(
        'Agree to data providers and proceed',
        async () => {
          await page.getByTestId(agreeToDataProvidersTestId).check()
          await page.getByTestId(proceedTestId).click()
        },
      )

      // Answer "No" to all questions until "Upplýsingar um málsmeðferð" screen
      await applicationTest.step('Answer questions', async () => {
        await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
        await expect(page.getByText(firstCheckboxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await page.getByTestId(proceedTestId).click()

        await expect(page.getByText(secondCheckBoxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await page.getByTestId(proceedTestId).click()

        await expect(page.getByText(thirdCheckBoxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await page.getByTestId(proceedTestId).click()

        await expect(page.getByText(fourthCheckBoxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await page.getByTestId(proceedTestId).click()

        await expect(page.getByText(infoAboutCaseText)).toBeVisible()
        await page.getByTestId(proceedTestId).click()
      })

      await applicationTest.step('Select representation option', async () => {
        await expect(page.getByText(forWhomText)).toBeVisible()
        await page.getByLabel(inPowerOfSomeoneElse).check()
        await page.getByTestId(proceedTestId).click()
      })

      await applicationTest.step('Fill in contact information', async () => {
        await page.getByLabel(emailLabel).last().fill('test@test.test')
        await page.getByLabel(phoneNumberLabel).last().fill('777-3019')
        await page.getByTestId(proceedTestId).click()
      })

      await applicationTest.step(
        'Upload document and provide representative info',
        async () => {
          await expect(
            page.getByRole('heading', { name: inPowerOfText }),
          ).toBeVisible()
          const fileChooserPromise = page.waitForEvent('filechooser')
          const uploadButton = page.getByRole('button', {
            name: uploadButtonName,
            exact: true,
          })
          await uploadButton.click()
          const chooser = await fileChooserPromise
          await chooser.setFiles('someFileThatDoesNotExist.txt')
          await page.getByLabel(fullNameLabel).last().fill('test@test.test')
          await page.getByLabel(nationalIdLabel).last().fill('0101302719')
          await page.getByTestId(proceedTestId).click()
        },
      )

      await applicationTest.step(
        'Check uploaded file and go back to verify the file is still there',
        async () => {
          await expect(
            page.getByText(informationAboutCompanyText),
          ).toBeVisible()
          await page.getByTestId(stepBackTestId).click()

          // Ensure the "file.rtf" is visible in the file upload field
          await expect(
            page.getByRole('button', {
              name: 'Dragðu umboðsskjöl hingað til að hlaða upp Tekið er við skjölum með endingu: .pdf, .docx, .rtf Velja umboðsskjöl til að hlaða upp file.rtf Fjarlægja skrá',
            }),
          ).toBeVisible()
        },
      )
    },
  )
})
