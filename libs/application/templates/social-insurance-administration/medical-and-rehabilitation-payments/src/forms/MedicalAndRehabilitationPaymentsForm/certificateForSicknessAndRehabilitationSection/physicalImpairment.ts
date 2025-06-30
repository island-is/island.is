import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const physicalImpairment = [
  buildDescriptionField({
    id: 'certificateForSicknessAndRehabilitation.physicalImpairment',
    title:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.physicalImpairment,
    titleVariant: 'h3',
    titleTooltip:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.physicalImpairmentTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.physicalImpairmentAffect,
    value: 'Alvarleg áhrif',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.physicalImpairmentExplanation,
    value:
      'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
