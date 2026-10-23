import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { memmMessages, sharedMessages } from '../../../../lib/messages'
import { getYesNoDoNotKnowOptions } from '../../../../utils/childProtectionNotificationUtils'
import {
  showDisabilityService,
  showLanguageSection,
  showPreferredLanguage,
} from '../../../../utils/conditionUtils'
import { getApplicationAnswers } from '../../../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../../../utils/getApplicationExternalData'
import { LanguageEnvironmentOptions } from '../../../../utils/constants'

export const cultureSubSection = buildSubSection({
  id: 'memmCultureSubSection',
  title: memmMessages.culture.subSectionTitle,
  children: [
    buildMultiField({
      id: 'memm.culture',
      title: memmMessages.shared.pageTitle,
      children: [
        buildDescriptionField({
          id: 'memm.culture.heading',
          title: memmMessages.culture.title,
          titleVariant: 'h3',
          space: 0,
        }),
        buildDescriptionField({
          id: 'memm.culture.languageUsageQuestion',
          title: memmMessages.culture.languageUsageQuestion,
          titleVariant: 'h5',
          space: 2,
        }),
        // TODO: Replace hardcoded options with values from barnaverndargatt API when available.
        buildSelectField({
          id: 'memm.culture.languageUsage',
          title: memmMessages.culture.languageUsageLabel,
          placeholder: memmMessages.culture.languageUsagePlaceholder,
          clearOnChange: ['memm.culture.languages'],
          clearOnChangeDefaultValue: [],
          options: [
            {
              value: LanguageEnvironmentOptions.ONLY_ICELANDIC,
              label: memmMessages.culture.languageUsageOnlyIcelandic,
            },
            {
              value: LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
              label: memmMessages.culture.languageUsageIcelandicAndOther,
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
          title: sharedMessages.language,
          placeholder: memmMessages.culture.languagesPlaceholder,
          isMulti: true,
          clearOnChange: ['memm.culture.preferredLanguage'],
          options: ({ answers }) => {
            const { memmCultureLanguages, memmCultureLanguageUsage } =
              getApplicationAnswers(answers)
            const selected = memmCultureLanguages ?? []
            const atMax = selected.length >= 4
            const isOnlyOther =
              memmCultureLanguageUsage === LanguageEnvironmentOptions.ONLY_OTHER
            return getAllLanguageCodes()
              .filter((l) => !isOnlyOther || l.code !== 'is')
              .map((l) => ({
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
          title: sharedMessages.language,
          placeholder: sharedMessages.languagePlaceholder,
          options: ({ answers }) => {
            const selectedCodes =
              getApplicationAnswers(answers).memmCultureLanguages ?? []
            return getAllLanguageCodes()
              .filter((l) => selectedCodes.includes(l.code))
              .map((l) => ({ value: l.code, label: l.name }))
          },
          condition: showPreferredLanguage,
        }),
        buildDescriptionField({
          id: 'memm.culture.disabilityLabel',
          title: memmMessages.culture.disabilityLabel,
          titleTooltip: memmMessages.culture.disabilityTooltip,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'memm.culture.disability',
          widthWithIllustration: '1/3',
          space: 0,
          options: getYesNoDoNotKnowOptions(),
        }),
        buildSelectField({
          id: 'memm.culture.disabilityService',
          title: memmMessages.culture.disabilityServiceLabel,
          placeholder: sharedMessages.chooseBestOptionPlaceholder,
          options: ({ externalData }) => {
            const { disabilityStatusOptions } =
              getApplicationExternalData(externalData)
            return disabilityStatusOptions.map((d) => ({
              value: d.value ?? '',
              label: d.label ?? '',
            }))
          },
          condition: showDisabilityService,
        }),
      ],
    }),
  ],
})
