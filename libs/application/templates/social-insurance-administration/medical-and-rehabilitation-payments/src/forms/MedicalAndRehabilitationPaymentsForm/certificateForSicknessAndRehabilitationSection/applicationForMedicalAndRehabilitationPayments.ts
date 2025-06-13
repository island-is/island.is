import {
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import format from 'date-fns/format'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const applicationForMedicalAndRehabilitationPayments = [
  buildDescriptionField({
    id: 'certificateForSicknessAndRehabilitation.applicationForMedicalAndRehabilitationPayments',
    title:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.application,
    titleVariant: 'h3',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .applicationCertificateRequestedBy,
    value: 'Heilbrigðisstofnun',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.applicationApplyingDueTo,
    value:
      'Endurhæfing (Sótt er greiðslur endurhæfingarlífeyris þegar umsækjandi er í virkri endurhæfingu með starfshæfnimarkmið).',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.applicationApplyingFor,
    value: 'Sótt er um í fyrsta skipti',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.applicationTypeOfTreatment,
    value: 'Starfsendurhæfing hjá VIRK',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.applicationIncludedInTreatment,
    value:
      'Þarf að auka líkamlega færi til atvinnuþátttöku og læra bjargráð vegna andlegra kvilla. Sótt hefur verið að komast að hjá VIRK.',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.applicationStartOfTreatment,
    value: format(new Date('2022-12-20'), 'dd.MM.yyyy'),
    colSpan: ['12/12', '12/12', '12/12', '4/12'],
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation
        .applicationEstimatedEndOfTreatment,
    value: 'Óljóst',
    colSpan: ['12/12', '12/12', '12/12', '4/12'],
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.applicationEstimatedTime,
    value: '12 mánuðir',
    colSpan: ['12/12', '12/12', '12/12', '4/12'],
    marginBottom: 3,
  }),
]
