import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { shouldShowIncomePlan } from '../../../utils/conditionUtils'

export const incomePlanInstructionsSubSection = buildSubSection({
  id: 'incomePlanInstructionsSubSection',
  condition: (answers) => shouldShowIncomePlan(answers),
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
