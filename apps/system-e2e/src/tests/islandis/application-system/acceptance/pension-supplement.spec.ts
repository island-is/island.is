import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { pensionSupplementFormMessage } from '@island.is/application/templates/pension-supplement'
import { label } from '../../../../support/i18n'

const homeUrl = '/umsoknir/uppbot-a-lifeyri'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      // phoneNumber: '0103019',
      phoneNumber: '0104929', // Gervimaður Bretland
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication('uppbot-a-lifeyri')
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Pension Supplement', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      // External Data
      await applicationTest.step(
        'Agree to data providers and proceed',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(pensionSupplementFormMessage.pre.externalDataSection),
            }),
          ).toBeVisible()
          await page.getByTestId('agree-to-data-providers').click()
          await page
            .getByRole('button', {
              name: label(pensionSupplementFormMessage.pre.startApplication),
            })
            .click()
        },
      )

      // Applicant info
      await applicationTest.step(
        'Fill in applicant info and proceed',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(pensionSupplementFormMessage.info.subSectionTitle),
            }),
          ).toBeVisible()

          const emailBox = page.getByRole('textbox', {
            name: label(pensionSupplementFormMessage.info.applicantEmail),
          })
          await emailBox.selectText()
          // TODO: Do we need to create a test email and add it here like in the parental leave application?
          await emailBox.type('mockEmail@island.is')

          const phoneNumber = page.getByRole('textbox', {
            name: label(pensionSupplementFormMessage.info.applicantPhonenumber),
          })
          await phoneNumber.selectText()
          await phoneNumber.type('6555555')
          await proceed()
        },
      )

      // Payment information
      await applicationTest.step(
        'Fill in payment information and proceed',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(pensionSupplementFormMessage.info.paymentTitle),
            }),
          ).toBeVisible()
          const paymentBank = page.getByRole('textbox', {
            name: label(pensionSupplementFormMessage.info.paymentBank),
          })
          await paymentBank.selectText()
          await paymentBank.type('051226054678')
          await proceed()
        },
      )

      // Application reason
      await applicationTest.step(
        'Select application reason and proceed',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                pensionSupplementFormMessage.info.applicationReasonTitle,
              ),
            }),
          ).toBeVisible()

          // TODO: What application reason should we select?
          await page
            .getByRole('region', {
              name: label(
                pensionSupplementFormMessage.info.applicationReasonTitle,
              ),
            })
            .getByRole('checkbox', {
              name: label(
                pensionSupplementFormMessage.info.applicationReasonMedicineCost,
              ),
            })
            .click()
          await proceed()
        },
      )

      // Period
      await applicationTest.step('Select period and proceed', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(pensionSupplementFormMessage.info.periodTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('select-period.year').click()
        await page.keyboard.press('Enter')

        await page.getByTestId('select-period.month').click()
        await page.keyboard.press('Enter')
        await proceed()
      })

      // Additional documents
      await applicationTest.step(
        'Check that additional documents header is visible and proceed',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                pensionSupplementFormMessage.fileUpload.additionalFileTitle,
              ),
            }),
          ).toBeVisible()
          await proceed()
        },
      )

      // Comment
      await applicationTest.step('Write comment and proceed', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              pensionSupplementFormMessage.additionalInfo.commentSection,
            ),
          }),
        ).toBeVisible()
        await page
          .getByPlaceholder(
            label(
              pensionSupplementFormMessage.additionalInfo.commentPlaceholder,
            ),
          )
          .fill(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
          )
        await proceed()
      })

      // Submit application
      await applicationTest.step('Submit application and proceed', async () => {
        await expect(
          page
            .locator('form')
            .getByRole('paragraph')
            .filter({
              hasText: label(pensionSupplementFormMessage.confirm.title),
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(pensionSupplementFormMessage.confirm.title),
          })
          .click()
      })

      // Conclusion screen
      await applicationTest.step(
        'Check that conclusion screen header is visible and proceed to view the application',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(pensionSupplementFormMessage.conclusionScreen.title),
            }),
          ).toBeVisible()
          await page
            .getByRole('button', {
              name: label(
                pensionSupplementFormMessage.conclusionScreen
                  .buttonsViewApplication,
              ),
            })
            .click()
        },
      )

      // Review application
      await applicationTest.step(
        'Check that review application header is visible',
        async () => {
          await expect(
            page
              .locator('form')
              .getByRole('paragraph')
              .filter({
                hasText: label(
                  pensionSupplementFormMessage.confirm.overviewTitle,
                ),
              }),
          ).toBeVisible()
        },
      )
    },
  )
})
