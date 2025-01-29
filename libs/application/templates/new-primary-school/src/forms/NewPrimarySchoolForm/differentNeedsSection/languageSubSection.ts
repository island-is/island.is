import {
  buildCustomField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { Application, NO, YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getLanguageEnvironments,
  hasForeignLanguages,
} from '../../../lib/newPrimarySchoolUtils'
import { LanguageSelectionProps } from '../../../fields/LanguageSelection'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { LanguageEnvironmentOptions } from '../../../lib/constants'

export const languageSubSection = buildSubSection({
  id: 'languageSubSection',
  title: newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
  children: [
    buildMultiField({
      id: 'languages',
      title: newPrimarySchoolMessages.differentNeeds.languageTitle,
      description: newPrimarySchoolMessages.differentNeeds.languageDescription,
      children: [
        buildDescriptionField({
          id: 'languages.sub.title',
          title: newPrimarySchoolMessages.differentNeeds.languageSubTitle,
          titleVariant: 'h4',
        }),
        buildSelectField({
          id: 'languages.languageEnvironment',
          dataTestId: 'languages-language-environment',
          title:
            newPrimarySchoolMessages.differentNeeds.languageEnvironmentTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageEnvironmentPlaceholder,
          options: () => {
            return getLanguageEnvironments()
          },
        }),
        buildDescriptionField({
          id: 'languages.languages.title',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          description:
            newPrimarySchoolMessages.differentNeeds.languagesDescription,
          titleVariant: 'h4',
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
          marginBottom: 'gutter',
        }),
        buildFieldsRepeaterField({
          id: 'languages.selectedLanguages',
          title: '',
          formTitleNumbering: 'none',
          addItemButtonText:
            newPrimarySchoolMessages.differentNeeds.addLanguageButton,
          removeItemButtonText: 'remove button',
          minRows: 1,
          maxRows: 4,
          marginTop: 'auto',
          marginBottom: 'auto',
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
          fields: {
            code: {
              component: 'select',
              label:
                newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
              placeholder:
                newPrimarySchoolMessages.differentNeeds
                  .languageSelectionPlaceholder,
              width: 'full',
              /*  updateValueObj: {
                valueModifier: (application, activeField) => {
                  console.log('activeField', activeField)
                  return null
                },
                watchValues: 'incomeCategory',
              }, */
              options: (application: Application) => {
                const { languageEnvironment } = getApplicationAnswers(
                  application.answers,
                )

                const languages = getAllLanguageCodes()
                return languages
                  .filter((language) => {
                    if (
                      language.code === 'is' &&
                      languageEnvironment ===
                        LanguageEnvironmentOptions.ONLY_FOREIGN
                    ) {
                      return false
                    }
                    return true
                  })
                  .map((language) => ({
                    label: language.name,
                    value: language.code,
                  }))
              },
            },
          },
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on options in the select above
          id: 'languages.language1HiddenInput',
          watchValue: 'languages.selectedLanguages[0].code',
        }),
        buildDescriptionField({
          id: 'languages.child.language.title',
          title: newPrimarySchoolMessages.differentNeeds.childLanguageTitle,
          titleVariant: 'h4',
          condition: (answers) => {
            const { language1, language2 } = getApplicationAnswers(answers)
            return hasForeignLanguages(answers) && !!language1 && !!language2
          },
        }),
        buildSelectField({
          id: 'languages.childLanguage',
          dataTestId: 'languages-child-language',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,

          options: (application) => {
            const {
              languages,
              language1,
              language2,
              language3,
              language4,
              language1HiddenInput,
            } = getApplicationAnswers(application.answers)

            console.log('languageSEL', {
              languages,
              language1,
              language1HiddenInput,
            })

            const allLanguages = getAllLanguageCodes()
            const selectedLanguages = allLanguages.filter((language) => {
              return (
                language.code === language1 ||
                language.code === language2 ||
                language.code === language3 ||
                language.code === language4
              )
            })

            return selectedLanguages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
        }),
        buildRadioField({
          id: 'languages.signLanguage',
          title: newPrimarySchoolMessages.differentNeeds.signLanguage,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'sign-language',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-sign-language',
              value: NO,
            },
          ],
          condition: (answers) => {
            const { languageEnvironment } = getApplicationAnswers(answers)
            return !!languageEnvironment
          },
        }),
        buildRadioField({
          id: 'languages.interpreter',
          title: newPrimarySchoolMessages.differentNeeds.interpreter,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'interpreter',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-interpreter',
              value: NO,
            },
          ],
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
        }),
      ],
    }),
  ],
})
