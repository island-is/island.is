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
            value: MaritalStatusEnum.SINGLE,
            label: disabilityPensionFormMessage.questions.maritalStatusSingle,
          },
          {
            value: MaritalStatusEnum.IN_RELATIONSHIP,
            label: disabilityPensionFormMessage.questions.maritalStatusInRelationship,
          },
          {
            value: MaritalStatusEnum.MARRIED,
            label: disabilityPensionFormMessage.questions.maritalStatusMarried,
          },
          {
            value: MaritalStatusEnum.DIVORCED,
            label: disabilityPensionFormMessage.questions.maritalStatusDivorced,
          },
          {
            value: MaritalStatusEnum.WIDOWED,
            label: disabilityPensionFormMessage.questions.maritalStatusWidowed,
          },
          {
            value: MaritalStatusEnum.UNKNOWN,
            label: disabilityPensionFormMessage.questions.maritalStatusUnknown,
          },
        ]
      })
    ]
  })
