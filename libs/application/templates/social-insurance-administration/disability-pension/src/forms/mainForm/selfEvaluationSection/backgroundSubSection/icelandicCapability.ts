import {
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { IcelandicCapabilityEnum } from '../../../../lib/constants'
import { SectionRouteEnum } from '../../../../lib/routes'

export const icelandicCapabilityField =
  buildRadioField({
    id: SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY,
    title: disabilityPensionFormMessage.questions.icelandicCapabilityTitle,
    options: [
      {
        value: IcelandicCapabilityEnum.poor,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityPoor,
      },
      {
        value: IcelandicCapabilityEnum.fair,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityFair,
      },
      {
        value: IcelandicCapabilityEnum.good,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityGood,
      },
      {
        value: IcelandicCapabilityEnum.veryGood,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityVeryGood,
      },
    ]
  })
