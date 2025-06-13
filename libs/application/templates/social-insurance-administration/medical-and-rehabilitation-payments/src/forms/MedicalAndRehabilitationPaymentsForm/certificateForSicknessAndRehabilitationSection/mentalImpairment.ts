import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const mentalImpairment = [
  buildDescriptionField({
    id: 'certificateForSicknessAndRehabilitation.mentalImpairment',
    title:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.mentalImpairment,
    titleVariant: 'h3',
    titleTooltip:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.mentalImpairmentTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.mentalImpairmentAffect,
    value: 'Miðlungs áhrif',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.mentalImpairmentExplanation,
    value: 'Á ekki við',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
