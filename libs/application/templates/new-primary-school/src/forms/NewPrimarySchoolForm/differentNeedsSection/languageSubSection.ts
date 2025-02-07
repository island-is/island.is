import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { Application, NO, YES } from '@island.is/application/types'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { LanguageEnvironmentOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getLanguageEnvironments,
  hasForeignLanguages,
  showChildLangagueFields,
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
          marginTop: 'gutter',
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
        }),
        buildFieldsRepeaterField({
          id: 'languages.selectedLanguages',
          title: '',
          formTitleNumbering: 'none',
          addItemButtonText:
            newPrimarySchoolMessages.differentNeeds.addLanguageButton,
          removeItemButtonText:
            newPrimarySchoolMessages.differentNeeds.removeLanguageButton,
          minRows: 1,
          maxRows: 4,
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
        buildDescriptionField({
          id: 'languages.child.language.title',
          title: newPrimarySchoolMessages.differentNeeds.childLanguageTitle,
          titleVariant: 'h4',
          marginTop: 'gutter',
          condition: (answers) => {
            return showChildLangagueFields(answers)
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
            const { selectedLanguages } = getApplicationAnswers(
              application.answers,
            )

            return getAllLanguageCodes()
              .filter((language) => {
                return selectedLanguages.some(
                  (lang) => lang?.code === language.code,
                )
              })
              .map((language) => {
                return {
                  label: language.name,
                  value: language.code,
                }
              })
          },
          condition: (answers) => {
            return showChildLangagueFields(answers)
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
