import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { getApplicationExternalData } from '../../utils/medicalAndRehabilitationPaymentsUtils'
import { MedicalAndRehabilitationPaymentsApplicationType } from '../../utils/constants'

export const rehabilitationPlanSection = buildSection({
  id: 'rehabilitationPlanSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan.sectionTitle,
  condition: (_, externalData) => {
    const { marpApplicationType } = getApplicationExternalData(externalData)
    return (
      marpApplicationType ===
        MedicalAndRehabilitationPaymentsApplicationType.EH1 ||
      marpApplicationType ===
        MedicalAndRehabilitationPaymentsApplicationType.EH2
    )
  },
  children: [
    buildMultiField({
      id: 'rehabilitationPlan',
      title:
        medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
          .sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
          .description,
      children: [
        buildCustomField({
          id: 'rehabilitationPlanConfirmation',
          component: 'RehabilitationPlan',
        }),
      ],
    }),
  ],
})
