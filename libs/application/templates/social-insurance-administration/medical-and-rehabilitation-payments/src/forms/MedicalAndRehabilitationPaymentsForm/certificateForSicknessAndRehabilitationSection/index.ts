import { buildMultiField, buildSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { activityAndParticipationImpairment } from './activityAndParticipationImpairment'
import { applicationForMedicalAndRehabilitationPayments } from './applicationForMedicalAndRehabilitationPayments'
import { information } from './information'
import { managedBy } from './managedBy'
import { mentalImpairment } from './mentalImpairment'
import { physicalImpairment } from './physicalImpairment'

export const certificateForSicknessAndRehabilitationSection = buildSection({
  id: 'certificateForSicknessAndRehabilitationSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage
      .certificateForSicknessAndRehabilitation.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateForSicknessAndRehabilitation',
      title:
        medicalAndRehabilitationPaymentsFormMessage
          .certificateForSicknessAndRehabilitation.sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage
          .certificateForSicknessAndRehabilitation.description,
      children: [
        ...managedBy,
        ...information,
        ...physicalImpairment,
        ...mentalImpairment,
        ...activityAndParticipationImpairment,
        ...applicationForMedicalAndRehabilitationPayments,
      ],
    }),
  ],
})
