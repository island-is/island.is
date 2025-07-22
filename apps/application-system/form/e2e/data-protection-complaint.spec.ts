import { test as base, Page } from '@playwright/test'
import { expect } from '@island.is/testing/e2e'
import {
  disableI18n,
  session,
  createApplication,
  label,
  proceed,
} from '@island.is/testing/e2e'
import {
  complaint,
  delimitation,
  info,
  sharedFields,
} from '@island.is/application/templates/data-protection-complaint/messages'
import { coreMessages } from '@island.is/application/core/messages'

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
      const gervimadurAfricaText = 'Gervimaður Afríka'
      const overviewPageText = label(coreMessages.applications)

      await applicationTest.step('Create a new application', async () => {
        numOfApplicationsAtStart = await createApplication(page)
      })

      await applicationTest.step(
        'Proceed with the application to reach the draft state',
        async () => {
          await page.getByTestId(agreeToDataProvidersTestId).check()
          await proceed(page)
          await expect(page.getByText(gervimadurAfricaText)).toBeVisible()
        },
      )

      await applicationTest.step(
        'Go to the overview page and check the number of applications after creation',
        async () => {
          await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
          await page.getByText(overviewPageText)

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
      const deleteConfirmationText = label(
        coreMessages.deleteApplicationDialogConfirmLabel,
      )
      const agreeToDataProvidersTestId = 'agree-to-data-providers'

      await applicationTest.step(
        'Delete an application and check the number of applications after deletion',
        async () => {
          const page = applicationPage
          const applicationAtStart = await createApplication(page)

          await page.goto(`${homeUrl}`, { waitUntil: 'networkidle' })
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
            await page.getByTestId(agreeToDataProvidersTestId)
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
      const noOptionLabel = label(sharedFields.no)
      const emailLabel = label(info.labels.email)
      const phoneNumberLabel = label(info.labels.tel)
      const fullNameLabel = label(info.labels.name)
      const nationalIdLabel = label(info.labels.nationalId)
      const uploadButtonName = label(
        info.labels.commissionsDocumentsButtonLabel,
      )
      const stepBackTestId = 'step-back'
      const firstCheckboxText = label(delimitation.labels.inCourtProceedings)
      const secondCheckBoxText = label(
        delimitation.labels.concernsMediaCoverage,
      )
      const thirdCheckBoxText = label(delimitation.labels.concernsBanMarking)
      const fourthCheckBoxText = label(delimitation.labels.concernsLibel)
      const infoAboutCaseText = label(
        delimitation.labels.agreementDescriptionBulletSeven,
      )
      const forWhomText = label(info.general.pageTitle)
      const inPowerOfText = label(info.general.commissionsPageTitle)
      const inPowerOfSomeoneElse = label(info.labels.others)
      const informationAboutCompanyText = label(
        complaint.general.complaineePageTitle,
      )

      await applicationTest.step('Start the application', async () => {
        await createApplication(page)
      })

      await applicationTest.step(
        'Agree to data providers and proceed',
        async () => {
          await page.getByTestId(agreeToDataProvidersTestId).check()
          await proceed(page)
        },
      )

      // Answer "No" to all questions until "Upplýsingar um málsmeðferð" screen
      await applicationTest.step('Answer questions', async () => {
        await expect(page.getByText('Gervimaður Afríka')).toBeVisible()
        await expect(page.getByText(firstCheckboxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await proceed(page)

        await expect(page.getByText(secondCheckBoxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await proceed(page)

        await expect(page.getByText(thirdCheckBoxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await proceed(page)

        await expect(page.getByText(fourthCheckBoxText)).toBeVisible()
        await page.getByLabel(noOptionLabel).check()
        await proceed(page)

        await expect(page.getByText(infoAboutCaseText)).toBeVisible()
        await proceed(page)
      })

      await applicationTest.step('Select representation option', async () => {
        await expect(page.getByText(forWhomText)).toBeVisible()
        await page.getByLabel(inPowerOfSomeoneElse).check()
        await proceed(page)
      })

      await applicationTest.step('Fill in contact information', async () => {
        await page.getByLabel(emailLabel).last().fill('test@test.test')
        await page.getByLabel(phoneNumberLabel).last().fill('777-3019')
        await proceed(page)
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
          await proceed(page)
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
