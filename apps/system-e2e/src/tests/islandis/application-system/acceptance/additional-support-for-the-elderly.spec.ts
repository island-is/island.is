import { expect, test as base, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { session } from '../../../../support/session'
import { helpers } from '../../../../support/locator-helpers'
import { label } from '../../../../support/i18n'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

const homeUrl = '/umsoknir/felagslegur-vidbotarstudningur'

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
    await expect(applicationPage).toBeApplication(
      'felagslegur-vidbotarstudningur',
    )
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Additional support for the elderly', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Agree to data providers', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              socialInsuranceAdministrationMessage.pre.externalDataSection,
            ),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()
        await page
          .getByRole('button', {
            name: label(
              socialInsuranceAdministrationMessage.pre.startApplication,
            ),
          })
          .click()
      })

      await applicationTest.step('Fill in applicant info', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              socialInsuranceAdministrationMessage.info.subSectionTitle,
            ),
          }),
        ).toBeVisible()

        const phoneNumber = page.getByRole('textbox', {
          name: label(
            socialInsuranceAdministrationMessage.info.applicantPhonenumber,
          ),
        })
        await phoneNumber.selectText()
        await phoneNumber.type('6555555')
        await proceed()
      })

      await applicationTest.step('Fill in payment information', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(socialInsuranceAdministrationMessage.payment.title),
          }),
        ).toBeVisible()
        // // TODO: Setja aftur inn? eða er í lagi að sleppa? (virkar ekki að senda inn umsókn ef breyti banka, skilar villu "An error occurred while saving bank information.")
        // const paymentBank = page.getByRole('textbox', {
        //   name: label(socialInsuranceAdministrationMessage.payment.bank),
        // })
        // await paymentBank.selectText()
        // await paymentBank.type('051226054678')

        await page
          .getByRole('region', {
            name: label(
              socialInsuranceAdministrationMessage.payment.personalAllowance,
            ),
          })
          .getByRole('radio', {
            name: label(socialInsuranceAdministrationMessage.shared.yes),
          })
          .click()

        const personalAllowance = page.getByTestId('personal-allowance-usage')
        await personalAllowance.selectText()
        await personalAllowance.type('100')

        await page
          .getByRole('region', {
            name: label(socialInsuranceAdministrationMessage.payment.taxLevel),
          })
          .getByRole('radio', {
            name: label(
              socialInsuranceAdministrationMessage.payment.taxIncomeLevel,
            ),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('Select period', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(socialInsuranceAdministrationMessage.period.title),
          }),
        ).toBeVisible()
        await page.getByTestId('select-period.year').click()
        await page.keyboard.press('Enter')

        // TODO: Þurfum að skoða þetta betur, getur komið upp að mánuður er ekki gildur
        await page.getByTestId('select-period.month').click()
        await page.keyboard.press('ArrowUp')
        await page.keyboard.press('Enter')
        await proceed()
      })

      await applicationTest.step(
        'Check that additional documents header is visible',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalFileTitle,
              ),
            }),
          ).toBeVisible()
          await proceed()
        },
      )

      await applicationTest.step('Write comment', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              socialInsuranceAdministrationMessage.additionalInfo
                .commentSection,
            ),
          }),
        ).toBeVisible()
        await page
          .getByPlaceholder(
            label(
              socialInsuranceAdministrationMessage.additionalInfo
                .commentPlaceholder,
            ),
          )
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
                socialInsuranceAdministrationMessage.confirm.overviewTitle,
              ),
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(
              socialInsuranceAdministrationMessage.confirm.submitButton,
            ),
          })
          .click()
      })

      await applicationTest.step(
        'Check that conclusion screen header is visible',
        async () => {
          await expect(
            page
              .getByRole('heading', {
                name: label(
                  socialInsuranceAdministrationMessage.conclusionScreen
                    .receivedAwaitingIncomePlanTitle,
                ),
              })
              .first(),
          ).toBeVisible()
        },
      )
    },
  )
})
