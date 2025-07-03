import {
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { IcelandicCapabilityEnum, SectionRouteEnum} from '../../../../types'

export const icelandicCapabilityField =
  buildRadioField({
    id: SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY,
    title: disabilityPensionFormMessage.questions.icelandicCapabilityTitle,
    options: [
      {
        value: IcelandicCapabilityEnum.POOR,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityPoor,
      },
      {
        value: IcelandicCapabilityEnum.FAIR,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityFair,
      },
      {
        value: IcelandicCapabilityEnum.GOOD,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityGood,
      },
      {
        value: IcelandicCapabilityEnum.VERY_GOOD,
        label: disabilityPensionFormMessage.questions.icelandicCapabilityVeryGood,
      },
    ]
  })
