import {
  buildCustomField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  YES,
  NO,
} from '@island.is/application/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { LanguageEnvironmentOptions, OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  hasForeignLanguages,
  showPreferredLanguageFields,
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
          id: 'languages.languageEnvironment.title',
          title: newPrimarySchoolMessages.differentNeeds.languageSubTitle,
          titleVariant: 'h4',
          space: 0,
        }),
        buildCustomField(
          {
            id: 'languages.languageEnvironment',
            title:
              newPrimarySchoolMessages.differentNeeds.languageEnvironmentTitle,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: OptionsType.LANGUAGE_ENVIRONMENT,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .languageEnvironmentPlaceholder,
          },
        ),
        buildDescriptionField({
          id: 'languages.selectedLanguages.title',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          description:
            newPrimarySchoolMessages.differentNeeds.languagesDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
        }),
        buildFieldsRepeaterField({
          id: 'languages.selectedLanguages',
          formTitleNumbering: 'none',
          addItemButtonText:
            newPrimarySchoolMessages.differentNeeds.addLanguageButton,
          removeItemButtonText:
            newPrimarySchoolMessages.differentNeeds.removeLanguageButton,
          minRows: (application) => {
            const { languageEnvironment } = getApplicationAnswers(
              application.answers,
            )

            return languageEnvironment ===
              LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
              ? 1
              : 2
          },
          maxRows: 4,
          marginTop: 0,
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
              options: (application) => {
                const { languageEnvironment } = getApplicationAnswers(
                  application.answers,
                )

                const languages = getAllLanguageCodes()
                return languages
                  .filter((language) => {
                    if (
                      language.code === 'is' &&
                      languageEnvironment ===
                        LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
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
          id: 'languages.preferredLanguage.title',
          title: newPrimarySchoolMessages.differentNeeds.preferredLanguageTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            return showPreferredLanguageFields(answers)
          },
        }),
        buildSelectField({
          id: 'languages.preferredLanguage',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          options: (application) => {
            const { selectedLanguages } = getApplicationAnswers(
              application.answers,
            )

            if (!selectedLanguages?.length) return []

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
            return showPreferredLanguageFields(answers)
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
          id: 'languages.guardianRequiresInterpreter',
          title: newPrimarySchoolMessages.differentNeeds.interpreter,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'guardian-requires-interpreter',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-guardian-requires-interpreter',
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
