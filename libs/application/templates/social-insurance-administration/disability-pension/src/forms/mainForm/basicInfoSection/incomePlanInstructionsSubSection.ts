import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const incomePlanInstructionsSubSection = buildSubSection({
  id: SectionRouteEnum.INCOME_PLAN_INSTRUCTION,
  title: disabilityPensionFormMessage.basicInfo.incomePlanInstructionsTitle,
  children: [
    buildMultiField({
      id: SectionRouteEnum.INCOME_PLAN_INSTRUCTION,
      title: disabilityPensionFormMessage.incomePlan.instructionsTitle,
      description:
        disabilityPensionFormMessage.incomePlan.instructionsDescription,
      space: 'gutter',
      children: [
        buildDescriptionField({
          id: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.bullets`,
          description:
            disabilityPensionFormMessage.incomePlan.instructionsBullets,
        }),
        buildDescriptionField({
          id: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.link`,
          description: disabilityPensionFormMessage.incomePlan.instructionsLink,
        }),
      ],
    }),
  ],
})
