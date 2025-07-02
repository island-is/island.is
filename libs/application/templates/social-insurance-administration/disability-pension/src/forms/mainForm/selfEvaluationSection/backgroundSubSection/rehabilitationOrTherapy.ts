import {
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { yesOrNoOptions } from '../../../../utils'

export const rehabilitationOrTherapyField =
  buildRadioField({
    id: SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY,
    title: disabilityPensionFormMessage.questions.rehabilitationOrTherapyTitle,
    options: yesOrNoOptions,
  })
