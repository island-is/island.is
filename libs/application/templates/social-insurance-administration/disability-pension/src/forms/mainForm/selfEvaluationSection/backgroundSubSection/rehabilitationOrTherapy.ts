import {
    buildMultiField,
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { yesOrNoOptions } from '../../../../utils'

export const rehabilitationOrTherapyField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
      title: disabilityPensionFormMessage.questions.rehabilitationOrTherapyTitle,
      options: yesOrNoOptions,
    }),
  ],
})
