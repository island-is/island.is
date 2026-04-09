import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const incomePlanInstructionsSubSection = buildSubSection({
  id: 'incomePlanInstructionsSubSection',
  title:
    socialInsuranceAdministrationMessage.incomePlan
      .incomePlanInstructionsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'incomePlanInstructions',
      title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
      children: [
        buildDescriptionField({
          id: 'instructions',
          title: '',
          description:
            socialInsuranceAdministrationMessage.incomePlanInstructions
              .descriptionInstructions,
        }),
      ],
    }),
  ],
})
