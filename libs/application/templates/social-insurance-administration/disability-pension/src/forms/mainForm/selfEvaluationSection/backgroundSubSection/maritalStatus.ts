import {
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { backgroundRoute } from './index'
import { MaritalStatusEnum } from '../../../../lib/constants'

export const maritalStatusField =
  buildRadioField({
    id: `${backgroundRoute}.maritalStatus`,
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
