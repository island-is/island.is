import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { memmMessages } from '../../../../lib/messages'
import { getYesNoDoNotKnowOptions } from '../../../../utils/childProtectionNotificationUtils'
import {
  showDisabilityService,
  showWellbeingContactFields,
  showWellbeingManagerFields,
} from '../../../../utils/conditionUtils'
import { getApplicationExternalData } from '../../../../utils/getApplicationExternalData'

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
          titleVariant: 'h3',
          space: 0,
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
          space: 0,
          options: getYesNoDoNotKnowOptions(),
        }),
        buildDescriptionField({
          id: 'memm.wellbeing.wellbeingContactLabel',
          title: memmMessages.wellbeing.wellbeingContactLabel,
          titleTooltip: memmMessages.wellbeing.wellbeingContactTooltip,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'memm.wellbeing.wellbeingContact',
          widthWithIllustration: '1/3',
          space: 0,
          options: getYesNoDoNotKnowOptions(),
        }),
        buildTextField({
          id: 'memm.wellbeing.wellbeingContactEmail',
          title: memmMessages.wellbeing.wellbeingContactEmail,
          variant: 'email',
          condition: showWellbeingContactFields,
        }),
        buildTextField({
          id: 'memm.wellbeing.wellbeingContactName',
          title: memmMessages.wellbeing.wellbeingContactName,
          condition: showWellbeingContactFields,
        }),
        buildDescriptionField({
          id: 'memm.wellbeing.wellbeingManagerLabel',
          title: memmMessages.wellbeing.wellbeingManagerLabel,
          titleTooltip: memmMessages.wellbeing.wellbeingManagerTooltip,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'memm.wellbeing.wellbeingManager',
          widthWithIllustration: '1/3',
          space: 0,
          options: getYesNoDoNotKnowOptions(),
        }),
        buildTextField({
          id: 'memm.wellbeing.wellbeingManagerEmail',
          title: memmMessages.wellbeing.wellbeingManagerEmail,
          variant: 'email',
          condition: showWellbeingManagerFields,
        }),
        buildTextField({
          id: 'memm.wellbeing.wellbeingManagerName',
          title: memmMessages.wellbeing.wellbeingManagerName,
          condition: showWellbeingManagerFields,
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
          space: 0,
          options: getYesNoDoNotKnowOptions(),
        }),
        buildSelectField({
          id: 'memm.wellbeing.disabilityService',
          title: memmMessages.wellbeing.disabilityServiceLabel,
          placeholder: memmMessages.wellbeing.disabilityServicePlaceholder,
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
