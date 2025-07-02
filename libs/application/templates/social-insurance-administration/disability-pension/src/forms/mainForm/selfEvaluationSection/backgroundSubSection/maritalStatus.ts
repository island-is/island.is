import {
    buildMultiField,
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { MaritalStatusEnum } from '../../../../types'
import { SectionRouteEnum } from '../../../../types'

export const maritalStatusField =
  buildMultiField({
    id: SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS,
    title: disabilityPensionFormMessage.selfEvaluation.title,
    description: disabilityPensionFormMessage.selfEvaluation.description,
    children: [
      buildRadioField({
        id: SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS,
        title: disabilityPensionFormMessage.questions.maritalStatusTitle,
        options: [
          {
            value: MaritalStatusEnum.single,
            label: disabilityPensionFormMessage.questions.maritalStatusSingle,
          },
          {
            value: MaritalStatusEnum.inRelationship,
            label: disabilityPensionFormMessage.questions.maritalStatusInRelationship,
          },
          {
            value: MaritalStatusEnum.married,
            label: disabilityPensionFormMessage.questions.maritalStatusMarried,
          },
          {
            value: MaritalStatusEnum.divorced,
            label: disabilityPensionFormMessage.questions.maritalStatusDivorced,
          },
          {
            value: MaritalStatusEnum.widowed,
            label: disabilityPensionFormMessage.questions.maritalStatusWidowed,
          },
          {
            value: MaritalStatusEnum.unknown,
            label: disabilityPensionFormMessage.questions.maritalStatusUnknown,
          },
        ]
      })
    ]
  })
