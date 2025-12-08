import { newPrimarySchoolMessages } from '@island.is/application/templates/new-primary-school'
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
            name: label(newPrimarySchoolMessages.pre.externalDataSubSection),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()
        await proceed()
      })

      await applicationTest.step('Select child', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(newPrimarySchoolMessages.pre.childrenSubSectionTitle),
          }),
        ).toBeVisible()
        await page.getByTestId('child-0').click()
        await page
          .getByRole('button', {
            name: label(newPrimarySchoolMessages.pre.startApplication),
          })
          .click()
      })

      await applicationTest.step('Select application type', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(newPrimarySchoolMessages.applicationType.sectionTitle),
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
              name: label(
                newPrimarySchoolMessages.childrenNGuardians
                  .childInfoSubSectionTitle,
              ),
            }),
          ).toBeVisible()
          await page
            .getByRole('checkbox', {
              name: label(
                newPrimarySchoolMessages.childrenNGuardians
                  .usePronounAndPreferredName,
              ),
            })
            .click()
          await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
          await page
            .getByRole('textbox', {
              name: label(
                newPrimarySchoolMessages.childrenNGuardians
                  .childInfoPreferredName,
              ),
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
              name: label(
                newPrimarySchoolMessages.childrenNGuardians
                  .guardiansSubSectionTitle,
              ),
            }),
          ).toBeVisible()

          await expect(
            page.getByText(
              label(newPrimarySchoolMessages.childrenNGuardians.guardian),
            ),
          ).toBeVisible()
          await page.getByTestId('email1').fill('guardian1@test.is')
          await page.getByTestId('phone1').fill('79999999')

          await page
            .getByRole('checkbox', {
              name: label(
                newPrimarySchoolMessages.childrenNGuardians.requiresInterpreter,
              ),
            })
            .first()
            .click()
          await page
            .getByTestId('select-guardians[0].preferredLanguage')
            .click()
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('Enter')

          await expect(
            page.getByText(
              label(newPrimarySchoolMessages.childrenNGuardians.otherGuardian),
            ),
          ).toBeVisible()
          await page.getByTestId('email2').fill('guardian2@test.is')
          await page.getByTestId('phone2').fill('7888888')
          await proceed()
        },
      )

      await applicationTest.step("Register the child's relatives", async () => {
        await verifyRequestCompletion(page, '/api/graphql', 'FriggOptions')
        await expect(
          page.getByRole('heading', {
            name: label(
              newPrimarySchoolMessages.childrenNGuardians.relativesTitle,
            ),
          }),
        ).toBeVisible()

        await page
          .getByRole('button', {
            name: label(
              newPrimarySchoolMessages.childrenNGuardians.relativesAddRelative,
            ),
          })
          .click()
        await expect(
          page.getByText(
            label(
              newPrimarySchoolMessages.childrenNGuardians
                .relativesRegistrationTitle,
            ),
          ),
        ).toBeVisible()
        await page
          .getByLabel(label(newPrimarySchoolMessages.shared.nationalId))
          .fill('0101302989')

        // Wait for non-empty name
        await expect(
          page.getByLabel(label(newPrimarySchoolMessages.shared.fullName)),
        ).not.toBeEmpty()
        await expect(
          page.getByLabel(label(newPrimarySchoolMessages.shared.fullName)),
        ).toHaveValue('Gervimaður Ameríka')

        await page.getByTestId('relative-phone-number').fill('799-99999')
        await page.getByTestId('relative-relation').click()
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        await page
          .getByRole('button', {
            name: label(
              newPrimarySchoolMessages.childrenNGuardians
                .relativesRegisterRelative,
            ),
          })
          .click()
        await proceed()
      })

      await applicationTest.step(
        'Check that information about current school header is visible',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                newPrimarySchoolMessages.primarySchool
                  .currentSchoolSubSectionTitle,
              ),
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
            name: label(
              newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
            ),
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
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationSubSectionTitle,
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
              name: label(newPrimarySchoolMessages.primarySchool.siblingsTitle),
            }),
          ).toBeVisible()

          await page
            .getByRole('button', {
              name: label(
                newPrimarySchoolMessages.primarySchool.siblingsAddRelative,
              ),
            })
            .click()

          await expect(
            page.getByText(
              label(
                newPrimarySchoolMessages.primarySchool
                  .siblingsRegistrationTitle,
              ),
            ),
          ).toBeVisible()

          await page
            .getByLabel(label(newPrimarySchoolMessages.shared.nationalId))
            .fill('0101302719')

          // Wait for non-empty name
          await expect(
            page.getByLabel(label(newPrimarySchoolMessages.shared.fullName)),
          ).not.toBeEmpty()
          await expect(
            page.getByLabel(label(newPrimarySchoolMessages.shared.fullName)),
          ).toHaveValue('Gervimaður Evrópa')

          await page
            .getByRole('button', {
              name: label(
                newPrimarySchoolMessages.primarySchool.siblingsRegisterRelative,
              ),
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
              name: label(
                newPrimarySchoolMessages.primarySchool.startingSchoolTitle,
              ),
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
            name: label(newPrimarySchoolMessages.differentNeeds.languageTitle),
          }),
        ).toBeVisible()

        await page.getByTestId('select-languages.languageEnvironment').click()
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')

        await expect(
          page
            .locator('form')
            .getByText(label(newPrimarySchoolMessages.shared.language), {
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
            name: label(
              newPrimarySchoolMessages.differentNeeds.addLanguageButton,
            ),
          })
          .click()
        await page
          .getByTestId('select-languages.selectedLanguages[2].code')
          .click()
        await page.getByRole('option', { name: 'Polski' }).click()

        await expect(
          page.getByText(
            label(
              newPrimarySchoolMessages.differentNeeds.preferredLanguageTitle,
            ),
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
              newPrimarySchoolMessages.differentNeeds
                .healthProtectionSubSectionTitle,
            ),
          }),
        ).toBeVisible()

        await page
          .getByRole('checkbox', {
            name: label(
              newPrimarySchoolMessages.differentNeeds
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
              newPrimarySchoolMessages.differentNeeds.hasOtherAllergies,
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
            name: label(
              newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
            ),
          }),
        ).toBeVisible()
        await page.getByTestId('has-diagnoses').click()
        await page.getByTestId('no-has-had-support').click()

        await page.getByTestId('has-welfare-contact').click()
        await page
          .getByRole('textbox', {
            name: label(
              newPrimarySchoolMessages.differentNeeds.welfareContactName,
            ),
          })
          .fill('Tengiliður Nafnsson')
        await page
          .getByRole('textbox', {
            name: label(
              newPrimarySchoolMessages.differentNeeds.welfareContactEmail,
            ),
          })
          .fill('tengilidur@test.is')

        await page.getByTestId('has-case-manager').click()
        await page
          .getByRole('textbox', {
            name: label(
              newPrimarySchoolMessages.differentNeeds.caseManagerName,
            ),
          })
          .fill('Málastjóri Nafnsson')
        await page
          .getByRole('textbox', {
            name: label(
              newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
            ),
          })
          .fill('malastjori@test.is')

        await page.getByTestId('has-integrated-services').click()

        await page
          .getByRole('checkbox', {
            name: label(
              newPrimarySchoolMessages.differentNeeds
                .requestingMeetingDescription,
            ),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('Submit application', async () => {
        await expect(
          page
            .locator('form')
            .getByText(label(newPrimarySchoolMessages.overview.sectionTitle)),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(newPrimarySchoolMessages.overview.submitButton),
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
