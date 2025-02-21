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
import { primarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  hasForeignLanguages,
  showPreferredLanguageFields,
} from '../../../lib/primarySchoolUtils'

export const languageSubSection = buildSubSection({
  id: 'languageSubSection',
  title: primarySchoolMessages.differentNeeds.languageSubSectionTitle,
  children: [
    buildMultiField({
      id: 'languages',
      title: primarySchoolMessages.differentNeeds.languageTitle,
      description: primarySchoolMessages.differentNeeds.languageDescription,
      children: [
        buildDescriptionField({
          id: 'languages.languageEnvironment.title',
          title: primarySchoolMessages.differentNeeds.languageSubTitle,
          titleVariant: 'h4',
          space: 0,
        }),
        buildCustomField(
          {
            id: 'languages.languageEnvironment',
            title:
              primarySchoolMessages.differentNeeds.languageEnvironmentTitle,
            component: 'FriggOptionsAsyncSelectField',
            dataTestId: 'languages-language-environment',
          },
          {
            optionsType: OptionsType.LANGUAGE_ENVIRONMENT,
            placeholder:
              primarySchoolMessages.differentNeeds
                .languageEnvironmentPlaceholder,
          },
        ),
        buildDescriptionField({
          id: 'languages.selectedLanguages.title',
          title: primarySchoolMessages.differentNeeds.languageSubSectionTitle,
          description:
            primarySchoolMessages.differentNeeds.languagesDescription,
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
            primarySchoolMessages.differentNeeds.addLanguageButton,
          removeItemButtonText:
            primarySchoolMessages.differentNeeds.removeLanguageButton,
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
                primarySchoolMessages.differentNeeds.languageSelectionTitle,
              placeholder:
                primarySchoolMessages.differentNeeds
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
          title: primarySchoolMessages.differentNeeds.preferredLanguageTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            return showPreferredLanguageFields(answers)
          },
        }),
        buildSelectField({
          id: 'languages.preferredLanguage',
          dataTestId: 'languages-preferred-language',
          title: primarySchoolMessages.differentNeeds.languageSubSectionTitle,
          placeholder:
            primarySchoolMessages.differentNeeds.languageSelectionPlaceholder,
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
          title: primarySchoolMessages.differentNeeds.signLanguage,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              dataTestId: 'sign-language',
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
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
          title: primarySchoolMessages.differentNeeds.interpreter,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              dataTestId: 'guardianRequiresInterpreter',
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              dataTestId: 'no-guardianRequiresInterpreter',
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
