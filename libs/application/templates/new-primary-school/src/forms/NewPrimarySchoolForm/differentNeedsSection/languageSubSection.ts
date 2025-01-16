import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getLanguageEnvironments,
  hasOtherLanguages,
} from '../../../lib/newPrimarySchoolUtils'

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
          id: 'languages.nativeLanguage.title',
          title: newPrimarySchoolMessages.differentNeeds.childNativeLanguage,
          titleVariant: 'h4',
        }),
        buildDescriptionField({
          id: 'languages.nativeLanguage.title',
          title: 'newPrimarySchoolMessages.differentNeeds.childNativeLanguage',
          titleVariant: 'h4',
        }),
        buildSelectField({
          id: 'languages.languageEnvironment',
          dataTestId: 'languages-language-environment',
          title: newPrimarySchoolMessages.differentNeeds.languageEnvTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds.languageEnvPlaceholder,
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
            return hasOtherLanguages(answers)
          },
        }),
        buildSelectField({
          id: 'languages.language1',
          dataTestId: 'languages-language1',
          title: {
            ...newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            values: {
              no: '1',
            },
          },
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          isMulti: false,
          options: () => {
            const languages = getAllLanguageCodes()
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
          condition: (answers) => {
            return hasOtherLanguages(answers)
          },
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on options in the select above
          id: 'languages.hiddenLanguage1Input',
          watchValue: 'languages.language1',
        }),
        buildSelectField({
          id: 'languages.language2',
          dataTestId: 'languages-language2',
          title: {
            ...newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            values: {
              no: '2',
            },
          },
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,

          options: () => {
            const languages = getAllLanguageCodes()
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
          isMulti: false,
          disabled: true,
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on options in the select above
          id: 'languages.hiddenLanguage2Input',
          watchValue: 'languages.language2',
        }),
        buildSelectField({
          id: 'languages.language3',
          dataTestId: 'languages-language3',
          title: {
            ...newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            values: {
              no: '3',
            },
          },
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          options: () => {
            const languages = getAllLanguageCodes()
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
          isMulti: false,
          condition: (answers) => {
            const { language2 } = getApplicationAnswers(answers)
            return hasOtherLanguages(answers) && !!language2
          },
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on options in the select above
          id: 'languages.hiddenLanguage3Input',
          watchValue: 'languages.language3',
        }),
        buildSelectField({
          id: 'languages.language4',
          dataTestId: 'languages-language4',
          title: {
            ...newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            values: {
              no: '4',
            },
          },
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          options: () => {
            const languages = getAllLanguageCodes()
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
          isMulti: false,
          condition: (answers) => {
            const { language3 } = getApplicationAnswers(answers)
            return hasOtherLanguages(answers) && !!language3
          },
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on options in the select above
          id: 'languages.hiddenLanguage4Input',
          watchValue: 'languages.language4',
        }),
        buildDescriptionField({
          id: 'languages.child.language.title',
          title: newPrimarySchoolMessages.differentNeeds.childLanguageTitle,
          titleVariant: 'h4',
          condition: (answers) => {
            const { language1, language2 } = getApplicationAnswers(answers)
            return hasOtherLanguages(answers) && !!language1 && !!language2
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
            const { language1, language2, language3, language4 } =
              getApplicationAnswers(application.answers)

            const languages = getAllLanguageCodes()
            const selectedLanguages = languages.filter((language) => {
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
          isMulti: false,
          condition: (answers) => {
            const {
              language1,
              language2,
              language3,
              language4,
              language1HiddenInput,
              language2HiddenInput,
              language3HiddenInput,
              language4HiddenInput,
            } = getApplicationAnswers(answers)

            return (
              hasOtherLanguages(answers) &&
              !!language1 &&
              !!language2 &&
              language1 === language1HiddenInput &&
              language2 === language2HiddenInput &&
              language3 === language3HiddenInput &&
              language4 === language4HiddenInput
            )
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
            return hasOtherLanguages(answers)
          },
        }),
      ],
    }),
  ],
})
