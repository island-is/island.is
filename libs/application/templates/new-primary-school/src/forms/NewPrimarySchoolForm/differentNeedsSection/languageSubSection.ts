import {
  buildCustomField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  hasForeignLanguages,
  showPreferredLanguageFields,
} from '../../../utils/conditionUtils'
import {
  LanguageEnvironmentOptions,
  OptionsType,
} from '../../../utils/constants'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'

export const languageSubSection = buildSubSection({
  id: 'languageSubSection',
  title: newPrimarySchoolMessages.shared.language,
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
            useIdAndKey: true,
          },
        ),
        buildDescriptionField({
          id: 'languages.selectedLanguages.title',
          title: newPrimarySchoolMessages.shared.language,
          description:
            newPrimarySchoolMessages.differentNeeds.languagesDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => hasForeignLanguages(answers),
        }),
        buildFieldsRepeaterField({
          id: 'languages.selectedLanguages',
          formTitleNumbering: 'none',
          addItemButtonText:
            newPrimarySchoolMessages.differentNeeds.addLanguageButton,
          removeItemButtonText:
            newPrimarySchoolMessages.differentNeeds.removeLanguageButton,
          minRows: (answers) => {
            const { languageEnvironment } = getApplicationAnswers(answers)

            return languageEnvironment ===
              LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
              ? 1
              : 2
          },
          maxRows: 4,
          marginTop: 0,
          condition: (answers) => hasForeignLanguages(answers),
          fields: {
            code: {
              component: 'select',
              label: (index) => ({
                ...newPrimarySchoolMessages.differentNeeds
                  .languageSelectionTitle,
                values: { index: index + 1 },
              }),
              placeholder: newPrimarySchoolMessages.shared.languagePlaceholder,
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
          condition: (answers) => showPreferredLanguageFields(answers),
        }),
        buildSelectField({
          id: 'languages.preferredLanguage',
          title: newPrimarySchoolMessages.shared.language,
          placeholder: newPrimarySchoolMessages.shared.languagePlaceholder,
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
          condition: (answers) => showPreferredLanguageFields(answers),
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
      ],
    }),
  ],
})
