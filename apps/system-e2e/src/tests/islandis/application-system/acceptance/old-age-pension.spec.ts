import { expect, test as base, Page } from '@playwright/test'
import { createMockPdf, deleteMockPdf } from '../../../../../src/support/utils'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { oldAgePensionFormMessage } from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import { label } from '../../../../support/i18n'

const homeUrl = '/umsoknir/ellilifeyrir'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019',
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

applicationTest.describe('Old Age Pension', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Select type of application', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(oldAgePensionFormMessage.pre.applicationTypeTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('old-age-pension').click()
        await proceed()
      })

      await applicationTest.step('Agree to data providers', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(oldAgePensionFormMessage.pre.externalDataSubSection),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()
        await proceed()
      })

      await applicationTest.step(
        'Answer pension fund question and start application',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(oldAgePensionFormMessage.pre.questionTitle),
            }),
          ).toBeVisible()
          await page
            .getByRole('radio', {
              name: label(oldAgePensionFormMessage.shared.yes),
            })
            .click()
          await page
            .getByRole('button', {
              name: label(oldAgePensionFormMessage.pre.startApplication),
            })
            .click()
        },
      )

      await applicationTest.step('Fill in applicant info', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle,
            ),
          }),
        ).toBeVisible()

        const emailBox = page.getByRole('textbox', {
          name: label(oldAgePensionFormMessage.applicant.applicantInfoEmail),
        })
        await emailBox.selectText()
        // TODO: Do we need to create a test email and add it here like in the parental leave application?
        await emailBox.type('mockEmail@island.is')

        const phoneNumber = page.getByRole('textbox', {
          name: label(
            oldAgePensionFormMessage.applicant.applicantInfoPhonenumber,
          ),
        })
        await phoneNumber.selectText()
        await phoneNumber.type('6555555')
        await proceed()
      })

      await applicationTest.step('Fill in payment information', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(oldAgePensionFormMessage.payment.title),
          }),
        ).toBeVisible()
        const paymentBank = page.getByRole('textbox', {
          name: label(oldAgePensionFormMessage.payment.bank),
        })
        await paymentBank.selectText()
        await paymentBank.type('051226054678')

        await page
          .getByRole('region', {
            name: label(oldAgePensionFormMessage.payment.personalAllowance),
          })
          .getByRole('radio', {
            name: label(oldAgePensionFormMessage.shared.yes),
          })
          .click()

        const personalAllowance = page.getByTestId('personal-allowance-usage')
        await personalAllowance.selectText()
        await personalAllowance.type('100')

        await page
          .getByRole('region', {
            name: label(oldAgePensionFormMessage.payment.taxLevel),
          })
          .getByRole('radio', {
            name: label(oldAgePensionFormMessage.payment.taxIncomeLevel),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('One payment per year', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
            ),
          }),
        ).toBeVisible()
        await page
          .getByRole('radio', {
            name: label(oldAgePensionFormMessage.shared.no),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('View residence history', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              oldAgePensionFormMessage.residence.residenceHistoryTitle,
            ),
          }),
        ).toBeVisible()
        await proceed()
      })

      await applicationTest.step('Select period', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(oldAgePensionFormMessage.period.periodTitle),
          }),
        ).toBeVisible()

        await page.getByTestId('select-period.year').click()
        await page.keyboard.press('Enter')

        await page.getByTestId('select-period.month').click()
        await page.keyboard.press('Enter')
        await proceed()
      })

      await applicationTest.step(
        'Upload attachments for pension payments',
        async () => {
          // TODO: This does not work! Need to look into this better (applications that also upload files: financial-statements-inao and operating-licence test)
          await expect(
            page.getByRole('heading', {
              name: label(oldAgePensionFormMessage.fileUpload.pensionFileTitle),
            }),
          ).toBeVisible()

          createMockPdf()
          const fileChooserPromise = page.waitForEvent('filechooser')
          page
            .getByRole('button', {
              name: label(oldAgePensionFormMessage.fileUpload.attachmentButton),
              exact: true,
            })
            .click()
          const filechooser = await fileChooserPromise
          await filechooser.setFiles('./mockPdf.pdf')
          await page.waitForTimeout(1000)
          deleteMockPdf()
          await proceed()
        },
      )

      await applicationTest.step(
        'Check that additional documents header is visible',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                oldAgePensionFormMessage.fileUpload.additionalFileTitle,
              ),
            }),
          ).toBeVisible()
          await proceed()
        },
      )

      await applicationTest.step('Write comment', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(oldAgePensionFormMessage.comment.commentSection),
          }),
        ).toBeVisible()
        await page
          .getByPlaceholder(label(oldAgePensionFormMessage.comment.placeholder))
          .fill(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
          )
        await proceed()
      })

      await applicationTest.step('Submit application', async () => {
        await expect(
          page
            .locator('form')
            .getByRole('paragraph')
            .filter({
              hasText: label(
                oldAgePensionFormMessage.review.confirmSectionTitle,
              ),
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(oldAgePensionFormMessage.review.confirmTitle),
          })
          .click()
      })

      await applicationTest.step(
        'Check that conclusion screen header is visible and proceed to view the application',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(oldAgePensionFormMessage.conclusionScreen.title),
            }),
          ).toBeVisible()
          await page
            .getByRole('button', {
              name: label(
                oldAgePensionFormMessage.conclusionScreen
                  .buttonsViewApplication,
              ),
            })
            .click()
        },
      )

      await applicationTest.step(
        'Check that review application header is visible',
        async () => {
          await expect(
            page
              .locator('form')
              .getByRole('paragraph')
              .filter({
                hasText: label(oldAgePensionFormMessage.review.overviewTitle),
              }),
          ).toBeVisible()
        },
      )
    },
  )
})
