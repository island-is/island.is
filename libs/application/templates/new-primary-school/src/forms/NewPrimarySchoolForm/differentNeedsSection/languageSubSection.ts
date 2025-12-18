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
import { differentNeedsMessages, sharedMessages } from '../../../lib/messages'
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
  title: sharedMessages.language,
  children: [
    buildMultiField({
      id: 'languages',
      title: differentNeedsMessages.language.title,
      description: differentNeedsMessages.language.description,
      children: [
        buildDescriptionField({
          id: 'languages.languageEnvironment.title',
          title: differentNeedsMessages.language.languageEnvironmentTitle,
          titleVariant: 'h4',
          space: 0,
        }),
        buildCustomField(
          {
            id: 'languages.languageEnvironment',
            title: differentNeedsMessages.language.languageEnvironment,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: OptionsType.LANGUAGE_ENVIRONMENT,
            placeholder:
              differentNeedsMessages.language.languageEnvironmentPlaceholder,
            useIdAndKey: true,
          },
        ),
        buildDescriptionField({
          id: 'languages.selectedLanguages.title',
          title: sharedMessages.language,
          description:
            differentNeedsMessages.language.selectedLanguagesDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => hasForeignLanguages(answers),
        }),
        buildFieldsRepeaterField({
          id: 'languages.selectedLanguages',
          formTitleNumbering: 'none',
          addItemButtonText: differentNeedsMessages.language.addLanguage,
          removeItemButtonText: differentNeedsMessages.language.removeLanguage,
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
                ...differentNeedsMessages.language.languageSelectionTitle,
                values: { index: index + 1 },
              }),
              placeholder: sharedMessages.languagePlaceholder,
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
          title: differentNeedsMessages.language.preferredLanguageTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => showPreferredLanguageFields(answers),
        }),
        buildSelectField({
          id: 'languages.preferredLanguage',
          title: sharedMessages.language,
          placeholder: sharedMessages.languagePlaceholder,
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
          title: differentNeedsMessages.language.signLanguage,
          width: 'half',
          required: true,
          space: 4,
          defaultValue: NO,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'sign-language',
              value: YES,
            },
            {
              label: sharedMessages.no,
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
