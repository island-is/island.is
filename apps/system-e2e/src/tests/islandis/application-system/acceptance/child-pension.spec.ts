import { expect, test as base, Page } from '@playwright/test'
// import { createMockPdf, deleteMockPdf } from '../../../../../src/support/utils'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { childPensionFormMessage } from '@island.is/application/templates/child-pension'
import { label } from '../../../../support/i18n'

const homeUrl = '/umsoknir/barnalifeyrir'

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
    await expect(applicationPage).toBeApplication()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Child Pension', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      // External Data
      await applicationTest.step('Agree to data providers', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.pre.externalDataSection),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()
        await page
          .getByRole('button', {
            name: label(childPensionFormMessage.pre.startApplication),
          })
          .click()
      })

      // Applicant info
      await applicationTest.step('Fill in applicant info', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.info.subSectionTitle),
          }),
        ).toBeVisible()

        const emailBox = page.getByRole('textbox', {
          name: label(childPensionFormMessage.info.applicantEmail),
        })
        await emailBox.selectText()
        // TODO: Do we need to create a test email and add it here like in the parental leave application?
        await emailBox.type('mockEmail@island.is')

        const phoneNumber = page.getByRole('textbox', {
          name: label(childPensionFormMessage.info.applicantPhonenumber),
        })
        await phoneNumber.selectText()
        await phoneNumber.type('6555555')
        await proceed()
      })

      // Payment information
      await applicationTest.step('Fill in payment information', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.info.paymentTitle),
          }),
        ).toBeVisible()
        const paymentBank = page.getByRole('textbox', {
          name: label(childPensionFormMessage.payment.bank),
        })
        await paymentBank.selectText()
        await paymentBank.type('051226054678')
        await proceed()
      })

      // Select child/children
      await applicationTest.step('Select child', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.info.chooseChildrenTitle),
          }),
        ).toBeVisible()

        await page
          .getByRole('region', {
            name: label(childPensionFormMessage.info.chooseChildrenTitle),
          })
          .getByRole('checkbox')
          .first()
          .click()
        await proceed()
      })

      // Select reason
      await applicationTest.step(
        'Select reason for selected child',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(childPensionFormMessage.info.childPensionReasonTitle),
            }),
          ).toBeVisible()

          // TODO: Hvaða ástæðu á að velja?
          await page
            .getByRole('region', {
              name: label(childPensionFormMessage.info.childPensionReasonTitle),
            })
            .getByRole('checkbox', {
              name: label(
                childPensionFormMessage.info
                  .childPensionReasonParentHasPensionOrDisabilityAllowance,
              ),
            })
            .click()
          await proceed()
        },
      )

      // Register child
      await applicationTest.step('Register child', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              childPensionFormMessage.info.childPensionAddChildQuestion,
            ),
          }),
        ).toBeVisible()

        await page
          .getByRole('region', {
            name: label(
              childPensionFormMessage.info.childPensionAddChildQuestion,
            ),
          })
          .getByRole('radio', {
            name: label(childPensionFormMessage.shared.yes),
          })
          .click()
        await proceed()

        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.info.registerChildTitle),
          }),
        ).toBeVisible()

        const childNationalId = page.getByRole('textbox', {
          name: label(childPensionFormMessage.info.registerChildNationalId),
        })
        await childNationalId.selectText()
        // eslint-disable-next-line local-rules/disallow-kennitalas
        await childNationalId.type('2409151460')

        // TODO: Hvaða ástæðu á að velja?
        await page
          .getByRole('checkbox', {
            name: label(
              childPensionFormMessage.info
                .childPensionReasonParentHasPensionOrDisabilityAllowance,
            ),
          })
          .click()
        await proceed()

        await expect(
          page.getByRole('heading', {
            name: label(
              childPensionFormMessage.info.registerChildRepeaterTitle,
            ),
          }),
        ).toBeVisible()
        await proceed()
      })

      // Upload confirmation of child support
      // TODO: This does not work! Need to look into this better (applications that also upload files: financial-statements-inao and operating-licence test)
      await applicationTest.step(
        'Upload confirmation of child support',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(childPensionFormMessage.fileUpload.maintenanceTitle),
            }),
          ).toBeVisible()

          // createMockPdf()
          // const fileChooserPromise = page.waitForEvent('filechooser')
          // page
          //   .getByRole('button', {
          //     name: label(childPensionFormMessage.fileUpload.attachmentButton),
          //     exact: true,
          //   })
          //   .click()
          // const filechooser = await fileChooserPromise
          // await filechooser.setFiles('./mockPdf.pdf')
          // await page.waitForTimeout(1000)
          // deleteMockPdf()
          await proceed()
        },
      )

      // Upload child support agreement
      // TODO: This does not work! Need to look into this better (applications that also upload files: financial-statements-inao and operating-licence test)
      await applicationTest.step('Upload child support agreement', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              childPensionFormMessage.fileUpload.notLivesWithApplicantTitle,
            ),
          }),
        ).toBeVisible()

        // createMockPdf()
        // const fileChooserPromise = page.waitForEvent('filechooser')
        // page
        //   .getByRole('button', {
        //     name: label(childPensionFormMessage.fileUpload.attachmentButton),
        //     exact: true,
        //   })
        //   .click()
        // const filechooser = await fileChooserPromise
        // await filechooser.setFiles('./mockPdf.pdf')
        // await page.waitForTimeout(1000)
        // deleteMockPdf()
        await proceed()
      })

      // Period
      await applicationTest.step('Select period', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.period.periodTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('select-period.year').click()
        await page.keyboard.press('Enter')

        await page.getByTestId('select-period.month').click()
        await page.keyboard.press('Enter')
        await proceed()
      })

      // Residence history
      await applicationTest.step('Residence history', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              childPensionFormMessage.residence.residenceHistoryTitle,
            ),
          }),
        ).toBeVisible()
        await proceed()
      })

      // Additional documents
      await applicationTest.step(
        'Check that additional documents header is visible',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                childPensionFormMessage.fileUpload.additionalFileTitle,
              ),
            }),
          ).toBeVisible()
          await proceed()
        },
      )

      // Comment
      await applicationTest.step('Write comment', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(childPensionFormMessage.comment.commentSection),
          }),
        ).toBeVisible()
        await page
          .getByPlaceholder(label(childPensionFormMessage.comment.placeholder))
          .fill(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
          )
        await proceed()
      })

      // Submit application
      await applicationTest.step('Submit application', async () => {
        await expect(
          page
            .locator('form')
            .getByRole('paragraph')
            .filter({
              hasText: label(childPensionFormMessage.confirm.title),
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(childPensionFormMessage.confirm.title),
          })
          .click()
      })

      // Conclusion screen
      await applicationTest.step(
        'Check that conclusion screen header is visible and proceed to view the application',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(childPensionFormMessage.conclusionScreen.title),
            }),
          ).toBeVisible()
          await page
            .getByRole('button', {
              name: label(
                childPensionFormMessage.conclusionScreen.buttonsViewApplication,
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
                hasText: label(childPensionFormMessage.confirm.overviewTitle),
              }),
          ).toBeVisible()
        },
      )
    },
  )
})
