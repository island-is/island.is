import {
  NO,
  YES,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { memmMessages, sharedMessages } from '../../../lib/messages'
import {
  showDisabilityService,
  showWelfareContactFields,
  showWelfareManagerFields,
} from '../../../utils/conditionUtils'

const FARSAELD_OPTIONS = [
  { value: YES, label: sharedMessages.radioYes },
  { value: NO, label: sharedMessages.radioNo },
  { value: 'doNotKnow', label: sharedMessages.radioDoNotKnow },
]

export const wellbeingSubSection = buildSubSection({
  id: 'memmWellbeingSubSection',
  title: memmMessages.wellbeing.subSectionTitle,
  children: [
    buildMultiField({
      id: 'memm.wellbeing',
      title: memmMessages.shared.pageTitle,
      description: memmMessages.shared.pageDescription,
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
})
