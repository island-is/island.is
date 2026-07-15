import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { memmMessages } from '../../../lib/messages'
import { LanguageEnvironmentOptions } from '../../../utils/constants'
import {
  showLanguageSection,
  showPreferredLanguage,
} from '../../../utils/conditionUtils'
import { getApplicationAnswers } from '../../../utils/getApplicationAnswers'

export const cultureSubSection = buildSubSection({
  id: 'memmCultureSubSection',
  title: memmMessages.culture.subSectionTitle,
  children: [
    buildMultiField({
      id: 'memm.culture',
      title: memmMessages.shared.pageTitle,
      description: memmMessages.shared.pageDescription,
      children: [
        buildDescriptionField({
          id: 'memm.culture.heading',
          title: memmMessages.culture.subSectionTitle,
          description: memmMessages.culture.description,
          titleVariant: 'h3',
          space: 0,
        }),
        buildDescriptionField({
          id: 'memm.culture.languageUsageQuestion',
          title: memmMessages.culture.languageUsageQuestion,
          titleVariant: 'h5',
          space: 2,
        }),
        buildSelectField({
          id: 'memm.culture.languageUsage',
          title: memmMessages.culture.languageUsageLabel,
          placeholder: memmMessages.culture.languageUsagePlaceholder,
          doesNotRequireAnswer: true,
          options: [
            {
              value: LanguageEnvironmentOptions.ONLY_ICELANDIC,
              label: memmMessages.culture.languageUsageOnlyIcelandic,
            },
            {
              value: LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
              label: memmMessages.culture.languageUsageBoth,
            },
            {
              value: LanguageEnvironmentOptions.ONLY_OTHER,
              label: memmMessages.culture.languageUsageOnlyOther,
            },
          ],
        }),
        buildDescriptionField({
          id: 'memm.culture.languagesSectionTitle',
          title: memmMessages.culture.languagesSectionTitle,
          description: memmMessages.culture.languagesSectionDescription,
          titleVariant: 'h5',
          space: 2,
          condition: showLanguageSection,
        }),
        buildSelectField({
          id: 'memm.culture.languages',
          title: memmMessages.culture.languagesLabel,
          placeholder: memmMessages.culture.languagesPlaceholder,
          doesNotRequireAnswer: true,
          isMulti: true,
          clearOnChange: ['memm.culture.preferredLanguage'],
          options: ({ answers }) => {
            const selected =
              getApplicationAnswers(answers).memmCultureLanguages ?? []
            const atMax = selected.length >= 4
            return getAllLanguageCodes().map((l) => ({
              value: l.code,
              label: l.name,
              disabled: atMax && !selected.includes(l.code),
            }))
          },
          condition: showLanguageSection,
        }),
        buildDescriptionField({
          id: 'memm.culture.preferredLanguageQuestion',
          title: memmMessages.culture.preferredLanguageTitle,
          titleVariant: 'h5',
          space: 3,
          condition: showPreferredLanguage,
        }),
        buildSelectField({
          id: 'memm.culture.preferredLanguage',
          title: memmMessages.culture.preferredLanguageLabel,
          placeholder: memmMessages.culture.preferredLanguagePlaceholder,
          doesNotRequireAnswer: true,
          options: ({ answers }) => {
            const selectedCodes =
              getApplicationAnswers(answers).memmCultureLanguages ?? []
            return getAllLanguageCodes()
              .filter((l) => selectedCodes.includes(l.code))
              .map((l) => ({ value: l.code, label: l.name }))
          },
          condition: showPreferredLanguage,
        }),
        buildCheckboxField({
          id: 'memm.culture.needsInterpreter',
          spacing: 0,
          doesNotRequireAnswer: true,
          options: [
            {
              value: YES,
              label: memmMessages.culture.needsInterpreter,
            },
          ],
          condition: showPreferredLanguage,
        }),
      ],
    }),
  ],
})
