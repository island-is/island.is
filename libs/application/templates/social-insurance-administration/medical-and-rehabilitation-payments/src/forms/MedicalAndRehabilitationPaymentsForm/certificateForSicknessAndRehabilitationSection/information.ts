import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import format from 'date-fns/format'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const information = [
  buildDescriptionField({
    id: 'certificateForSicknessAndRehabilitation.information',
    title:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.information,
    titleVariant: 'h3',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .informationDateOfLastExamination,
    value: format(new Date('2024-11-08'), 'dd.MM.yyyy'),
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.informationDateOfCertificate,
    value: format(new Date('2024-11-25'), 'dd.MM.yyyy'),
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.informationIncapacitatedDate,
    value: 'Frá desember 2022',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.informationICDAnalysis,
    value:
      '1. M05.9 (Seropositive rheumatoid arthritis, unspecified). \n2. AB1. Corem ipsum dolor sit amet. \n3. CD2 Nunc vulputate libero et velit interdum, ac aliquet odio mattis',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.informationMedicalHistory,
    value: 'Hefur farið í áfengismeðferð',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.informationCurrentStatus,
    value:
      'Er greindur með kulnun. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. ',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
