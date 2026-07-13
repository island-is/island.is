import {
  NO,
  YES,
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { memmMessages, sharedMessages } from '../../lib/messages'
import {
  isDayCareProvider,
  isKnowsNationalId,
  isSchoolType,
  showDisabilityService,
  showLanguageSection,
  showPreferredLanguage,
  showWelfareContactFields,
  showWelfareManagerFields,
} from '../../utils/conditionUtils'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'

const FARSAELD_OPTIONS = [
  { value: YES, label: sharedMessages.radioYes },
  { value: NO, label: sharedMessages.radioNo },
  { value: 'doNotKnow', label: sharedMessages.radioDoNotKnow },
]

const memmPageFields = {
  title: memmMessages.shared.pageTitle,
  description: memmMessages.shared.pageDescription,
}

const MOTTAKA_OPTIONS = [
  { value: YES, label: sharedMessages.radioYes },
  { value: NO, label: sharedMessages.radioNo },
  { value: 'doNotKnow', label: memmMessages.reception.optionDoNotKnow },
  { value: 'notApplicable', label: memmMessages.reception.optionNotApplicable },
]

export const memmSection = buildSection({
  id: 'memmSection',
  title: memmMessages.shared.sectionTitle,
  condition: isKnowsNationalId,
  children: [
    buildSubSection({
      id: 'memmEducationSubSection',
      title: memmMessages.education.subSectionTitle,
      children: [
        buildMultiField({
          ...memmPageFields,
          id: 'memm.education',
          children: [
            buildDescriptionField({
              id: 'memm.education.heading',
              title: memmMessages.education.title,
              description: memmMessages.education.description,
              titleVariant: 'h4',
              space: 2,
            }),
            buildSelectField({
              id: 'memm.education.type',
              title: memmMessages.education.typeLabel,
              placeholder: memmMessages.education.typePlaceholder,
              doesNotRequireAnswer: true,
              // TODO: replace with school list dropdown from API when available
              options: [
                {
                  value: 'kindergarten',
                  label: memmMessages.education.typeKindergarten,
                },
                {
                  value: 'elementarySchool',
                  label: memmMessages.education.typeElementarySchool,
                },
                {
                  value: 'highSchool',
                  label: memmMessages.education.typeHighSchool,
                },
                {
                  value: 'daycareProvider',
                  label: memmMessages.education.typeDaycareProvider,
                },
              ],
            }),
            buildTextField({
              id: 'memm.education.schoolName',
              title: memmMessages.education.schoolName,
              doesNotRequireAnswer: true,
              condition: isSchoolType,
            }),
            buildTextField({
              id: 'memm.education.caregiverName',
              title: memmMessages.education.caregiverName,
              doesNotRequireAnswer: true,
              condition: isDayCareProvider,
            }),
          ],
        }),
      ],
    }),

    buildSubSection({
      id: 'memmReceptionSubSection',
      title: memmMessages.reception.subSectionTitle,
      children: [
        buildMultiField({
          ...memmPageFields,
          id: 'memm.reception',
          children: [
            buildDescriptionField({
              id: 'memm.reception.heading',
              title: memmMessages.reception.subSectionTitle,
              description: memmMessages.reception.description,
              titleVariant: 'h4',
              space: 2,
            }),
            buildDescriptionField({
              id: 'memm.reception.seekingAsylumLabel',
              title: memmMessages.reception.seekingAsylumLabel,
              titleTooltip: memmMessages.reception.seekingAsylumTooltip,
              titleVariant: 'h5',
              space: 3,
            }),
            buildRadioField({
              id: 'memm.reception.seekingAsylum',
              width: 'half',
              doesNotRequireAnswer: true,
              options: MOTTAKA_OPTIONS,
            }),
            buildDescriptionField({
              id: 'memm.reception.refugeeStatusLabel',
              title: memmMessages.reception.refugeeStatusLabel,
              titleTooltip: memmMessages.reception.refugeeStatusTooltip,
              titleVariant: 'h5',
              space: 3,
            }),
            buildRadioField({
              id: 'memm.reception.refugeeStatus',
              width: 'half',
              doesNotRequireAnswer: true,
              options: MOTTAKA_OPTIONS,
            }),
            buildAlertMessageField({
              id: 'memm.reception.fetchedDataInfo',
              alertType: 'info',
              message: memmMessages.reception.fetchedDataInfo,
              condition: (answers) =>
                !!getApplicationAnswers(answers).childName,
            }),
          ],
        }),
      ],
    }),

    buildSubSection({
      id: 'memmCultureSubSection',
      title: memmMessages.culture.subSectionTitle,
      children: [
        buildMultiField({
          ...memmPageFields,
          id: 'memm.culture',
          children: [
            buildDescriptionField({
              id: 'memm.culture.heading',
              title: memmMessages.culture.subSectionTitle,
              description: memmMessages.culture.description,
              titleVariant: 'h4',
              space: 2,
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
                  value: 'onlyIcelandic',
                  label: memmMessages.culture.languageUsageOnlyIcelandic,
                },
                {
                  value: 'icelandicAndOther',
                  label: memmMessages.culture.languageUsageBoth,
                },
                {
                  value: 'onlyOther',
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
    }),

    buildSubSection({
      id: 'memmWellbeingSubSection',
      title: memmMessages.wellbeing.subSectionTitle,
      children: [
        buildMultiField({
          ...memmPageFields,
          id: 'memm.wellbeing',
          children: [
            buildDescriptionField({
              id: 'memm.wellbeing.heading',
              title: memmMessages.wellbeing.subSectionTitle,
              description: memmMessages.wellbeing.description,
              titleVariant: 'h4',
              space: 2,
            }),
            buildDescriptionField({
              id: 'memm.wellbeing.integratedServiceLabel',
              title: memmMessages.wellbeing.integratedServiceLabel,
              titleTooltip: memmMessages.wellbeing.integratedServiceTooltip,
              titleVariant: 'h5',
              space: 3,
            }),
            buildRadioField({
              id: 'memm.wellbeing.integratedService',
              widthWithIllustration: '1/3',
              doesNotRequireAnswer: true,
              options: FARSAELD_OPTIONS,
            }),
            buildDescriptionField({
              id: 'memm.wellbeing.welfareContactLabel',
              title: memmMessages.wellbeing.welfareContactLabel,
              titleTooltip: memmMessages.wellbeing.welfareContactTooltip,
              titleVariant: 'h5',
              space: 3,
            }),
            buildRadioField({
              id: 'memm.wellbeing.welfareContact',
              widthWithIllustration: '1/3',
              doesNotRequireAnswer: true,
              options: FARSAELD_OPTIONS,
            }),
            buildTextField({
              id: 'memm.wellbeing.welfareContactEmail',
              title: memmMessages.wellbeing.welfareContactEmail,
              variant: 'email',
              doesNotRequireAnswer: true,
              condition: showWelfareContactFields,
            }),
            buildTextField({
              id: 'memm.wellbeing.welfareContactName',
              title: memmMessages.wellbeing.welfareContactName,
              doesNotRequireAnswer: true,
              condition: showWelfareContactFields,
            }),
            buildDescriptionField({
              id: 'memm.wellbeing.welfareManagerLabel',
              title: memmMessages.wellbeing.welfareManagerLabel,
              titleTooltip: memmMessages.wellbeing.welfareManagerTooltip,
              titleVariant: 'h5',
              space: 3,
            }),
            buildRadioField({
              id: 'memm.wellbeing.welfareManager',
              widthWithIllustration: '1/3',
              doesNotRequireAnswer: true,
              options: FARSAELD_OPTIONS,
            }),
            buildTextField({
              id: 'memm.wellbeing.welfareManagerEmail',
              title: memmMessages.wellbeing.welfareManagerEmail,
              variant: 'email',
              doesNotRequireAnswer: true,
              condition: showWelfareManagerFields,
            }),
            buildTextField({
              id: 'memm.wellbeing.welfareManagerName',
              title: memmMessages.wellbeing.welfareManagerName,
              doesNotRequireAnswer: true,
              condition: showWelfareManagerFields,
            }),
            buildDescriptionField({
              id: 'memm.wellbeing.disabilityLabel',
              title: memmMessages.wellbeing.disabilityLabel,
              titleTooltip: memmMessages.wellbeing.disabilityTooltip,
              titleVariant: 'h5',
              space: 3,
            }),
            buildRadioField({
              id: 'memm.wellbeing.disability',
              widthWithIllustration: '1/3',
              doesNotRequireAnswer: true,
              options: FARSAELD_OPTIONS,
            }),
            buildSelectField({
              id: 'memm.wellbeing.disabilityService',
              title: memmMessages.wellbeing.disabilityServiceLabel,
              placeholder: memmMessages.wellbeing.disabilityServicePlaceholder,
              doesNotRequireAnswer: true,
              options: [
                {
                  value: 'municipal',
                  label: memmMessages.wellbeing.disabilityServiceMunicipal,
                },
                {
                  value: 'sports',
                  label: memmMessages.wellbeing.disabilityServiceSports,
                },
                {
                  value: 'health',
                  label: memmMessages.wellbeing.disabilityServiceHealth,
                },
                {
                  value: 'emergency',
                  label: memmMessages.wellbeing.disabilityServiceEmergency,
                },
              ],
              condition: showDisabilityService,
            }),
          ],
        }),
      ],
    }),
  ],
})
