import {
  buildDescriptionField,
  buildSubSection,
  buildMultiField,
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
      description:
        socialInsuranceAdministrationMessage.incomePlanInstructions.title,
      children: [
        buildDescriptionField({
          id: 'instructions',
          description:
            socialInsuranceAdministrationMessage.incomePlanInstructions
              .instructions,
          space: 0,
        }),
      ],
    }),
  ],
})
