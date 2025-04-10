import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const information = [
  buildDescriptionField({
    id: 'rehabilitationPlan.information',
    title:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .information,
    titleVariant: 'h3',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationCurrentPosition,
    value: 'Er í  atvinnuleit',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationApplicationFor,
    value: 'Áframhaldandi greiðslur',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationProgress,
    value: 'Lítil framvinda / lítil breyting',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationrExplanationOfProgress,
    value: 'Á ekki við',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationAttendance,
    value: '61-80%',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationExplanationOfAttendance,
    value: 'Á ekki við',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationChange,
    value: 'Já',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .informationExplanationOfChange,
    value:
      'Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
