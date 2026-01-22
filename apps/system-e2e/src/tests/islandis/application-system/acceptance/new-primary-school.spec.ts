import {
  applicationTypeMessages,
  childrenNGuardiansMessages,
  differentNeedsMessages,
  overviewMessages,
  prerequisitesMessages,
  primarySchoolMessages,
  sharedMessages,
} from '@island.is/application/templates/new-primary-school'
import { conclusionMessages } from '@island.is/application/ui-forms'
import { test as base, expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { label } from '../../../../support/i18n'
import { helpers } from '../../../../support/locator-helpers'
import { session } from '../../../../support/session'
import { setupXroadMocks } from './setup-xroad.mocks'

const homeUrl = '/umsoknir/grunnskoli'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019', // Gervimaður Afríka
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication('grunnskoli')
    await setupXroadMocks()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('New primary school', () => {
  applicationTest(
    'Should complete New primary school application successfully',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      page.goto(`${homeUrl}?delegationChecked=true`)

      await applicationTest.step('Agree to data providers', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(prerequisitesMessages.externalData.subSectionTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()
        await proceed()
      })

      await applicationTest.step('Select child', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(prerequisitesMessages.children.subSectionTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('child-0').click()
        await page
          .getByRole('button', {
            name: label(prerequisitesMessages.children.startApplication),
          })
          .click()
      })

      await applicationTest.step('Select application type', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(applicationTypeMessages.sectionTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('new-primary-school').click()
        await proceed()
      })

      await applicationTest.step(
        'Fill in information about child',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(childrenNGuardiansMessages.childInfo.subSectionTitle),
            }),
          ).toBeVisible()
          await page
            .getByRole('checkbox', {
              name: label(
                childrenNGuardiansMessages.childInfo.usePronounAndPreferredName,
              ),
            })
            .click()
          await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
          await page
            .getByRole('textbox', {
              name: label(childrenNGuardiansMessages.childInfo.preferredName),
            })
            .fill('Valið Nafn')
          await page.getByTestId('select-childInfo.pronouns').click()
          await page.keyboard.press('Enter')
          await page.keyboard.press('Enter')
          await page.getByTestId('select-childInfo.pronouns').click()
          await proceed()
        },
      )

      await applicationTest.step(
        'Fill in information about guardians',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(childrenNGuardiansMessages.guardians.subSectionTitle),
            }),
          ).toBeVisible()

          await page.getByTestId('email1').fill('guardian1@test.is')
          await page.getByTestId('phone1').fill('79999999')

          await page
            .getByRole('checkbox', {
              name: label(
                childrenNGuardiansMessages.guardians.requiresInterpreter,
              ),
            })
            .first()
            .click()
          await page
            .getByTestId('select-guardians[0].preferredLanguage')
            .click()
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('Enter')

          await page.getByTestId('email2').fill('guardian2@test.is')
          await page.getByTestId('phone2').fill('7888888')
          await proceed()
        },
      )

      await applicationTest.step("Register the child's relatives", async () => {
        await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
        await expect(
          page.getByRole('heading', {
            name: label(childrenNGuardiansMessages.relatives.title),
          }),
        ).toBeVisible()

        await page
          .getByRole('button', {
            name: label(childrenNGuardiansMessages.relatives.addRelative),
          })
          .click()
        await expect(
          page.getByText(
            label(childrenNGuardiansMessages.relatives.registrationTitle),
          ),
        ).toBeVisible()
        await page
          .getByLabel(label(sharedMessages.nationalId))
          .fill('0101302989')

        // Wait for non-empty name
        await expect(
          page.getByLabel(label(sharedMessages.fullName)),
        ).not.toBeEmpty()
        await expect(
          page.getByLabel(label(sharedMessages.fullName)),
        ).toHaveValue('Gervimaður Ameríka')

        await page.getByTestId('relative-phone-number').fill('799-99999')
        await page.getByTestId('relative-relation').click()
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        await page
          .getByRole('button', {
            name: label(childrenNGuardiansMessages.relatives.registerRelative),
          })
          .click()
        await proceed()
      })

      await applicationTest.step(
        'Check that information about current school header is visible',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(primarySchoolMessages.currentSchool.subSectionTitle),
            }),
          ).toBeVisible()
          await proceed()
        },
      )

      await applicationTest.step('Select New school', async () => {
        await verifyRequestCompletion(
          page,
          '/api/graphql',
          'FriggOrganizationsByType',
        )
        await expect(
          page.getByRole('heading', {
            name: label(primarySchoolMessages.newSchool.subSectionTitle),
          }),
        ).toBeVisible()

        await verifyRequestCompletion(
          page,
          '/api/graphql',
          'FriggOrganizationsByType',
        )
        await page.getByTestId('select-newSchool.school').click()
        await page.keyboard.press('Enter')
        await proceed()
      })

      await applicationTest.step('Select Reason for application', async () => {
        await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
        await expect(
          page.getByRole('heading', {
            name: label(
              primarySchoolMessages.reasonForApplication.subSectionTitle,
            ),
          }),
        ).toBeVisible()

        await page.getByTestId('select-reasonForApplication.reason').click()
        await page
          .getByRole('option', { name: 'Systkini í sama skóla' })
          .click()
        await proceed()
      })

      await applicationTest.step(
        'Register siblings in the same primary school',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(primarySchoolMessages.siblings.title),
            }),
          ).toBeVisible()

          await page
            .getByRole('button', {
              name: label(primarySchoolMessages.siblings.addSibling),
            })
            .click()

          await expect(
            page.getByText(
              label(primarySchoolMessages.siblings.registrationTitle),
            ),
          ).toBeVisible()

          await page
            .getByLabel(label(sharedMessages.nationalId))
            .fill('0101302719')

          // Wait for non-empty name
          await expect(
            page.getByLabel(label(sharedMessages.fullName)),
          ).not.toBeEmpty()
          await expect(
            page.getByLabel(label(sharedMessages.fullName)),
          ).toHaveValue('Gervimaður Evrópa')

          await page
            .getByRole('button', {
              name: label(primarySchoolMessages.siblings.registerSibling),
            })
            .click()
          await proceed()
        },
      )

      await applicationTest.step(
        'When do you wish the child to start in a new school?',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(primarySchoolMessages.startingSchool.title),
            }),
          ).toBeVisible()

          await page.getByTestId('datepicker').click()
          await page.getByRole('option', { name: 'choose' }).last().click()
          await proceed()
        },
      )

      await applicationTest.step("Select the child's languages", async () => {
        await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
        await expect(
          page.getByRole('heading', {
            name: label(differentNeedsMessages.language.title),
          }),
        ).toBeVisible()

        await page.getByTestId('select-languages.languageEnvironment').click()
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')

        await expect(
          page.locator('form').getByText(label(sharedMessages.language), {
            exact: true,
          }),
        ).toBeVisible()

        await page
          .getByTestId('select-languages.selectedLanguages[0].code')
          .click()
        await page.getByRole('option', { name: 'Íslenska' }).click()

        await page
          .getByTestId('select-languages.selectedLanguages[1].code')
          .click()
        await page.getByRole('option', { name: 'English' }).click()

        await page
          .getByRole('button', {
            name: label(differentNeedsMessages.language.addLanguage),
          })
          .click()
        await page
          .getByTestId('select-languages.selectedLanguages[2].code')
          .click()
        await page.getByRole('option', { name: 'Polski' }).click()

        await expect(
          page.getByText(
            label(differentNeedsMessages.language.preferredLanguageTitle),
          ),
        ).toBeVisible()

        await page.getByTestId('select-languages.preferredLanguage').click()
        await page.getByRole('option', { name: 'Íslenska' }).click()

        await page.getByTestId('sign-language').click()
        await proceed()
      })

      await applicationTest.step('Health protection', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              differentNeedsMessages.healthProtection.subSectionTitle,
            ),
          }),
        ).toBeVisible()

        await page
          .getByRole('checkbox', {
            name: label(
              differentNeedsMessages.healthProtection
                .hasFoodAllergiesOrIntolerances,
            ),
          })
          .click()
        await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
        await page
          .getByTestId('select-healthProtection.foodAllergiesOrIntolerances')
          .click()
        await page.keyboard.press('Enter')
        await page.keyboard.press('Enter')
        await page
          .getByTestId('select-healthProtection.foodAllergiesOrIntolerances')
          .click()

        await page
          .getByRole('checkbox', {
            name: label(
              differentNeedsMessages.healthProtection.hasOtherAllergies,
            ),
          })
          .click()
        await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
        await page.getByTestId('select-healthProtection.otherAllergies').click()
        await page.keyboard.press('Enter')
        await page.getByTestId('select-healthProtection.otherAllergies').click()

        await page.getByTestId('uses-epi-pen').click()
        await page.getByTestId('has-confirmed-medical-diagnoses').click()
        await page.getByTestId('requests-medication-administration').click()
        await proceed()
      })

      await applicationTest.step('Support', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(differentNeedsMessages.support.subSectionTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('has-diagnoses').click()
        await page.getByTestId('no-has-had-support').click()

        await page.getByTestId('has-welfare-contact').click()
        await page
          .getByRole('textbox', {
            name: label(differentNeedsMessages.support.welfareContactName),
          })
          .fill('Tengiliður Nafnsson')
        await page
          .getByRole('textbox', {
            name: label(differentNeedsMessages.support.welfareContactEmail),
          })
          .fill('tengilidur@test.is')

        await page.getByTestId('has-case-manager').click()
        await page
          .getByRole('textbox', {
            name: label(differentNeedsMessages.support.caseManagerName),
          })
          .fill('Málastjóri Nafnsson')
        await page
          .getByRole('textbox', {
            name: label(differentNeedsMessages.support.caseManagerEmail),
          })
          .fill('malastjori@test.is')

        await page.getByTestId('has-integrated-services').click()

        await page
          .getByRole('checkbox', {
            name: label(
              differentNeedsMessages.support.requestingMeetingDescription,
            ),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('Submit application', async () => {
        await expect(
          page.locator('form').getByText(label(overviewMessages.sectionTitle)),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(overviewMessages.submitButton),
          })
          .click()
      })

      await applicationTest.step(
        'Check that conclusion screen header is visible',
        async () => {
          await expect(
            page
              .getByRole('heading', {
                name: label(conclusionMessages.information.formTitle),
              })
              .first(),
          ).toBeVisible()
        },
      )
    },
  )
})
