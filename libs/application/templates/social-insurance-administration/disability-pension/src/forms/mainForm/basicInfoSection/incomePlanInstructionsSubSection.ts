import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { FormTextWithLocale } from '@island.is/application/types'

const bullets = [
  'bulletOne',
  'bulletTwo',
  'bulletThree',
  'bulletFour',
  'bulletFive',
  'bulletSix',
] as const;

const bulletMessage: Record<(typeof bullets)[number], FormTextWithLocale> = {
  bulletOne: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.instructionsDescription`,
  bulletTwo: disabilityPensionFormMessage.incomePlan.instructionBullet1,
  bulletThree: disabilityPensionFormMessage.incomePlan.instructionBullet2,
  bulletFour: disabilityPensionFormMessage.incomePlan.instructionBullet3,
  bulletFive: disabilityPensionFormMessage.incomePlan.instructionBullet4,
  bulletSix: disabilityPensionFormMessage.incomePlan.instructionBullet5,
}

export const incomePlanInstructionsSubSection =
    buildSubSection({
      id: SectionRouteEnum.INCOME_PLAN_INSTRUCTION,
      tabTitle: disabilityPensionFormMessage.basicInfo.incomePlanInstructionsTitle,
      title: disabilityPensionFormMessage.basicInfo.incomePlanInstructionsTitle,
      children: [
        buildMultiField({
          id: SectionRouteEnum.INCOME_PLAN_INSTRUCTION,
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.incomePlan.instructionsTitle,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildDescriptionField({
              id: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.instructionsDescription`,
              description: disabilityPensionFormMessage.incomePlan.instructionsDescription,
              marginBottom: 'p4',
            }),
            ...bullets.map(bullet => {
              return buildDescriptionField({
                id: `${SectionRouteEnum.INCOME_PLAN_INSTRUCTION}.${bullet}`,
                description: bulletMessage[bullet]
              });
            })
          ],
        }),
      ],
    })
