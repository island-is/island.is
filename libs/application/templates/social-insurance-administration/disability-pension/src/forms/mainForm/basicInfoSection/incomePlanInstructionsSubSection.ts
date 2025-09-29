import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { SectionRouteEnum } from '../../../types/routes'
import * as m from '../../../lib/messages'

export const incomePlanInstructionsSubSection = buildSubSection({
  id: SectionRouteEnum.INCOME_PLAN_INSTRUCTION,
  title: m.basicInfo.incomePlanInstructionsTitle,
  children: [
    buildMultiField({
      id: SectionRouteEnum.INCOME_PLAN_INSTRUCTION,
      title: m.incomePlan.instructionsTitle,
      description: m.incomePlan.instructionsDescription,
      space: 'gutter',
      children: [
        buildDescriptionField({
          id: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.bullets`,
          description: m.incomePlan.instructionsBullets,
        }),
        buildDescriptionField({
          id: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.link`,
          description: m.incomePlan.instructionsLink,
        }),
      ],
    }),
  ],
})
