import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'

const incomePlanInstructionsRoute = 'incomePlanInstruction'

export const incomePlanInstructionsSubSection =
    buildSubSection({
      id: incomePlanInstructionsRoute,
      tabTitle: disabilityPensionFormMessage.basicInfo.incomePlanInstructionsTitle,
      title: disabilityPensionFormMessage.basicInfo.incomePlanInstructionsTitle,
      children: [
        buildMultiField({
          id: incomePlanInstructionsRoute,
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.incomePlan.instructionsTitle,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.instructionsDescription`,
              description: disabilityPensionFormMessage.incomePlan.instructionsDescription,
              marginBottom: 'p4',
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.bulletOne`,
              description: disabilityPensionFormMessage.incomePlan.instructionBullet1,
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.bulletTwo`,
              description: disabilityPensionFormMessage.incomePlan.instructionBullet2,
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.bulletThree`,
              description: disabilityPensionFormMessage.incomePlan.instructionBullet3,
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.bulletFour`,
              description: disabilityPensionFormMessage.incomePlan.instructionBullet4,
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.bulletFive`,
              description: disabilityPensionFormMessage.incomePlan.instructionBullet5,
            }),
            buildDescriptionField({
              id: `${incomePlanInstructionsRoute}.bulletSix`,
              description: disabilityPensionFormMessage.incomePlan.instructionBullet6,
            }),
          ],
        }),
      ],
    })
