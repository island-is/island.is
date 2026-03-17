import {
  buildDescriptionField,
  buildSubSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const incomePlanInstructionsSubSection = buildSubSection({
  id: 'incomePlanInstructionsSubSection',
  title:
    socialInsuranceAdministrationMessage.incomePlan
      .incomePlanInstructionsSubSectionTitle,
  children: [
    buildDescriptionField({
      id: 'instructions',
      title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
      description:
        socialInsuranceAdministrationMessage.incomePlanInstructions
          .descriptionInstructions,
    }),
  ],
})
