import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const activityAndParticipationImpairment = [
  buildDescriptionField({
    id: 'certificateForSicknessAndRehabilitation.activityAndParticipationImpairment',
    title:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .activityAndParticipationImpairment,
    titleVariant: 'h3',
    titleTooltip:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .activityAndParticipationImpairmentTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .activityAndParticipationImpairmentAffect,
    value: 'Mikil áhrif',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .activityAndParticipationImpairmentExplanation,
    value: 'Óvinnufær en er í háskólanámi, 1. áfangi.',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .activityAndParticipationImpairmentMainImpairmentExplanation,
    value: 'Á ekki við',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
